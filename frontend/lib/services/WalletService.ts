import ApiService from './ApiService';
import type {
    ApiResponse,
    Account,
    CreateAccountRequest,
    CreateBankAccountRequest,
    CreateCashAccountRequest,
    CreateCryptoAccountRequest,
    UpdateAccountRequest,
    UpdateBankAccountRequest,
    UpdateCashAccountRequest,
    UpdateCryptoAccountRequest,
    // 向後相容性
    Wallet,
    CreateWalletRequest,
    UpdateWalletRequest,
    WalletBalance
} from '@/lib/types';

/**
 * 帳戶服務 (原錢包服務)
 * 提供帳戶管理相關功能，包含銀行、現金、加密貨幣帳戶
 */
class WalletService {
    // === 通用帳戶操作 ===

    /**
     * 建立新帳戶
     * @param accountData - 帳戶資料
     * @returns Promise<ApiResponse<Account>>
     */
    static async createAccount(accountData: CreateAccountRequest): Promise<ApiResponse<Account>> {
        const response = await ApiService.post<Account>('/accounts', accountData, {
            cache: 'no-store'
        });

        if (response.success && typeof window !== 'undefined') {
            // 成功建立後，重新驗證帳戶列表快取
            // revalidateTag('accounts');
        }

        return response;
    }

    /**
     * 取得使用者的所有帳戶
     * @param type - 可選的帳戶類型篩選
     * @returns Promise<ApiResponse<Account[]>>
     */
    static async getAllAccounts(type?: 'bank' | 'cash' | 'crypto'): Promise<ApiResponse<Account[]>> {
        const url = type ? `/accounts?type=${type}` : '/accounts';
        return ApiService.get<Account[]>(url, {
            tags: ['accounts'],
            revalidate: 60 // 1分鐘快取
        });
    }

    /**
     * 取得特定帳戶詳細資訊
     * @param id - 帳戶 ID
     * @returns Promise<ApiResponse<Account>>
     */
    static async getAccount(id: string): Promise<ApiResponse<Account>> {
        return ApiService.get<Account>(`/accounts/${id}`, {
            tags: ['accounts', `account-${id}`],
            revalidate: 30 // 30秒快取
        });
    }

    /**
     * 更新帳戶資訊
     * @param id - 帳戶 ID
     * @param updateData - 更新資料
     * @returns Promise<ApiResponse<Account>>
     */
    static async updateAccount(id: string, updateData: UpdateAccountRequest): Promise<ApiResponse<Account>> {
        const response = await ApiService.patch<Account>(`/accounts/${id}`, updateData, {
            cache: 'no-store'
        });

        if (response.success && typeof window !== 'undefined') {
            // 成功更新後，重新驗證相關快取
            // revalidateTag('accounts');
            // revalidateTag(`account-${id}`);
        }

        return response;
    }

    /**
     * 刪除帳戶（軟刪除）
     * @param id - 帳戶 ID
     * @returns Promise<ApiResponse<null>>
     */
    static async deleteAccount(id: string): Promise<ApiResponse<null>> {
        const response = await ApiService.delete<null>(`/accounts/${id}`, {
            cache: 'no-store'
        });

        if (response.success && typeof window !== 'undefined') {
            // 成功刪除後，重新驗證相關快取
            // revalidateTag('accounts');
            // revalidateTag(`account-${id}`);
        }

        return response;
    }

    /**
     * 恢復已刪除的帳戶
     * @param id - 帳戶 ID
     * @returns Promise<ApiResponse<Account>>
     */
    static async restoreAccount(id: string): Promise<ApiResponse<Account>> {
        const response = await ApiService.patch<Account>(`/accounts/${id}/restore`, {}, {
            cache: 'no-store'
        });

        if (response.success && typeof window !== 'undefined') {
            // revalidateTag('accounts');
            // revalidateTag(`account-${id}`);
        }

        return response;
    }

    /**
     * 更新帳戶餘額
     * @param id - 帳戶 ID
     * @returns Promise<ApiResponse<Account>>
     */
    static async updateAccountBalance(id: string): Promise<ApiResponse<Account>> {
        return ApiService.patch<Account>(`/accounts/${id}/balance`, {}, {
            cache: 'no-store'
        });
    }

