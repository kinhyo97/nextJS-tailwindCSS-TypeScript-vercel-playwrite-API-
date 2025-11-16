export const dynamic = "force-dynamic";

import {NextResponse} from "next/server"
import { connectDB } from "@/lib/db";
import User from "@/models/User"

export async function POST(req:Request){
    try{
        await connectDB();

        const {userId, keyword} = await req.json();

        if(!userId || !keyword){
            return NextResponse.json(
                { success: false, message: "필수 값이 없습니다."},
                { status : 400}
            );
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $push : { favoriteKeywords : keyword}},
            {new: true}
        );

        return NextResponse.json(
            {
                success: true,
                message: "키워드 저장 완료",
                favoriteKeywords: updatedUser.favoriteKeywords,
            },
            {status:200}
        );
    }catch(err){
        console.error(err);
        return NextResponse.json(
                {success: false, message: "서버 오류"},
                {status: 500}
        );
    }
}