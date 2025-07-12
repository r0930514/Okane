# CLAUDE.md

本檔案提供 Claude Code (claude.ai/code) 在此專案中工作時的指導原則。
## 回覆語言規定
- 請使用繁體中文回答 - 請必須使用繁體中文進行回覆

## 開發流程
1. **功能開發**：每次開發一個功能或修正一個 bug，請先確保自己不是在 master 分支上工作。 
2. **提交規範**：每完成一個功能段落或重要步驟後必須進行 git commit，確保每次提交都包含完整且可運行的程式碼。
3. **提交訊息**：提交訊息要清楚描述所完成的功能或修正。
4. **程式碼測試**：在提交前，build 看看程式是否可以正常編譯。
5. **單元測試**：在提交前執行單元測試，確保新功能不會破壞現有功能。

## 開發指令
本系統在開發上完全使用 docker-compose 開發與部署，不倚賴電腦本地環境，以下是常用指令：

### Docker
以下是容器的名稱，請根據需要選擇使用：
- `backend` - NestJS 後端服務
- `frontend-nextjs` - Next.js 前端服務
- `frontend` - React 前端服務 (已棄用)
- `postgres` - PostgreSQL 資料庫服務
- `nginx` - Nginx 反向代理服務

請先檢查 Docker 容器是否正在運行，若未運行請先啟動 Docker。
- `orb start` - 啟動 Docker 引擎
以下指令在使用時，請先切換到 docker/ 路徑
- `docker compose -f docker-compose-dev.yaml logs --tail=100` 檢查開發環境日誌，確認環境是否已啟動
- `docker-compose -f docker/docker-compose-dev.yaml up` - 運行開發環境
- `docker-compose -f docker/docker-compose-dev.yaml exec ${容器名稱} ${欲執行指令}` - 進入容器內部進行操作（常見場景：資料庫遷移）

## 常用指令
以下是各個服務的常用指令：
### 後端 (NestJS)
- `cd backend && pnpm install` - 安裝相依套件
- `pnpm run start:dev` - 以開發模式運行後端並支援熱重載
- `pnpm run build` - 建置正式版本
- `pnpm run start:prod` - 運行正式版本
- `pnpm run lint` - 執行 ESLint
- `pnpm run test` - 執行單元測試

### 前端 (React + Vite) (棄用)
- `cd frontend && pnpm install` - 安裝相依套件
- `pnpm run dev` - 運行開發伺服器
- `pnpm run build` - 建置正式版本
- `pnpm run preview` - 預覽正式版本建置
- `pnpm run lint` - 執行 ESLint

### 前端 (Next.js) 
- `cd frontend-nextjs && pnpm install` - 安裝相依套件
- `pnpm run dev` - 運行開發伺服器
- `pnpm run build` - 建置正式版本
- `pnpm run start` - 啟動正式版本伺服器
- `pnpm run lint` - 執行 ESLint

### 資料庫遷移（請於 backend 容器中執行）
- `npm run migration:generate` - 從實體變更產生遷移檔案
- `npm run migration:run` - 執行待執行的遷移
- `npm run migration:revert` - 回滾最後一次遷移



## 架構概覽

### 核心系統結構
Okane 是一個多幣種資產管理系統，包含 **NestJS 後端** 和 **Next.js 前端**。系統處理：
- 多幣種錢包管理（現金、銀行、股票、加密貨幣、信用卡、應收應付帳款）
- 即時匯率轉換
- 交易追蹤與成本基礎計算
- JWT 身份驗證與使用者管理
- 轉帳功能與配對交易

### 後端架構 (NestJS)
- **模組化設計**：使用 NestJS 模組進行關注點分離
- **主要模組**：
  - `AppModule` - 主應用程式模組，整合所有子模組
  - `AuthModule` - JWT 身份驗證、本地/護照策略
  - `UsersModule` - 使用者管理與個人檔案
  - `WalletModule` - 錢包與交易相關功能