    // === 銀行帳戶專用操作 ===

    /**
     * 建立銀行帳戶
     * @param accountData - 銀行帳戶資料
     * @returns Promise<ApiResponse<Account>>
     */
    static async createBankAccount(accountData: CreateBankAccountRequest): Promise<ApiResponse<Account>> {
        const response = await ApiService.post<Account>('/accounts/bank', accountData, {
            cache: 'no-store'
        });

        if (response.success && typeof window !== 'undefined') {
            // revalidateTag('accounts');
        }

        return response;
    }

    /**
     * 取得所有銀行帳戶
     * @returns Promise<ApiResponse<Account[]>>
     */
    static async getBankAccounts(): Promise<ApiResponse<Account[]>> {
        return ApiService.get<Account[]>('/accounts/bank', {
            tags: ['accounts', 'bank-accounts'],
            revalidate: 60
        });
    }

    /**
     * 更新銀行帳戶
     * @param id - 帳戶 ID
     * @param updateData - 更新資料
     * @returns Promise<ApiResponse<Account>>
     */
    static async updateBankAccount(id: string, updateData: UpdateBankAccountRequest): Promise<ApiResponse<Account>> {
        const response = await ApiService.patch<Account>(`/accounts/${id}/bank`, updateData, {
            cache: 'no-store'
        });

        if (response.success && typeof window !== 'undefined') {
            // revalidateTag('accounts');
            // revalidateTag(`account-${id}`);
        }

        return response;
    }

    // === 現金帳戶專用操作 ===

    /**
     * 建立現金帳戶
     * @param accountData - 現金帳戶資料
     * @returns Promise<ApiResponse<Account>>
     */
    static async createCashAccount(accountData: CreateCashAccountRequest): Promise<ApiResponse<Account>> {
        const response = await ApiService.post<Account>('/accounts/cash', accountData, {
            cache: 'no-store'
        });

        if (response.success && typeof window !== 'undefined') {
            // revalidateTag('accounts');
        }

        return response;
    }

    /**
     * 取得所有現金帳戶
     * @returns Promise<ApiResponse<Account[]>>
     */
    static async getCashAccounts(): Promise<ApiResponse<Account[]>> {
        return ApiService.get<Account[]>('/accounts/cash', {
            tags: ['accounts', 'cash-accounts'],
            revalidate: 60
        });
    }

    /**
     * 更新現金帳戶
     * @param id - 帳戶 ID
     * @param updateData - 更新資料
     * @returns Promise<ApiResponse<Account>>
     */
    static async updateCashAccount(id: string, updateData: UpdateCashAccountRequest): Promise<ApiResponse<Account>> {
        const response = await ApiService.patch<Account>(`/accounts/${id}/cash`, updateData, {
            cache: 'no-store'
        });

        if (response.success && typeof window !== 'undefined') {
            // revalidateTag('accounts');
            // revalidateTag(`account-${id}`);
        }

        return response;
    }

    // === 加密貨幣帳戶專用操作 ===

    /**
     * 建立加密貨幣帳戶
     * @param accountData - 加密貨幣帳戶資料
     * @returns Promise<ApiResponse<Account>>
     */
    static async createCryptoAccount(accountData: CreateCryptoAccountRequest): Promise<ApiResponse<Account>> {
        const response = await ApiService.post<Account>('/accounts/crypto', accountData, {
            cache: 'no-store'
        });

        if (response.success && typeof window !== 'undefined') {
            // revalidateTag('accounts');
        }

        return response;
    }

    /**
     * 取得所有加密貨幣帳戶
     * @returns Promise<ApiResponse<Account[]>>
     */
    static async getCryptoAccounts(): Promise<ApiResponse<Account[]>> {
        return ApiService.get<Account[]>('/accounts/crypto', {
            tags: ['accounts', 'crypto-accounts'],
            revalidate: 60
        });
    }

