import axios from 'axios';

export const client = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
});

client.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || '알 수 없는 에러가 발생';
        return Promise.reject(new Error(message));
    }
)