import axios from "axios";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3005",
    withCredentials: true, // ⭐ HTTPOnly 쿠키 인증의 핵심
    headers: {
        "Content-Type": "application/json",
  },
});

/**
 * - access / refresh 토큰은 JS에서 절대 다루지 않음
 * - 쿠키는 브라우저가 자동으로 붙여줌
 * - 401은 "로그인 안 됨 or 복구 실패"로 해석
 */
api.interceptors.response.use(
    (res) => res,
    (error) => {
        // 네트워크 에러 등
        if(!error.response) {
            return Promise.reject(error);
        }

        const status = error.response.status;

        if ( status === 401 ) {
            // 여기서 refresh 호출 x
            // 이유: /auth/me 자체가 슬라이딩 담당
            // 프론트는 그냥 "로그인 필요"로 판단
        }

        return Promise.reject(error);
    }
)