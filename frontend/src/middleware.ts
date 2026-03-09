import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const accessToken = request.cookies.get('access_token');
    const refreshToken = request.cookies.get('refresh_token');
    const isLogined = accessToken || refreshToken;

    const { pathname } = request.nextUrl;

    if(!isLogined && pathname.startsWith('/feed')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if(isLogined && (pathname === '/login' || pathname === '/register')) {
        return NextResponse.redirect(new URL('/feed', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/feed/:path*', '/login', '/register'], // /feed로 시작하는 모든 경로 감시
};