import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { handleAuth } from "./lib/middleware/auth-guard";
import { AUTH_FORBIDDEN_PATHS } from './lib/middleware/config';

/**
 * 페이지 진입 전 인증 체크 및 쿠키 동기화
 */
export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get('access_token')?.value;

    // 피드 경로 권한 체크
    if(pathname.startsWith('/feed')) {
        const { success, token } = await handleAuth(request);

        if(!success) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        
        // 재발급 된 경우 쿠키 갱신
        if(token) {
            const response = NextResponse.next();
            response.cookies.set('access_token', token, { 
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax'
            });
            return response;
        }
    }

    // 이미 로그인 된 상태에서 로그인/가입 페이지 접근 차단 (배열로 체크)
    const isForbiddenPath = AUTH_FORBIDDEN_PATHS.includes(pathname);
    if(accessToken && isForbiddenPath) {
        return NextResponse.redirect(new URL('/feed', request.url));
    }
    
    return NextResponse.next();
}

/**
 * 미들에어 감시ㅏ 대상 경로
 */
export const config = {
    matcher: ['/feed/:path*', '/login', '/register'],
}