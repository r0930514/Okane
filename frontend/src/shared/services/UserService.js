import { jwtDecode } from "jwt-decode";
import UserConfigService from "./UserConfigService";

class UserService{
    static getUser(){
        const token = localStorage.getItem('token');
        if (!token) return null;
        return jwtDecode(token);
    }

    /**
     * 取得用戶偏好設定
     */
    static async getUserPreferences() {
        return UserConfigService.getUserPreferences();
    }

    /**
     * 更新用戶主貨幣設定
     */
    static async updatePrimaryCurrency(currency) {
        return UserConfigService.updatePrimaryCurrency(currency);
    }

    /**
     * 更新用戶偏好設定
     */
    static async updateUserPreferences(preferences) {
        return UserConfigService.updateUserPreferences(preferences);
    }
  
}

export default UserService;
