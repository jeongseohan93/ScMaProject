import { client } from './client';
import { API_ENDPOINTS } from '../constants/api-endpoint';
import { RegisterInput, LoginInput } from '../validators/auth-schema';

export const loginAction = async (data: LoginInput) => {
   
    const response = await client.post(API_ENDPOINTS.LOGIN, data);

    return response.data;
}

export const registerAction = async (data: RegisterInput) => {
    
    const response = await client.post(API_ENDPOINTS.REGISTER, data);
    
    return response.data;
}