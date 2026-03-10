/**
 * 에지 런타임용 fetch 래퍼
 * Axios 못 써서 만든 거니까 타입 맞춰서 알아서 호출 ㄱㄱ
 */
export const api = {
    /**
     * POST 요청 보내기.
     * @param url - 백엔드 엔드포인트
     * @param body - 보낼 데이터 객체
     * @returns 
     */
    post: async <TResponse, TBody = unknown> ( url: string, body: TBody, headers?: Record<string, string> ): Promise<TResponse> => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}${url}`, {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json',
                        ...headers
             },
            body: JSON.stringify(body),
        });
        if(!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || 'API Error');
        }
            
        return res.json() as Promise<TResponse>;
    },
}