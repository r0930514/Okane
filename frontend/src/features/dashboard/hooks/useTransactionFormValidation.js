import { useCallback } from "react";

export default function useTransactionFormValidation({ requireDescription = false } = {}) {
    // 傳入 requireDescription 以決定描述是否必填
    const validate = useCallback((formData) => {
        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            return { valid: false, error: '請輸入有效的金額' };
        }
        if (requireDescription && !formData.description.trim()) {
            return { valid: false, error: '請輸入交易描述' };
        }
        if (!formData.category.trim()) {
            return { valid: false, error: '請選擇或輸入分類' };
        }
        if (!formData.date) {
            return { valid: false, error: '請選擇交易日期' };
        }
        return { valid: true, error: '' };
    }, [requireDescription]);

    return { validate };
} 