export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "userId가 없습니다." },
        { status: 400 }
      );
    }

    // 1) DB에서 키워드 가져오기
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "유저 없음" },
        { status: 404 }
      );
    }

    const keywords = user.favoriteKeywords;

    const results = [];

    // 2) keyword마다 네이버 API 호출
    for (const kw of keywords) {
      const res = await fetch(
        `https://openapi.naver.com/v1/search/news.json?query=${encodeURIComponent(
          kw
        )}&display=10`,
        {
          headers: {
            "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID!,
            "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET!,
          },
        }
      );

      const data = await res.json();

      results.push({
        keyword: kw,
        items: data.items || [],
      });
    }

    return NextResponse.json(
      { success: true, data: results },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "서버 오류" },
      { status: 500 }
    );
  }
}
