export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    console.log("1. DB 연결 시도");
    await connectDB();
    console.log("2. DB 연결 성공");

    const body = await req.json();
    console.log("3. 요청 body:", body);
    const { email, pw } = body;

    console.log("4. User.findOne 실행");
    const user = await User.findOne({ email });
    console.log("5. User 검색 결과:", user);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "존재하지 않는 이메일입니다." },
        { status: 400 }
      );
    }

    if (user.pw !== pw) {
      return NextResponse.json(
        { success: false, message: "비밀번호가 틀렸습니다." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "로그인 성공!",
        userId: user._id.toString(),
        email: user.email,
        favoriteKeywords: user.favoriteKeywords || []
      },
      { status: 200 }
    );

  } catch (err) {
    console.error("🔥 API LOGIN ERROR:", err);
    return NextResponse.json(
      { success: false, message: "서버 오류" },
      { status: 500 }
    );
  }
}
