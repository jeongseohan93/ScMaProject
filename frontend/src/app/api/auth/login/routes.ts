import { NextResponse } from 'next/server';
import { api } from '@/src/lib/api/api-client'; 
import { LoginResponse } from '@/src/types/auth'; 

/**
 * 클라이언트(LoginForm)에서 오는 로그인 요청을 처리하는 서버 사이드 핸들러.
 * 브라우저 대신 백엔드 요청을 날리고, 받은 토큰을 '쿠키'에 안전하게 저장
 */
export async function POST(req: Request) {
    try {
        // 유저가 보낸 아이디/비번 데이터 꺼내기
        const body = await req.json();

        // 백엔드 서버에 로그인 요청
        const response = await api.post<LoginResponse>(
            '/api/auth/login', 
            body,
            {
                // 보안을 위해 유저의 IP와 접속 환경(User-Agent) 정보를 백엔드에 넘겨줌
                'x-forwarded-for': req.headers.get('x-forwarded-for') || '127.0.0.1',
                'user-agent': req.headers.get('user-agent') || '',
            }
        );

       // 백엔드에서 받은 응답 데이터(토큰, 유저 정보) 분해
        const { accessToken, refreshToken, user } = response;

        // 클라이언트에 보낼 기본 응답 객체 생성 (성공 여부와 유저 정보만 담음)
        const nextResponse = NextResponse.json({ success: true, user });

        // 액세스 토큰을 브라우저 쿠키에 구움 (5분 뒤 만료)
        nextResponse.cookies.set('access_token', accessToken as string, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 5 * 60,
        });

        // 리프레시 토큰도 쿠키에 구움 (30일 장기 보관용)
        nextResponse.cookies.set('refresh_token', refreshToken as string, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 30 * 24 * 60 * 60,
        });

        return nextResponse;

    } catch (error: unknown) {

        // 기본 에러 메시지 설정
        let message = '로그인 처리 중 오류가 발생';

        // 우리가 api.post에서 던진 구체적인 에러라면 그 메시지로 교체
        if (error instanceof Error) {
            message = error.message;
        }

        // 실패 응답 보냄 (로그인 실패는 보통 401 Unauthorized)
        return NextResponse.json(
            { message }, 
            { status: 401 } // 보통 로그인 실패는 401
        );
    }
}