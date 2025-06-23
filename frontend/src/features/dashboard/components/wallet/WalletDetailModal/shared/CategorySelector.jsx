import PropTypes from "prop-types";
import { TagIcon } from "@phosphor-icons/react";
import { CATEGORY_ICONS } from '../../../../constants/walletConstants.jsx';

export default function CategorySelector({
    categories,
    value,
    showCustomCategory,
    onCategoryChange,
    onCustomToggle,
    loading,
    type
}) {
    return (
        <fieldset className="fieldset">
            <legend className="fieldset-legend">分類</legend>
            <div className="mb-3">
                <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                        <button
                            key={category}
                            type="button"
                            className={`btn btn-sm ${value === category ? 'btn-neutral' : 'btn'}`}
                            onClick={() => {
                                onCategoryChange(category);
                                onCustomToggle(false);
                            }}
                            disabled={loading}
                        >
                            <span className="mr-1">
                                {CATEGORY_ICONS[type]?.[category]}
                            </span>
                            {category}
                        </button>
                    ))}
                    <button
                        type="button"
                        className={`btn btn-sm ${showCustomCategory ? 'btn-neutral' : 'btn'}`}
                        onClick={() => {
                            onCustomToggle(!showCustomCategory);
                            if (!showCustomCategory) onCategoryChange('');
                        }}
                        disabled={loading}
                    >
                        <TagIcon size={16} className="mr-1" />
            自訂分類
                    </button>
                </div>
            </div>
            {!showCustomCategory && (
                <select
                    className="select select-md w-full mb-2"
                    value={value}
                    onChange={e => onCategoryChange(e.target.value)}
                    disabled={loading}
                >
                    <option value="">選擇分類</option>
                    {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
            )}
            {showCustomCategory && (
                <label className="input validator w-full">
                    <TagIcon className="h-5 w-5 text-gray-500" />
                    <input
                        type="text"
                        className="grow"
                        placeholder="請輸入自訂分類"
                        value={value}
                        onChange={e => onCategoryChange(e.target.value)}
                        disabled={loading}
                    />
                </label>
            )}
            <p className="label">請選擇或輸入交易分類</p>
        </fieldset>
    );
}

CategorySelector.propTypes = {
    categories: PropTypes.array.isRequired,
    value: PropTypes.string.isRequired,
    showCustomCategory: PropTypes.bool.isRequired,
    onCategoryChange: PropTypes.func.isRequired,
    onCustomToggle: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    type: PropTypes.string.isRequired
}; 