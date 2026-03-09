import { api } from '../api/api-client';

interface RefreshToken {
    access_token: string;
}

/**
 * 
 * 리프레시 토큰으로 액세스 토큰 재발급.
 * 실패 시 null 반환
 */
export async function refreshAccessToken(refreshToken: string): Promise<string | null> {
    try {
        const data = await api.post<RefreshToken>( '/auth/refresh', { refresh_token: refreshToken} )
        return data.access_token;
    } catch {
        return null;
    }
}