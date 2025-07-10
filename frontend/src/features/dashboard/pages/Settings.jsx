import { useState, useEffect } from 'react';
import { DashboardLayout } from '..';
import { WalletModuleService, WalletConfigService, UserService, UserConfigService, ExchangeRateService } from '../../../shared';
import { Plus, PencilSimple, Trash, Gear, User, CurrencyCircleDollar, TrendUp } from '@phosphor-icons/react';

export default function SettingsPage() {
    const [modules, setModules] = useState([]);
    const [configs, setConfigs] = useState([]);
    const [userPreferences, setUserPreferences] = useState(null);
    const [exchangeRates, setExchangeRates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('preferences');
    const [showModuleModal, setShowModuleModal] = useState(false);
    const [showConfigModal, setShowConfigModal] = useState(false);
    const [editingModule, setEditingModule] = useState(null);
    const [editingConfig, setEditingConfig] = useState(null);
    const [updating, setUpdating] = useState(false);
    const [loadingRates, setLoadingRates] = useState(false);

    const [moduleForm, setModuleForm] = useState({
        moduleName: '',
        moduleConfigFormat: {},
        moduleCallURL: ''
    });

    const [configForm, setConfigForm] = useState({
        moduleId: '',
        moduleConfigData: {}
    });

    // 支援的貨幣列表
    const supportedCurrencies = UserConfigService.getSupportedCurrencies();

    // 載入數據
    const loadData = async () => {
        setLoading(true);
        try {
            const [modulesResult, configsResult, preferencesResult] = await Promise.all([
                WalletModuleService.getAllModules(),
                WalletConfigService.getAllConfigs(),
                UserService.getUserPreferences().catch(() => ({ success: false }))
            ]);

            if (modulesResult.success) {
                setModules(modulesResult.data);
            }
            if (configsResult.success) {
                setConfigs(configsResult.data);
            }
            if (preferencesResult.success) {
                setUserPreferences(preferencesResult.data);
            } else {
                // 設定預設值
                setUserPreferences({
                    primaryCurrency: 'TWD',
                    preferences: {
                        language: 'zh-TW',
                        theme: 'light',
                        notifications: {
                            email: true,
                            push: false
                        }
                    }
                });
            }
        } catch (error) {
            console.error('載入數據時發生錯誤:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // 用戶偏好設定管理
    const handleUpdatePrimaryCurrency = async (currency) => {
        setUpdating(true);
        try {
            const result = await UserService.updatePrimaryCurrency(currency);
            if (result.success) {
                setUserPreferences(prev => ({
                    ...prev,
                    primaryCurrency: currency
                }));
                // 重新載入錢包數據以反映新的主貨幣
                window.location.reload();
            } else {
                alert('更新主貨幣失敗: ' + result.error);
            }
        } catch (error) {
            alert('更新主貨幣時發生錯誤: ' + error.message);
        } finally {
            setUpdating(false);
        }
    };

    const handleUpdatePreferences = async (newPreferences) => {
        setUpdating(true);
        try {
            const result = await UserService.updateUserPreferences(newPreferences);
            if (result.success) {
                setUserPreferences(prev => ({
                    ...prev,
                    preferences: newPreferences
                }));
            } else {
                alert('更新偏好設定失敗: ' + result.error);
            }
        } catch (error) {
            alert('更新偏好設定時發生錯誤: ' + error.message);
        } finally {
            setUpdating(false);
        }
    };

    // 匯率管理
    const loadExchangeRates = async () => {
        setLoadingRates(true);
        try {
            // 載入常用匯率對
            const commonPairs = [
                { from: 'USD', to: 'TWD' },
                { from: 'TWD', to: 'USD' },
                { from: 'EUR', to: 'TWD' },
                { from: 'JPY', to: 'TWD' },
                { from: 'USDT', to: 'TWD' },
                { from: 'BTC', to: 'TWD' },
                { from: 'ETH', to: 'TWD' }
            ];

            const ratePromises = commonPairs.map(async ({ from, to }) => {
                try {
                    const multiProviderData = await ExchangeRateService.getMultiProviderRates(from, to, 3);
                    return {
                        pair: `${from}/${to}`,
                        from,
                        to,
                        rates: multiProviderData.success ? multiProviderData.data : []
                    };
                } catch (error) {
                    console.error(`Failed to load rates for ${from}/${to}:`, error);
                    return {
                        pair: `${from}/${to}`,
                        from,
                        to,
                        rates: []
                    };
                }
            });

            const results = await Promise.all(ratePromises);
            setExchangeRates(results);
        } catch (error) {
            console.error('載入匯率時發生錯誤:', error);
        } finally {
            setLoadingRates(false);
        }
    };

    const handleInitializeFakeData = async () => {
        setUpdating(true);
        try {
            const response = await ExchangeRateService.initializeFakeData();
            if (response.success) {
                alert('假資料初始化成功！');
                await loadExchangeRates();
            } else {
                alert('初始化失敗: ' + response.error);
            }
        } catch (error) {
            alert('初始化時發生錯誤: ' + error.message);
        } finally {
            setUpdating(false);
        }
    };

    // 模組管理
    const handleCreateModule = () => {
        setEditingModule(null);
        setModuleForm({
            moduleName: '',
            moduleConfigFormat: {},
            moduleCallURL: ''
        });
        setShowModuleModal(true);
    };

    const handleEditModule = (module) => {
        setEditingModule(module);
        setModuleForm({
            moduleName: module.moduleName,
            moduleConfigFormat: module.moduleConfigFormat,
            moduleCallURL: module.moduleCallURL || ''
        });
        setShowModuleModal(true);
    };

    const handleSubmitModule = async (e) => {
        e.preventDefault();
        
        try {
            let configFormat;
            if (typeof moduleForm.moduleConfigFormat === 'string') {
                configFormat = JSON.parse(moduleForm.moduleConfigFormat);
            } else {
                configFormat = moduleForm.moduleConfigFormat;
            }

            const moduleData = {
                ...moduleForm,
                moduleConfigFormat: configFormat
            };

            const result = editingModule
                ? await WalletModuleService.updateModule(editingModule.id, moduleData)
                : await WalletModuleService.createModule(moduleData);

            if (result.success) {
                setShowModuleModal(false);
                await loadData();
            } else {
                alert('操作失敗: ' + result.error);
            }
        } catch (error) {
            alert('提交時發生錯誤: ' + error.message);
        }
    };

    const handleDeleteModule = async (moduleId) => {
        if (window.confirm('確定要刪除這個錢包模組嗎？')) {
            const result = await WalletModuleService.deleteModule(moduleId);
            if (result.success) {
                await loadData();
            } else {
                alert('刪除失敗: ' + result.error);
            }
        }
    };

    // 配置管理
    const handleCreateConfig = () => {
        setEditingConfig(null);
        setConfigForm({
            moduleId: '',
            moduleConfigData: {}
        });
        setShowConfigModal(true);
    };

    const handleEditConfig = (config) => {
        setEditingConfig(config);
        setConfigForm({
            moduleId: config.moduleId,
            moduleConfigData: config.moduleConfigData
        });
        setShowConfigModal(true);
    };

    const handleSubmitConfig = async (e) => {
        e.preventDefault();
        
        try {
            let configData;
            if (typeof configForm.moduleConfigData === 'string') {
                configData = JSON.parse(configForm.moduleConfigData);
            } else {
                configData = configForm.moduleConfigData;
            }

            const submitData = {
                moduleId: parseInt(configForm.moduleId),
                moduleConfigData: configData
            };

            const result = editingConfig
                ? await WalletConfigService.updateConfig(editingConfig.id, submitData)
                : await WalletConfigService.createConfig(submitData);

            if (result.success) {
                setShowConfigModal(false);
                await loadData();
            } else {
                alert('操作失敗: ' + result.error);
            }
        } catch (error) {
            alert('提交時發生錯誤: ' + error.message);
        }
    };

    const handleDeleteConfig = async (configId) => {
        if (window.confirm('確定要刪除這個錢包配置嗎？')) {
            const result = await WalletConfigService.deleteConfig(configId);
            if (result.success) {
                await loadData();
            } else {
                alert('刪除失敗: ' + result.error);
            }
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="p-6">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded-sm mb-4"></div>
                        <div className="h-32 bg-gray-200 rounded-sm"></div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">系統設定</h1>
                </div>

                {/* 標籤頁 */}
                <div className="tabs tabs-boxed mb-6">
                    <button 
                        className={`tab ${activeTab === 'preferences' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('preferences')}
                    >
                        <User size={18} className="mr-2" />
                        用戶偏好
                    </button>
                    <button 
                        className={`tab ${activeTab === 'modules' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('modules')}
                    >
                        錢包模組
                    </button>
                    <button 
                        className={`tab ${activeTab === 'configs' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('configs')}
                    >
                        錢包配置
                    </button>
                    <button 
                        className={`tab ${activeTab === 'exchange-rates' ? 'tab-active' : ''}`}
                        onClick={() => {
                            setActiveTab('exchange-rates');
                            if (exchangeRates.length === 0) {
                                loadExchangeRates();
                            }
                        }}
                    >
                        <TrendUp size={18} className="mr-2" />
                        匯率管理
                    </button>
                </div>

                {/* 用戶偏好設定標籤頁 */}
                {activeTab === 'preferences' && userPreferences && (
                    <div>
                        <h2 className="text-xl font-semibold mb-6">用戶偏好設定</h2>
                        
                        {/* 主貨幣設定 */}
                        <div className="card bg-base-100 shadow-xs border mb-6">
                            <div className="card-body">
                                <div className="flex items-center mb-4">
                                    <CurrencyCircleDollar size={24} className="mr-3 text-primary" />
                                    <h3 className="card-title">主貨幣設定</h3>
                                </div>
                                <p className="text-gray-600 mb-4">
                                    選擇您的主要貨幣，這將影響淨資產計算和資產總覽的顯示
                                </p>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">目前主貨幣</span>
                                        <span className="label-text-alt">
                                            {supportedCurrencies.find(c => c.code === userPreferences.primaryCurrency)?.name}
                                        </span>
                                    </label>
                                    <select
                                        className="select select-bordered w-full max-w-xs"
                                        value={userPreferences.primaryCurrency}
                                        onChange={(e) => handleUpdatePrimaryCurrency(e.target.value)}
                                        disabled={updating}
                                    >
                                        {supportedCurrencies.map(currency => (
                                            <option key={currency.code} value={currency.code}>
                                                {currency.symbol} {currency.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {updating && (
                                    <div className="mt-4">
                                        <div className="loading loading-spinner loading-sm mr-2"></div>
                                        <span className="text-sm text-gray-600">更新中...</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 其他偏好設定 */}
                        <div className="card bg-base-100 shadow-xs border">
                            <div className="card-body">
                                <h3 className="card-title mb-4">其他偏好設定</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* 語言設定 */}
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">語言</span>
                                        </label>
                                        <select
                                            className="select select-bordered"
                                            value={userPreferences.preferences?.language || 'zh-TW'}
                                            onChange={(e) => handleUpdatePreferences({
                                                ...userPreferences.preferences,
                                                language: e.target.value
                                            })}
                                            disabled={updating}
                                        >
                                            <option value="zh-TW">繁體中文</option>
                                            <option value="zh-CN">简体中文</option>
                                            <option value="en-US">English</option>
                                            <option value="ja-JP">日本語</option>
                                        </select>
                                    </div>

                                    {/* 主題設定 */}
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">主題</span>
                                        </label>
                                        <select
                                            className="select select-bordered"
                                            value={userPreferences.preferences?.theme || 'light'}
                                            onChange={(e) => handleUpdatePreferences({
                                                ...userPreferences.preferences,
                                                theme: e.target.value
                                            })}
                                            disabled={updating}
                                        >
                                            <option value="light">淺色主題</option>
                                            <option value="dark">深色主題</option>
                                            <option value="auto">自動切換</option>
                                        </select>
                                    </div>
                                </div>

                                {/* 通知設定 */}
                                <div className="mt-6">
                                    <h4 className="font-semibold mb-3">通知設定</h4>
                                    <div className="space-y-3">
                                        <div className="form-control">
                                            <label className="label cursor-pointer justify-start">
                                                <input
                                                    type="checkbox"
                                                    className="checkbox mr-3"
                                                    checked={userPreferences.preferences?.notifications?.email ?? true}
                                                    onChange={(e) => handleUpdatePreferences({
                                                        ...userPreferences.preferences,
                                                        notifications: {
                                                            ...userPreferences.preferences?.notifications,
                                                            email: e.target.checked
                                                        }
                                                    })}
                                                    disabled={updating}
                                                />
                                                <span className="label-text">電子郵件通知</span>
                                            </label>
                                        </div>
                                        
                                        <div className="form-control">
                                            <label className="label cursor-pointer justify-start">
                                                <input
                                                    type="checkbox"
                                                    className="checkbox mr-3"
                                                    checked={userPreferences.preferences?.notifications?.push ?? false}
                                                    onChange={(e) => handleUpdatePreferences({
                                                        ...userPreferences.preferences,
                                                        notifications: {
                                                            ...userPreferences.preferences?.notifications,
                                                            push: e.target.checked
                                                        }
                                                    })}
                                                    disabled={updating}
                                                />
                                                <span className="label-text">推播通知</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 錢包模組標籤頁 */}
                {activeTab === 'modules' && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">錢包模組管理</h2>
                            <button 
                                className="btn btn-primary"
                                onClick={handleCreateModule}
                            >
                                <Plus size={20} />
                                新增模組
                            </button>
                        </div>

                        <div className="grid gap-4">
                            {modules.map(module => (
                                <div key={module.id} className="card bg-base-100 shadow-xs border">
                                    <div className="card-body">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="card-title">{module.moduleName}</h3>
                                                <p className="text-gray-600">{module.moduleCallURL}</p>
                                                <details className="mt-2">
                                                    <summary className="cursor-pointer text-sm text-gray-500">
                                                        配置格式
                                                    </summary>
                                                    <pre className="text-xs bg-gray-100 p-2 rounded-sm mt-1 overflow-auto">
                                                        {JSON.stringify(module.moduleConfigFormat, null, 2)}
                                                    </pre>
                                                </details>
                                            </div>
                                            <div className="flex gap-2">
                                                <button 
                                                    className="btn btn-sm btn-ghost"
                                                    onClick={() => handleEditModule(module)}
                                                >
                                                    <PencilSimple size={16} />
                                                </button>
                                                <button 
                                                    className="btn btn-sm btn-ghost text-red-600"
                                                    onClick={() => handleDeleteModule(module.id)}
                                                >
                                                    <Trash size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 錢包配置標籤頁 */}
                {activeTab === 'configs' && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">錢包配置管理</h2>
                            <button 
                                className="btn btn-primary"
                                onClick={handleCreateConfig}
                            >
                                <Gear size={20} />
                                新增配置
                            </button>
                        </div>

                        <div className="grid gap-4">
                            {configs.map(config => {
                                const module = modules.find(m => m.id === config.moduleId);
                                return (
                                    <div key={config.id} className="card bg-base-100 shadow-xs border">
                                        <div className="card-body">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="card-title">
                                                        配置 #{config.id}
                                                    </h3>
                                                    <p className="text-gray-600">
                                                        模組: {module?.moduleName || '未知'}
                                                    </p>
                                                    <details className="mt-2">
                                                        <summary className="cursor-pointer text-sm text-gray-500">
                                                            配置數據
                                                        </summary>
                                                        <pre className="text-xs bg-gray-100 p-2 rounded-sm mt-1 overflow-auto">
                                                            {JSON.stringify(config.moduleConfigData, null, 2)}
                                                        </pre>
                                                    </details>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button 
                                                        className="btn btn-sm btn-ghost"
                                                        onClick={() => handleEditConfig(config)}
                                                    >
                                                        <PencilSimple size={16} />
                                                    </button>
                                                    <button 
                                                        className="btn btn-sm btn-ghost text-red-600"
                                                        onClick={() => handleDeleteConfig(config.id)}
                                                    >
                                                        <Trash size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* 匯率管理標籤頁 */}
                {activeTab === 'exchange-rates' && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">匯率管理</h2>
                            <button 
                                className="btn btn-primary"
                                onClick={handleInitializeFakeData}
                                disabled={updating}
                            >
                                {updating ? (
                                    <span className="loading loading-spinner loading-sm"></span>
                                ) : (
                                    <TrendUp size={20} />
                                )}
                                初始化假資料
                            </button>
                        </div>

                        {loadingRates ? (
                            <div className="grid gap-4">
                                {[...Array(7)].map((_, i) => (
                                    <div key={i} className="card bg-base-100 shadow-xs border">
                                        <div className="card-body">
                                            <div className="animate-pulse">
                                                <div className="h-6 bg-gray-200 rounded-sm w-1/4 mb-4"></div>
                                                <div className="h-4 bg-gray-200 rounded-sm w-1/2 mb-2"></div>
                                                <div className="h-4 bg-gray-200 rounded-sm w-3/4"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {exchangeRates.map(({ pair, from, to, rates }) => (
                                    <div key={pair} className="card bg-base-100 shadow-xs border">
                                        <div className="card-body">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="card-title">{pair}</h3>
                                                    <p className="text-gray-600">
                                                        {from} 轉換為 {to}
                                                    </p>
                                                </div>
                                                <div className="badge badge-outline">
                                                    {rates.length} 個供應商
                                                </div>
                                            </div>

                                            {rates.length > 0 ? (
                                                <div className="overflow-x-auto">
                                                    <table className="table table-sm">
                                                        <thead>
                                                            <tr>
                                                                <th>供應商</th>
                                                                <th>匯率</th>
                                                                <th>更新時間</th>
                                                                <th>類型</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {rates.map((rate, index) => (
                                                                <tr key={index}>
                                                                    <td>
                                                                        <div className="font-semibold">
                                                                            {rate.provider?.displayName || '未知供應商'}
                                                                        </div>
                                                                        <div className="text-xs text-gray-500">
                                                                            {rate.provider?.name}
                                                                        </div>
                                                                    </td>
                                                                    <td className="font-mono">
                                                                        {parseFloat(rate.rate).toFixed(8)}
                                                                    </td>
                                                                    <td className="text-sm text-gray-600">
                                                                        {new Date(rate.timestamp).toLocaleString('zh-TW')}
                                                                    </td>
                                                                    <td>
                                                                        <span className="badge badge-sm">
                                                                            {rate.rateType}
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            ) : (
                                                <div className="text-center py-8 text-gray-500">
                                                    <TrendUp size={32} className="mx-auto mb-2 opacity-50" />
                                                    <p>此匯率對尚無資料</p>
                                                    <p className="text-sm">請先初始化假資料</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {exchangeRates.length === 0 && !loadingRates && (
                                    <div className="text-center py-12">
                                        <TrendUp size={48} className="mx-auto mb-4 text-gray-400" />
                                        <h3 className="text-lg font-semibold text-gray-600 mb-2">尚未載入匯率資料</h3>
                                        <p className="text-gray-500 mb-4">點擊「初始化假資料」按鈕開始使用匯率功能</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* 模組表單模態框 */}
                {showModuleModal && (
                    <div className="modal modal-open">
                        <div className="modal-box max-w-2xl">
                            <h3 className="font-bold text-lg mb-4">
                                {editingModule ? '編輯模組' : '新增模組'}
                            </h3>

                            <form onSubmit={handleSubmitModule}>
                                <div className="form-control mb-4">
                                    <label className="label">
                                        <span className="label-text">模組名稱</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="input input-bordered"
                                        value={moduleForm.moduleName}
                                        onChange={(e) => setModuleForm({
                                            ...moduleForm,
                                            moduleName: e.target.value
                                        })}
                                        required
                                    />
                                </div>

                                <div className="form-control mb-4">
                                    <label className="label">
                                        <span className="label-text">API URL</span>
                                    </label>
                                    <input
                                        type="url"
                                        className="input input-bordered"
                                        value={moduleForm.moduleCallURL}
                                        onChange={(e) => setModuleForm({
                                            ...moduleForm,
                                            moduleCallURL: e.target.value
                                        })}
                                    />
                                </div>

                                <div className="form-control mb-4">
                                    <label className="label">
                                        <span className="label-text">配置格式 (JSON)</span>
                                    </label>
                                    <textarea
                                        className="textarea textarea-bordered h-32"
                                        value={JSON.stringify(moduleForm.moduleConfigFormat, null, 2)}
                                        onChange={(e) => {
                                            try {
                                                const parsed = JSON.parse(e.target.value);
                                                setModuleForm({
                                                    ...moduleForm,
                                                    moduleConfigFormat: parsed
                                                });
                                            } catch {
                                                // 忽略 JSON 解析錯誤，允許用戶繼續編輯
                                                setModuleForm({
                                                    ...moduleForm,
                                                    moduleConfigFormat: e.target.value
                                                });
                                            }
                                        }}
                                        required
                                    />
                                </div>

                                <div className="modal-action">
                                    <button type="submit" className="btn btn-primary">
                                        {editingModule ? '更新' : '創建'}
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn"
                                        onClick={() => setShowModuleModal(false)}
                                    >
                                        取消
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* 配置表單模態框 */}
                {showConfigModal && (
                    <div className="modal modal-open">
                        <div className="modal-box max-w-2xl">
                            <h3 className="font-bold text-lg mb-4">
                                {editingConfig ? '編輯配置' : '新增配置'}
                            </h3>

                            <form onSubmit={handleSubmitConfig}>
                                <div className="form-control mb-4">
                                    <label className="label">
                                        <span className="label-text">選擇模組</span>
                                    </label>
                                    <select
                                        className="select select-bordered"
                                        value={configForm.moduleId}
                                        onChange={(e) => setConfigForm({
                                            ...configForm,
                                            moduleId: e.target.value
                                        })}
                                        required
                                    >
                                        <option value="">請選擇模組</option>
                                        {modules.map(module => (
                                            <option key={module.id} value={module.id}>
                                                {module.moduleName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-control mb-4">
                                    <label className="label">
                                        <span className="label-text">配置數據 (JSON)</span>
                                    </label>
                                    <textarea
                                        className="textarea textarea-bordered h-32"
                                        value={JSON.stringify(configForm.moduleConfigData, null, 2)}
                                        onChange={(e) => {
                                            try {
                                                const parsed = JSON.parse(e.target.value);
                                                setConfigForm({
                                                    ...configForm,
                                                    moduleConfigData: parsed
                                                });
                                            } catch {
                                                // 忽略 JSON 解析錯誤，允許用戶繼續編輯
                                                setConfigForm({
                                                    ...configForm,
                                                    moduleConfigData: e.target.value
                                                });
                                            }
                                        }}
                                        required
                                    />
                                </div>

                                <div className="modal-action">
                                    <button type="submit" className="btn btn-primary">
                                        {editingConfig ? '更新' : '創建'}
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn"
                                        onClick={() => setShowConfigModal(false)}
                                    >
                                        取消
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
