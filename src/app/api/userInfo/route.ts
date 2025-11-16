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
      return NextResponse.json({ success: false, message: "userId 없음" }, { status: 400 });
    }

    // 타입 문제 해결: any 캐스팅
    const user: any = await User.findById(userId).lean();

    if (!user) {
      return NextResponse.json({ success: false, message: "사용자 없음" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      email: user.email,
      favoriteKeywords: user.favoriteKeywords || [],
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "서버 오류" }, { status: 500 });
  }
}
