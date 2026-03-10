export interface userInfo {
    name: string;
}

/**
 * 백엔드에서 로그인 성공/실패 시 보내주는 응답 구조
 * 나중에 유저 닉네임이나 프로필 사진 같은게 추가되면 여기다 필드만 더 추가
 */
export interface LoginResponse {
    message: string; // 서버에서 보내는 안내 메시지
    accessToken?: string; // 로그인 성공 시 발급되는 어세스 토큰
    refreshToken?: string; // 로그인 성공 시 발급되는 리프레쉬 토큰
    user: userInfo;
}