import { useState, useEffect } from 'react';
import { DashboardLayout } from '..';
import { WalletModuleService, WalletConfigService } from '../../../shared';
import { Plus, PencilSimple, Trash, Gear } from '@phosphor-icons/react';

export default function SettingsPage() {
    const [modules, setModules] = useState([]);
    const [configs, setConfigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('modules');
    const [showModuleModal, setShowModuleModal] = useState(false);
    const [showConfigModal, setShowConfigModal] = useState(false);
    const [editingModule, setEditingModule] = useState(null);
    const [editingConfig, setEditingConfig] = useState(null);

    const [moduleForm, setModuleForm] = useState({
        moduleName: '',
        moduleConfigFormat: {},
        moduleCallURL: ''
    });

    const [configForm, setConfigForm] = useState({
        moduleId: '',
        moduleConfigData: {}
    });

    // 載入數據
    const loadData = async () => {
        setLoading(true);
        try {
            const [modulesResult, configsResult] = await Promise.all([
                WalletModuleService.getAllModules(),
                WalletConfigService.getAllConfigs()
            ]);

            if (modulesResult.success) {
                setModules(modulesResult.data);
            }
            if (configsResult.success) {
                setConfigs(configsResult.data);
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
                        <div className="h-8 bg-gray-200 rounded mb-4"></div>
                        <div className="h-32 bg-gray-200 rounded"></div>
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
                </div>

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
                                <div key={module.id} className="card bg-base-100 shadow-sm border">
                                    <div className="card-body">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="card-title">{module.moduleName}</h3>
                                                <p className="text-gray-600">{module.moduleCallURL}</p>
                                                <details className="mt-2">
                                                    <summary className="cursor-pointer text-sm text-gray-500">
                                                        配置格式
                                                    </summary>
                                                    <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
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
                                    <div key={config.id} className="card bg-base-100 shadow-sm border">
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
                                                        <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
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
