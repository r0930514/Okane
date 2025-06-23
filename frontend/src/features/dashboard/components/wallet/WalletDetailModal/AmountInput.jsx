import PropTypes from "prop-types";
import { CurrencyDollarIcon } from "@phosphor-icons/react";

export default function AmountInput({ value, onChange, loading }) {
    const handleAmountChange = (e) => {
        const val = e.target.value;
        // 只允許正數和小數點
        if (val === '' || /^\d*\.?\d*$/.test(val)) {
            onChange(val);
        }
    };

    return (
        <fieldset className="fieldset">
            <legend className="fieldset-legend">金額</legend>
            <label className="input validator w-full">
                <CurrencyDollarIcon className="h-5 w-5 text-gray-500" />
                <input
                    type="text"
                    className="grow"
                    placeholder="0.00"
                    value={value}
                    onChange={handleAmountChange}
                    disabled={loading}
                />
            </label>
            <p className="label">請輸入交易金額</p>
        </fieldset>
    );
}

AmountInput.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    loading: PropTypes.bool
}; 