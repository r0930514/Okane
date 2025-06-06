# Okane Frontend

> 基於 React + Vite 的現代化個人財務管理應用前端

## 🛠 技術棧

- **核心框架**：React 18
- **建構工具**：Vite
- **樣式框架**：Tailwind CSS + DaisyUI
- **路由管理**：React Router v6
- **狀態管理**：React Hooks + Context API
- **圖標庫**：Phosphor Icons
- **開發工具**：ESLint + Prettier

## 🏗 架構設計

本專案採用**功能模組化架構**，將相關功能組織在一起，提供清晰的分層和責任分離。

### 核心設計原則

1. **功能模組化**：按業務功能（auth, dashboard, homepage）組織程式碼
2. **分層架構**：UI層 → 業務邏輯層 → 數據層
3. **Barrel Exports**：統一的模組出口，簡化引用路徑
4. **共用資源集中管理**：避免重複程式碼

### 架構層級

```
Components (UI 層) → Hooks (業務邏輯層) → Services (數據層)
```

## 🚀 快速開始

### 環境要求

- Node.js >= 16.0.0
- pnpm >= 7.0.0（推薦）或 npm >= 8.0.0

### 安裝依賴

```bash
# 使用 pnpm（推薦）
pnpm install

# 或使用 npm
npm install
```

### 開發環境啟動

```bash
# 啟動開發伺服器
pnpm dev

# 或
npm run dev
```

應用將在 `http://localhost:5173` 啟動

### 其他指令

```bash
# 建構生產版本
pnpm build

# 預覽生產版本
pnpm preview

# 代碼檢查
pnpm lint

# 代碼格式化
pnpm format
```

## 📁 專案結構

```
frontend/
├── public/                 # 靜態資源
├── src/
│   ├── app/               # 應用程式入口
│   │   └── main.jsx       # 應用主入口
│   ├── assets/            # 靜態資源
│   │   ├── images/        # 圖片資源
│   │   └── svgs/          # SVG 圖標組件
│   ├── features/          # 功能模組（核心架構）
│   │   ├── auth/          # 認證功能模組
│   │   ├── dashboard/     # 儀表板功能模組
│   │   ├── homepage/      # 首頁功能模組
│   │   └── index.js       # 功能模組統一出口
│   ├── shared/            # 共用資源
│   │   ├── components/    # 共用 UI 組件
│   │   ├── hooks/         # 共用 Hooks
│   │   ├── pages/         # 共用頁面
│   │   ├── services/      # 共用服務
│   │   ├── utils/         # 工具函數
│   │   └── index.js       # 共用資源出口
│   ├── docs/              # 文檔
│   └── index.css          # 全局樣式
├── index.html             # HTML 模板
├── package.json           # 專案配置
├── tailwind.config.js     # Tailwind 配置
├── vite.config.js         # Vite 配置
└── README.md              # 本檔案
```


## 💻 開發指南

### 引入模組

```javascript
// 從功能模組引入
import { AuthPage, useAuth } from '../features/auth';
import { DashboardPage, NavBar } from '../features/dashboard';
import { HomePage } from '../features/homepage';

// 從共用資源引入
import { ErrorPage, ProtectedRoute } from '../shared';
```

### 新增功能模組

1. 在 `src/features/` 下創建新目錄
2. 建立標準的目錄結構：`components/`, `hooks/`, `pages/`, `services/`
3. 創建 `index.js` 作為模組出口
4. 在 `src/features/index.js` 中導出新模組

### Hook 使用範例

```javascript
// 認證 Hook 使用
function LoginComponent() {
  const { login, isLoading, error } = useAuth();
  
  const handleSubmit = async (email, password) => {
    await login(email, password);
  };
  
  return (
    // UI 組件
  );
}
```

### 服務層使用

```javascript
// 直接調用服務
import { AuthService } from '../features/auth';

const result = await AuthService.signin(email, password);
if (result.success) {
  // 處理成功邏輯
}
```


