import axios from 'axios';

class ApiService {
    static get baseURL() {
        const url = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        return url.endsWith('/') ? url : url + '/';
    }

    static axiosInstance = axios.create({
        baseURL: ApiService.baseURL,
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
        }
    });

    static {
        // 添加請求攔截器來自動添加 Authorization header
        this.axiosInstance.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // 添加響應攔截器來處理認證錯誤
        this.axiosInstance.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    // Token 過期或無效，清除本地存儲並重定向到登入頁
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
    }
}

export default ApiService;