import axios from 'axios';

// 서버에서 백엔드(Express) 호출할 때 쓸 공용 axios 인스턴스
export const serverApi = axios.create({
  baseURL: process.env.API_BASE,
  withCredentials: true,
});