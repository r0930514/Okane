import { useState, useEffect } from 'react';
import ExchangeRateService from '../services/ExchangeRateService';

/**
 * 取得匯率與換算金額的 hook
 * @param {object} params
 * @param {string} params.from - 主幣別
 * @param {string} params.to - 次要幣別
 * @param {number} params.amount - 要換算的金額
 * @param {string} [params.dataSource] - 資料來源（可選）
 * @returns {object} { rate, converted, loading, error }
 */
export default function useExchangeRate({ from, to, amount, dataSource }) {
    const [rate, setRate] = useState(1);
    const [converted, setConverted] = useState(amount || 0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let ignore = false;
        async function fetchRate() {
            if (!from || !to || from === to) {
                setRate(1);
                setConverted(amount || 0);
                setError(null);
                setLoading(false);
                return;
            }
            setLoading(true);
            setError(null);
            try {
                const r = await ExchangeRateService.getRate(from, to, dataSource);
                if (!ignore) {
                    setRate(r);
                    setConverted((amount || 0) * r);
                }
            } catch (e) {
                if (!ignore) setError(e);
            } finally {
                if (!ignore) setLoading(false);
            }
        }
        fetchRate();
        return () => { ignore = true; };
    }, [from, to, amount, dataSource]);

    return { rate, converted, loading, error };
} 