import { api } from './axios';
import axios from 'axios';
/**
 * 
 * @param payload 
 * @returns 
 */
export async function register(payload: {
    email: string;
    password: string;
    name: string;
    nickname?: string;
    phoneNumber?: string;
    birth?: string;
    gender?: "MALE" | "FEMALE" | "OTHER";
    preferredLanguage?: "ko" | "en" | "ja";
    timeZone?: string;
}) {
    
    const res = await api.post("/auth/register", payload);
    return res.data;
}

export async function login( loginInfo: {
    email: string;
    password: string;
}){
    // 프론트 도메인 프록시(/api/auth/login)를 거쳐야 쿠키가 프론트 호스트에도 설정되어
    // SSR(authmeServer)에서도 refresh 토큰을 볼 수 있다.
    const back = "http://localhost:3005";
    const res = await axios.post(back + "/auth/login", loginInfo, { baseURL: "" });
    return res.data;
}

export async function logout(){

}

export async function authmeClient() {
  const res = await api.get("/auth/me"); // withCredentials: true면 쿠키 자동 포함(브라우저)
  return res.data;
}
