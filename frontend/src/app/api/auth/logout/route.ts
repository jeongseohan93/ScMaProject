import { NextResponse } from "next/server";
import { cookies} from "next/headers";
import axios from 'axios';

export async function POST(req: Request) {
    const cookieStore = cookies();
    const refreshToken = (await cookieStore).get("refresh_token")?.value;

    if(refreshToken) {
        try {
            await axios.post('http://localhost:3005/api/auth/logout', { refreshToken })
        } catch {
            console.error("로그아웃 실패");
        }
    }

    (await cookieStore).delete("access_token");
    (await cookieStore).delete("refresh_token");

    return NextResponse.json({success: true});
    
}