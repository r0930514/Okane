import ApiService from './ApiService';
import type { 
    ApiResponse,
    Wallet,
    WalletBalance,
    CreateWalletRequest,
    UpdateWalletRequest
} from '@/lib/types';

class WalletService {
    /**
     * 建立新錢包
     * @param walletData - 錢包資料
     * @returns Promise<ApiResponse<Wallet>>
     */
    static async createWallet(walletData: CreateWalletRequest): Promise<ApiResponse<Wallet>> {
        const response = await ApiService.post<Wallet>('/wallets', walletData, {
            cache: 'no-store'
        });

        // 成功建立後，重新驗證錢包列表快取
        if (response.success && typeof window !== 'undefined') {
            // revalidateTag('wallets');
        }

        return response;
    }

    /**
     * 取得使用者的所有錢包
     * @returns Promise<ApiResponse<Wallet[]>>
     */
    static async getAllWallets(): Promise<ApiResponse<Wallet[]>> {
        return ApiService.get<Wallet[]>('/wallets', {
            tags: ['wallets'],
            revalidate: 60 // 1分鐘快取
        });
    }

    /**
     * 取得特定錢包詳細資訊
     * @param id - 錢包 ID
     * @returns Promise<ApiResponse<Wallet>>
     */
    static async getWallet(id: string): Promise<ApiResponse<Wallet>> {
        return ApiService.get<Wallet>(`/wallets/${id}`, {
            tags: ['wallets', `wallet-${id}`],
            revalidate: 30 // 30秒快取
        });
    }

    /**
     * 取得錢包餘額
     * @param id - 錢包 ID
     * @returns Promise<ApiResponse<WalletBalance>>
     */
    static async getWalletBalance(id: string): Promise<ApiResponse<WalletBalance>> {
        return ApiService.get<WalletBalance>(`/wallets/${id}/balance`, {
            tags: ['wallet-balance', `wallet-balance-${id}`],
            revalidate: 10 // 10秒快取（餘額更新較頻繁）
        });
    }

    /**
     * 更新錢包資訊
     * @param id - 錢包 ID
     * @param updateData - 更新資料
     * @returns Promise<ApiResponse<Wallet>>
     */
    static async updateWallet(id: string, updateData: UpdateWalletRequest): Promise<ApiResponse<Wallet>> {
        const response = await ApiService.patch<Wallet>(`/wallets/${id}`, updateData, {
            cache: 'no-store'
        });

        // 成功更新後，重新驗證相關快取
        if (response.success && typeof window !== 'undefined') {
            // revalidateTag('wallets');
            // revalidateTag(`wallet-${id}`);
        }

        return response;
    }

    /**
     * 刪除錢包
     * @param id - 錢包 ID
     * @returns Promise<ApiResponse<null>>
     */
    static async deleteWallet(id: string): Promise<ApiResponse<null>> {
        const response = await ApiService.delete<null>(`/wallets/${id}`, {
            cache: 'no-store'
        });

        // 成功刪除後，重新驗證相關快取
        if (response.success && typeof window !== 'undefined') {
            // revalidateTag('wallets');
            // revalidateTag(`wallet-${id}`);
            // revalidateTag(`wallet-balance-${id}`);
        }

        return response;
    }


    /**
     * 取得錢包統計資訊
     * @returns Promise<ApiResponse<{ totalWallets: number, totalBalance: number, activeWallets: number }>>
     */
    static async getWalletStats(): Promise<ApiResponse<{
        totalWallets: number;
        totalBalance: number;
        activeWallets: number;
        balancesByCurrency: Record<string, number>;
    }>> {
        const walletsResponse = await this.getAllWallets();
        
        if (!walletsResponse.success || !walletsResponse.data) {
            return { success: false, error: '無法取得錢包資料' };
        }

        const wallets = walletsResponse.data;
        const activeWallets = wallets.filter(w => w.isActive);
        
        // 直接使用錢包資料中的餘額（不需要額外查詢）
        let totalBalance = 0;
        const balancesByCurrency: Record<string, number> = {};

        activeWallets.forEach(wallet => {
            totalBalance += wallet.balance;
            const currency = wallet.currency || 'TWD';
            balancesByCurrency[currency] = (balancesByCurrency[currency] || 0) + wallet.balance;
        });

        return {
            success: true,
            data: {
                totalWallets: wallets.length,
                totalBalance,
                activeWallets: activeWallets.length,
                balancesByCurrency
            }
        };
    }
}

export default WalletService;