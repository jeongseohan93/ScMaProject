import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
    try{
        const body = await req.json();

        const response = await axios.post('http://localhost:3005/api/auth/login', body, {
            headers: {
            'x-forwarded-for': req.headers.get('x-forwarded-for') || '127.0.0.1',
            'user-agent': req.headers.get('user-agent') || '',
            }
        });

        const { accessToken, refreshToken, user} = response.data;

        const nextResponse = NextResponse.json({ success: true, user });

        nextResponse.cookies.set('access_token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 5 * 60,
        });

        nextResponse.cookies.set('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 30 * 24 * 60 * 60, // 30일
        });

        return nextResponse;

    } catch (error: unknown) {
        if(axios.isAxiosError(error)) {
            const status = error.response?.status || 500;
            const message = error.response?.data?.message || '로그인 처리 중 오류가 발생했습니다.';

            return NextResponse.json({ message }, { status });
        }

        return NextResponse.json(
            { message: '서버 내부 오류가 발생했습니다.'},
            {status: 500}
        );
    }
}