import axios from 'axios';
import ConfigService from '../../../shared/services/ConfigService';

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
  
    /**
     * 驗證電子郵件是否存在
     * @param {string} email - 電子郵件地址
     * @returns {Promise<Object>} 回傳 { success: boolean, exists?: boolean, error?: string }
     */
    static async verifyEmail(email) {
        try {
            const res = await this.authInstance.post('verify-email', { email });
            return { 
                success: true, 
                exists: res.data.exists 
            };
        } catch (error) {
            console.error('驗證 Email 時發生錯誤:', error);
            if (error.response?.status === 404) {
                return { 
                    success: true, 
                    exists: false 
                };
            }
            return this.handleError(error);
        }
    }

    /**
     * 使用者登入
     * @param {string} email - 電子郵件地址
     * @param {string} password - 密碼
     * @returns {Promise<Object>} 回傳 { success: boolean, token?: string, error?: string }
     */
    static async signin(email, password) {
        try {
            const res = await this.authInstance.post('signin', {
                email: email,
                password: password
            });
      
            if (res.status === 200) {
                return { 
                    success: true, 
                    token: res.data.access_token 
                };
            }
            return { error: '登入失敗，請重試' };
        } catch (error) {
            console.error('登入時發生錯誤:', error);
            return this.handleError(error);
        }
    }

    /**
     * 使用者註冊
     * @param {string} email - 電子郵件地址
     * @param {string} password - 密碼
     * @param {string} username - 使用者名稱
     * @returns {Promise<Object>} 回傳 { success: boolean, error?: string }
     */
    static async signup(email, password, username) {
        try {
            const res = await this.authInstance.post('signup', {
                email: email,
                username: username,
                password: password
            });
      
            if (res.status === 201) {
                return { success: true };
            }
            return { error: '註冊失敗，請重試' };
        } catch (error) {
            console.error('註冊時發生錯誤:', error);
            return this.handleError(error);
        }
    }

    /**
     * 驗證 Token 有效性
     * @returns {Promise<Object>} 回傳 { success: boolean, error?: string }
     */
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

    /**
     * 登出使用者
     * @returns {Promise<Object>} 回傳 { success: boolean }
     */
    static async logout() {
        localStorage.removeItem('token');
        return { success: true };
    }

    /**
     * 儲存認證 Token
     * @param {string} token - JWT Token
     */
    static saveToken(token) {
        localStorage.setItem('token', token);
    }

    /**
     * 取得儲存的 Token
     * @returns {string|null} JWT Token 或 null
     */
    static getToken() {
        return localStorage.getItem('token');
    }
}

export default AuthService;
