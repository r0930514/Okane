import axios from 'axios';
import ConfigService from './ConfigService';

class AuthService {
    static authInstance = axios.create({
        baseURL: `${ConfigService.baseURL}auth/`,
        timeout: 10000, // 10 seconds timeout
    });

    static handleError(error) {
        if (error.code === 'ECONNABORTED') {
            return { error: '請求逾時，請檢查網路連線後重試' };
        }
    
        if (!error.response) {
            return { error: '網路連線異常，請稍後重試' };
        }

        switch (error.response.status) {
        case 401:
            return { error: '帳號或密碼錯誤' };
        case 404:
            return { error: '找不到該用戶' };
        case 500:
            return { error: '伺服器錯誤，請稍後重試' };
        default:
            return { error: '發生錯誤，請稍後重試' };
        }
    }
  
    static async verifyEmail(email, setIsLoading, nav) {
        setIsLoading(true);
        try {
            const res = await this.authInstance.post('verify-email', { email });
            if (res.data.exists) {
                nav('password');
            }
            return { success: true };
        } catch (error) {
            console.error('驗證 Email 時發生錯誤:', error);
            if (error.response?.status === 404) {
                nav('register');
                return { success: true };
            }
            return this.handleError(error);
        } finally {
            setIsLoading(false);
        }
    }
    static async signin(email, password, setIsLoading, nav) {
        setIsLoading(true);
        try {
            const res = await this.authInstance.post('signin', {
                email: email,
                password: password
            });
      
            if (res.status === 200) {
                localStorage.setItem('token', res.data.access_token);
                nav('/dashboard');
                return { success: true };
            }
            return { error: '登入失敗，請重試' };
        } catch (error) {
            console.error('登入時發生錯誤:', error);
            return this.handleError(error);
        } finally {
            setIsLoading(false);
        }
    }
    static async signup(email, password, username, setIsLoading, nav) {
        setIsLoading(true);
        try {
            const res = await this.authInstance.post('signup', {
                email: email,
                username: username,
                password: password
            });
      
            if (res.status === 201) {
                nav('/');
                return { success: true };
            }
            return { error: '註冊失敗，請重試' };
        } catch (error) {
            console.error('註冊時發生錯誤:', error);
            return this.handleError(error);
        } finally {
            setIsLoading(false);
        }
    }
    static async checkToken() {
        try {
            await this.authInstance.get('verifyToken', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return { success: true };
        } catch (error) {
            console.error('驗證 Token 時發生錯誤:', error);
            return this.handleError(error);
        }
    }
    static async logout(){
        localStorage.removeItem('token');
    }
}

export default AuthService;
