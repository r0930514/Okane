import ApiService from './ApiService';
import type { 
    ApiResponse,
    UserPreferencesResponse,
    UpdatePrimaryCurrencyRequest,
    UpdateUserPreferencesRequest
} from '@/lib/types';

class UserService {
    /**
     * 取得用戶偏好設定
     * @returns Promise<ApiResponse<UserPreferencesResponse>>
     */
    static async getUserPreferences(): Promise<ApiResponse<UserPreferencesResponse>> {
        return ApiService.get<UserPreferencesResponse>('/users/preferences', {
            tags: ['user-preferences'],
            revalidate: 300 // 5分鐘快取
        });
    }

    /**
     * 更新用戶主貨幣
     * @param primaryCurrency - 主貨幣代碼 (如: TWD, USD)
     * @returns Promise<ApiResponse>
     */
    static async updatePrimaryCurrency(primaryCurrency: string): Promise<ApiResponse> {
        const response = await ApiService.patch('/users/primary-currency', {
            primaryCurrency
        } as UpdatePrimaryCurrencyRequest, {
            cache: 'no-store'
        });

        // 成功更新後，重新驗證相關快取
        if (response.success && typeof window !== 'undefined') {
            // 觸發快取重新驗證 (需要在 App Router 中配合使用)
            // revalidateTag('user-preferences');
        }

        return response;
    }

    /**
     * 更新用戶偏好設定
     * @param preferences - 偏好設定物件
     * @returns Promise<ApiResponse>
     */
    static async updateUserPreferences(preferences: UpdateUserPreferencesRequest['preferences']): Promise<ApiResponse> {
        const response = await ApiService.patch('/users/preferences', {
            preferences
        } as UpdateUserPreferencesRequest, {
            cache: 'no-store'
        });

        // 成功更新後，重新驗證相關快取
        if (response.success && typeof window !== 'undefined') {
            // revalidateTag('user-preferences');
        }

        return response;
    }

    /**
     * 批量更新用戶設定 (主貨幣 + 偏好設定)
     * @param primaryCurrency - 主貨幣代碼
     * @param preferences - 偏好設定
     * @returns Promise<{ currency: ApiResponse, preferences: ApiResponse }>
     */
    static async updateUserSettings(
        primaryCurrency?: string,
        preferences?: UpdateUserPreferencesRequest['preferences']
    ): Promise<{
        currency?: ApiResponse;
        preferences?: ApiResponse;
    }> {
        const results: Record<string, unknown> = {};

        // 並行執行更新請求
        const promises: Promise<unknown>[] = [];

        if (primaryCurrency) {
            promises.push(
                this.updatePrimaryCurrency(primaryCurrency)
                    .then(result => ({ type: 'currency', result }))
            );
        }

        if (preferences) {
            promises.push(
                this.updateUserPreferences(preferences)
                    .then(result => ({ type: 'preferences', result }))
            );
        }

        // 等待所有請求完成
        const responses = await Promise.allSettled(promises);

        responses.forEach(response => {
            if (response.status === 'fulfilled') {
                const value = response.value as { type: string; result: unknown };
                results[value.type] = value.result;
            }
        });

        return results;
    }
}

export default UserService;