import ApiService from './ApiService';
import type { 
    ApiResponse, 
    LoginCredentials, 
    RegisterData, 
    AuthResponse as AuthResponseType,
    VerifyEmailRequest,
    VerifyEmailResponse,
    User
} from '@/lib/types';

class AuthService {
    /**
     * 驗證電子郵件是否存在
     * @param email - 電子郵件地址
     * @returns 回傳是否存在
     */
    static async verifyEmail(email: string): Promise<ApiResponse<VerifyEmailResponse>> {
        return ApiService.post<VerifyEmailResponse>('/auth/verify-email', { email } as VerifyEmailRequest, {
            cache: 'no-store' // 總是檢查最新狀態
        });
    }

    /**
     * 使用者登入
     * @param credentials - 登入憑證
     * @returns 回傳 access token
     */
    static async signin(credentials: LoginCredentials): Promise<ApiResponse<AuthResponseType>> {
        const response = await ApiService.post<AuthResponseType>('/auth/signin', credentials, {
            cache: 'no-store'
        });

        // 如果登入成功，設置 cookie
        if (response.success && response.data?.access_token) {
            ApiService.setAuthToken(response.data.access_token);
        }

        return response;
    }

    /**
     * 使用者註冊
     * @param userData - 註冊資料
     * @returns 回傳註冊結果
     */
    static async signup(userData: RegisterData): Promise<ApiResponse<User>> {
        return ApiService.post<User>('/auth/signup', userData, {
            cache: 'no-store'
        });
    }

    /**
     * 驗證 Token 有效性並取得用戶資訊
     * @returns 回傳用戶資訊
     */
    static async verifyToken(): Promise<ApiResponse<User>> {
        return ApiService.get<User>('/auth/verifyToken', {
            cache: 'no-store'
        });
    }

    /**
     * 登出使用者
     * @returns 回傳登出結果
     */
    static async logout(): Promise<ApiResponse<null>> {
        // 清除認證 token
        ApiService.clearAuthToken();
        
        return { success: true, data: null };
    }

    /**
     * 檢查用戶是否已登入 (Server-side 安全)
     * @returns 回傳用戶資訊或 null
     */
    static async getCurrentUser(): Promise<User | null> {
        try {
            const response = await this.verifyToken();
            return response.success ? response.data || null : null;
        } catch {
            return null;
        }
    }

    /**
     * 客戶端檢查是否有認證 token
     * @returns 是否有 token
     */
    static hasAuthToken(): boolean {
        if (typeof window === 'undefined') return false;
        
        try {
            const cookies = document.cookie.split(';');
            return cookies.some(cookie => cookie.trim().startsWith('auth-token='));
        } catch {
            return false;
        }
    }
}

export default AuthService;