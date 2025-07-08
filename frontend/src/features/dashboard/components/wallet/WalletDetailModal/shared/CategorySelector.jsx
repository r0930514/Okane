import PropTypes from "prop-types";
import { TagIcon } from "@phosphor-icons/react";
import { CATEGORY_ICONS } from '../../../../constants/walletConstants.jsx';
import { useRef, useEffect } from 'react';

export default function CategorySelector({
    categories,
    value,
    showCustomCategory,
    onCategoryChange,
    onCustomToggle,
    loading,
    type
}) {
    const customInputRef = useRef(null);

    useEffect(() => {
        if (showCustomCategory && customInputRef.current) {
            customInputRef.current.focus();
        }
    }, [showCustomCategory]);

    return (
        <fieldset className="fieldset">
            <legend className="fieldset-legend">分類</legend>
            <div className="mb-3">
                <div className="flex flex-wrap gap-2 items-center">
                    {categories.map(category => (
                        <button
                            key={category}
                            type="button"
                            className={`btn btn-sm ${value === category ? 'btn-neutral' : 'btn-outline'}`}
                            onClick={() => {
                                onCategoryChange(category);
                                if (showCustomCategory) onCustomToggle(false);
                            }}
                            disabled={loading}
                        >
                            <span className="mr-1">
                                {CATEGORY_ICONS[type]?.[category]}
                            </span>
                            {category}
                        </button>
                    ))}
                    {!showCustomCategory && (
                        <button
                            type="button"
                            className="btn btn-sm btn-outline"
                            onClick={() => onCustomToggle(true)}
                            disabled={loading}
                        >
                            <TagIcon size={16} className="mr-1" />
                            自訂
                        </button>
                    )}
                </div>
            </div>

            {showCustomCategory && (
                <div className="form-control">
                    <label className="input input-bordered flex items-center gap-2">
                        <TagIcon className="h-5 w-5 text-gray-500" />
                        <input
                            ref={customInputRef}
                            type="text"
                            className="grow"
                            placeholder="請輸入自訂分類"
                            value={value}
                            onChange={e => onCategoryChange(e.target.value)}
                            disabled={loading}
                        />
                    </label>
                </div>
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