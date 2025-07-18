import type { ApiResponse, RequestOptions } from '@/lib/types';

class ApiService {
    private static get baseURL(): string {
        const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        return url.endsWith('/') ? url : url + '/';
    }

    /**
     * 通用 fetch 封裝，支援 SSR 和客戶端
     */
    static async request<T = unknown>(
        endpoint: string,
        options: RequestInit & RequestOptions = {}
    ): Promise<ApiResponse<T>> {
        const { cache, revalidate, tags, ...fetchOptions } = options;
        
        // 構建完整 URL
        const url = `${this.baseURL}${endpoint.startsWith('/') ? endpoint.slice(1) : endpoint}`;
        
        // 設置預設 headers
        const headers = new Headers(fetchOptions.headers);
        if (!headers.has('Content-Type')) {
            headers.set('Content-Type', 'application/json');
        }

        // 處理認證 token
        const token = await this.getAuthToken();
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }

        // 配置 Next.js 特定選項
        const nextOptions: RequestInit = {
            ...fetchOptions,
            headers,
        };

        // 設置快取策略
        if (cache !== undefined) {
            nextOptions.cache = cache;
        }
        if (revalidate !== undefined) {
            nextOptions.next = { 
                ...nextOptions.next, 
                revalidate 
            };
        }
        if (tags) {
            nextOptions.next = { 
                ...nextOptions.next, 
                tags 
            };
        }

        try {
            const response = await fetch(url, nextOptions);
            
            // 處理認證錯誤
            if (response.status === 401) {
                await this.handleAuthError();
                return { success: false, error: '未授權，請重新登入' };
            }

            // 處理其他 HTTP 錯誤
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return {
                    success: false,
                    error: errorData.message || `HTTP ${response.status}: ${response.statusText}`
                };
            }

            // 解析成功回應
            const data = await response.json();
            return { success: true, data };

        } catch (error) {
            console.error('API Request Error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : '網路連線異常'
            };
        }
    }

    /**
     * GET 請求
     */
    static async get<T = unknown>(
        endpoint: string, 
        options: RequestOptions = {}
    ): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'GET', ...options });
    }

    /**
     * POST 請求
     */
    static async post<T = unknown>(
        endpoint: string,
        data?: unknown,
        options: RequestOptions = {}
    ): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
            ...options
        });
    }

    /**
     * PATCH 請求
     */
    static async patch<T = unknown>(
        endpoint: string,
        data?: unknown,
        options: RequestOptions = {}
    ): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined,
            ...options
        });
    }

    /**
     * DELETE 請求
     */
    static async delete<T = unknown>(
        endpoint: string,
        options: RequestOptions = {}
    ): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'DELETE', ...options });
    }

    /**
     * 獲取認證 token (僅客戶端)
     */
    private static async getAuthToken(): Promise<string | null> {
        // 在服務端組件中，token 會通過其他方式處理
        if (typeof window === 'undefined') {
            return null;
        }
        
        // Client-side: 從 document.cookie 獲取
        try {
            const name = 'auth-token=';
            const decodedCookie = decodeURIComponent(document.cookie);
            const ca = decodedCookie.split(';');
            
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) === 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return null;
        } catch {
            return null;
        }
    }

    /**
     * 處理認證錯誤 (僅客戶端)
     */
    private static async handleAuthError(): Promise<void> {
        // 只在客戶端處理認證錯誤
        if (typeof window !== 'undefined') {
            // Client-side: 清除 cookie 並重定向
            document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            window.location.href = '/login';
        }
    }

    /**
     * 設置認證 token (僅用於客戶端)
     */
    static setAuthToken(token: string): void {
        if (typeof window !== 'undefined') {
            // 設置 HTTP-only cookie (需要後端配合)
            document.cookie = `auth-token=${token}; path=/; secure; samesite=strict`;
        }
    }

    /**
     * 清除認證 token
     */
    static clearAuthToken(): void {
        if (typeof window !== 'undefined') {
            document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        }
    }
}

export default ApiService;