- **架構特色**：
  - 控制器層：`WalletController`、`TransactionController`
  - 服務層：`WalletService`、`TransactionService`
  - DTO 驗證：完整的輸入驗證與轉換
- **資料庫**：PostgreSQL 配合 TypeORM
- **實體**：User、Wallet、Transaction
- **API 文件**：Swagger 可在 `/docs` 端點查看

### 前端架構 (Next.js)
- **App Router 結構**：使用 Next.js 15+ app 目錄結構
- **主要功能區域**：
  - `(auth)` - 身份驗證頁面配合路由群組（登入、註冊、密碼重設）
  - `dashboard` - 主要應用程式儀表板與錢包概覽
  - 首頁作為根路由
- **組件架構**：
  - `components/auth/` - 身份驗證相關組件
  - `components/dashboard/layout/` - 儀表板佈局組件
  - `components/dashboard/stats/` - 統計概覽組件
  - `components/dashboard/wallet/` - 錢包相關組件
  - `components/landing/` - 首頁行銷組件
  - `components/shared/` - 共用組件與圖示
- **服務層**：
  - `ApiService` - 核心 API 通訊服務
  - `AuthService` - 身份驗證服務
  - `WalletService` - 錢包管理服務
  - `TransactionService` - 交易管理服務
  - `UserService` - 使用者服務
- **路由**：Next.js App Router 配合中介軟體保護
- **狀態管理**：React hooks 與 context
- **UI 框架**：TailwindCSS + DaisyUI 組件庫
- **圖示系統**：Phosphor Icons

### 資料庫架構
#### User 實體
- **基本資訊**：id (UUID)、username、email、密碼雜湊
- **偏好設定**：primaryCurrency、個人化偏好 (JSONB)
- **關聯**：一對多錢包關係

#### Wallet 實體
- **基本資訊**：id (UUID)、name、color、currency
- **錢包類型**：cash、bank、stock、crypto、foreign_stock、card、receivable、payable
- **配置資料**：provider、config (JSONB) - 支援各類型特定配置
- **關聯**：多對一使用者、一對多交易關係

#### Transaction 實體
- **基本資訊**：id (UUID)、date、amount、description
- **交易類型**：income、expense、transfer、buy、sell、dividend、interest、應收應付相關
- **分類與資產**：category、relatedAsset
- **元資料**：metadata (JSONB) - 支援股票、加密貨幣、轉帳、應收應付等特定資料
- **轉帳支援**：transferGroupId、relatedWallet、pairedTransactionId

### 核心業務邏輯
- **多錢包類型支援**：現金、銀行、股票、加密貨幣、應收應付帳款等
- **交易類型豐富**：收入、支出、轉帳、買賣、股息、利息、應收應付處理
- **轉帳配對機制**：支援跨錢包轉帳的雙向記錄
- **匯率處理**：多幣種轉換計算
- **成本基礎計算**：投資成本與損益計算
- **應收應付管理**：信用條款、逾期追蹤、壞帳處理

### API 結構
- **身份驗證**：`/auth` - 登入、註冊、JWT 令牌管理
- **使用者**：`/users` - 使用者資料、偏好設定
- **錢包**：`/wallets` - 錢包 CRUD 操作
- **交易**：`/transactions` - 交易管理、轉帳處理

### 開發環境
- **套件管理器**：前後端皆使用 `pnpm`
- **容器化**：完全使用 Docker Compose 進行開發與部署
- **熱重載**：前端 (Next.js Turbopack) 與後端 (NestJS) 皆支援
- **資料庫**：PostgreSQL 在 Docker 容器中運行
- **API 文件**：開發環境中提供 Swagger UI
- **代理服務**：Nginx 反向代理

### 測試策略
- **後端**：Jest 進行單元測試、端對端測試配置
- **前端**：Next.js 標準測試設定
- **資料庫**：TypeORM 遷移管理，支援版本控制


