import { NextRequest } from 'next/server';
import { refreshAccessToken } from '../auth/auth';

/**
 * 토큰 유무 확인 및 재발급 판단
 */
export async function handleAuth(request: NextRequest) {
    const accessToken = request.cookies.get('access_token')?.value;
    const refreshToken = request.cookies.get('refresh_token')?.value;
    
    // 액세스 토큰 없고 리프레시만 있을 때 재발급 시도
    if (!accessToken && refreshToken) {
        const newSmallToken = await refreshAccessToken(refreshToken);
        if (newSmallToken) {
            return { success: true, token: newSmallToken };
        }
    }

  return { success: !!accessToken, token: null };
}