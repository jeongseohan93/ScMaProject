import axios from "axios";

export function getErrorMessage(err: unknown):string {
    if(axios.isAxiosError(err)) {
        const data = err.response?.data;

        //서버가 { message: string } 형태로 내려준 겨우
        if(data && typeof data === "object" && "message" in data) {
            const msg = (data as { message?: unknown }).message;
            if(typeof msg === "string" && msg.trim()){
                return msg;
            }
        }

        if (typeof err.message === "string" && err.message.trim()) {
            return err.message;
        }

        return "요청 처리 중 오류가 발생했습니다."
    }

    if ( err instanceof Error ) {
        return err.message;
    }

    return "회원가입 중 오류가 발생했습니다."
}