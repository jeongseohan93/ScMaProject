import { api } from './api-client';
import { API_ENDPOINTS } from "../constants/api-endpoint";
import { LoginInput } from '../validators/auth-schema';
import { LoginResponse } from '@/src/types/auth';

/**
 * 실제로 서버에 로그인을 요청하는 함수
 * @param data - 유저가 폼에 입력한 email, password 데이터
 * @returns 서버에서 준 응답 데이터(LoginResponse 타입)
 */
export const loginAction = async (data: LoginInput) => {
    // 제네릭에 <응답타입, 요청데이터타입>을 딱 박고 시작
    // response뒤에 .(점) 찍으면 message나 token이 자동 완성으로 나옴
    const response = await api.post<LoginResponse, LoginInput>(API_ENDPOINTS.LOGIN, data);

    return response;
}