    /**
     * 更新加密貨幣帳戶
     * @param id - 帳戶 ID
     * @param updateData - 更新資料
     * @returns Promise<ApiResponse<Account>>
     */
    static async updateCryptoAccount(id: string, updateData: UpdateCryptoAccountRequest): Promise<ApiResponse<Account>> {
        const response = await ApiService.patch<Account>(`/accounts/${id}/crypto`, updateData, {
            cache: 'no-store'
        });

        if (response.success && typeof window !== 'undefined') {
            // revalidateTag('accounts');
            // revalidateTag(`account-${id}`);
        }

        return response;
    }

    // === 統計資訊 ===

    /**
     * 取得帳戶統計資訊
     * @returns Promise<ApiResponse<AccountStats>>
     */
    static async getAccountStats(): Promise<ApiResponse<{
        totalAccounts: number;
        totalBalance: number;
        activeAccounts: number;
        balancesByCurrency: Record<string, number>;
        accountsByType: Record<string, number>;
    }>> {
        return ApiService.get('/accounts/stats', {
            tags: ['account-stats'],
            revalidate: 30
        });
    }

    // === 向後相容性方法 ===

    /**
     * 建立新錢包（向後相容）
     * @param walletData - 錢包資料
     * @returns Promise<ApiResponse<Wallet>>
     */
    static async createWallet(walletData: CreateWalletRequest): Promise<ApiResponse<Wallet>> {
        return this.createAccount(walletData);
    }

    /**
     * 取得使用者的所有錢包（向後相容）
     * @returns Promise<ApiResponse<Wallet[]>>
     */
    static async getAllWallets(): Promise<ApiResponse<Wallet[]>> {
        return this.getAllAccounts();
    }

    /**
     * 取得特定錢包詳細資訊（向後相容）
     * @param id - 錢包 ID
     * @returns Promise<ApiResponse<Wallet>>
     */
    static async getWallet(id: string): Promise<ApiResponse<Wallet>> {
        return this.getAccount(id);
    }

    /**
     * 取得錢包餘額（向後相容）
     * @param id - 錢包 ID
     * @returns Promise<ApiResponse<WalletBalance>>
     */
    static async getWalletBalance(id: string): Promise<ApiResponse<WalletBalance>> {
        const accountResponse = await this.getAccount(id);

        if (!accountResponse.success || !accountResponse.data) {
            return { success: false, error: accountResponse.error || '無法取得帳戶資料' };
        }

        const account = accountResponse.data;
        return {
            success: true,
            data: {
                accountId: account.id,
                balance: account.balance,
                currency: account.currency,
                lastUpdated: account.updatedAt || new Date().toISOString()
            }
        };
    }

    /**
     * 更新錢包資訊（向後相容）
     * @param id - 錢包 ID
     * @param updateData - 更新資料
     * @returns Promise<ApiResponse<Wallet>>
     */
    static async updateWallet(id: string, updateData: UpdateWalletRequest): Promise<ApiResponse<Wallet>> {
        return this.updateAccount(id, updateData);
    }

    /**
     * 刪除錢包（向後相容）
     * @param id - 錢包 ID
     * @returns Promise<ApiResponse<null>>
     */
    static async deleteWallet(id: string): Promise<ApiResponse<null>> {
        return this.deleteAccount(id);
    }

    /**
     * 取得錢包統計資訊（向後相容）
     * @returns Promise<ApiResponse<WalletStats>>
     */
    static async getWalletStats(): Promise<ApiResponse<{
        totalWallets: number;
        totalBalance: number;
        activeWallets: number;
        balancesByCurrency: Record<string, number>;
    }>> {
        const statsResponse = await this.getAccountStats();

        if (!statsResponse.success || !statsResponse.data) {
            return { success: false, error: statsResponse.error || '無法取得統計資料' };
        }

        const stats = statsResponse.data;
        return {
            success: true,
            data: {
                totalWallets: stats.totalAccounts,
                totalBalance: stats.totalBalance,
                activeWallets: stats.activeAccounts,
                balancesByCurrency: stats.balancesByCurrency
            }
        };
    }
}

export default WalletService;