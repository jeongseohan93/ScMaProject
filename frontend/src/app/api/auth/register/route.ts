import { NextResponse } from 'next/server';
import axios from 'axios';
import { headers } from 'next/headers';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const forwardHeaders = {
            'x-forwarded-for': req.headers.get('x-forwarded-for') || '127.0.0.1',
            'user-agent': req.headers.get('user-agent') || '',
            'Content-Type': 'application/json',
        };

        const response = await axios.post('http://localhost:3005/api/auth/register', body, { headers: forwardHeaders });

        return NextResponse.json(response.data, { status: 201});

    } catch (error: unknown){

        if(axios.isAxiosError(error)) {
            const status = error.response?.status || 500;
            const message = error.response?.data?.message || '회원가입 처리 중 오류가 발생했습니다.';

            return NextResponse.json({ message }, { status });
        }

        return NextResponse.json(
            { message: '서버 내부 오류가 발생했습니다.'},
            {status: 500}
        );
    }
}