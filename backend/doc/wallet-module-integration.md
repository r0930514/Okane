# 錢包模組整合架構

本文檔說明如何建立基於模組的錢包系統，支援手動記帳和同步功能的混合架構。

## 🏗️ 架構概覽

### 新增功能
1. **交易來源標記** - 區分手動新增和自動同步的交易
2. **錢包配置關聯** - 錢包可關聯到特定的模組配置
3. **混合操作模式** - 支援純手動、純同步、混合模式
4. **手動記帳模組** - 將手動記帳作為一個標準模組

## 📊 資料模型

### Transaction 實體新增欄位
```typescript
export enum TransactionSource {
  Manual = 'manual',    // 手動新增
  Sync = 'sync',        // 自動同步  
  Import = 'import'     // 匯入
}

// 新增欄位
source: TransactionSource              // 交易來源
externalTransactionId: string         // 外部系統交易ID
isReconciled: boolean                 // 是否已對帳
```

### Wallet 實體新增欄位
```typescript
export enum WalletOperationMode {
  ManualOnly = 'manual_only',    // 僅手動
  SyncOnly = 'sync_only',        // 僅同步
  Hybrid = 'hybrid'              // 混合模式
}

// 新增欄位
operationMode: WalletOperationMode    // 操作模式
walletConfigId: number                // 關聯的錢包配置ID
```

## 🚀 使用流程

### 方式一：基於模組的錢包建立流程

#### 步驟 1：建立錢包配置
```http
POST /wallet-configs
Authorization: Bearer <token>
Content-Type: application/json

{
  "moduleId": 1,  // 手動記帳模組 ID
  "moduleConfigData": {
    "walletName": "我的現金錢包",
    "walletColor": "#007bff",
    "initialBalance": 5000,
    "description": "日常現金支出記錄"
  }
}
```

#### 步驟 2：建立錢包實例
```http
POST /wallets
Authorization: Bearer <token>
Content-Type: application/json

{
  "walletConfigId": 1,           // 關聯到配置
  "walletType": "manual",        // 錢包類型
  "operationMode": "hybrid"      // 支援混合操作
}
```

### 方式二：傳統直接建立（向後相容）
```http
POST /wallets
Authorization: Bearer <token>
Content-Type: application/json

{
  "walletName": "傳統錢包",
  "walletColor": "#28a745",
  "initialBalance": 1000,
  "walletType": "manual"
}
```

## 💰 交易管理

### 手動新增交易（支援所有錢包）
```http
POST /wallets/:walletId/transactions
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 150.00,
  "description": "午餐費用",
  "type": "expense",
  "category": "餐飲",
  "source": "manual"  // 標記為手動新增
}
```

### 同步交易（僅同步錢包）
```http
POST /wallets/:walletId/transactions
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 50000.00,
  "description": "薪資入帳",
  "type": "income",
  "category": "薪資",
  "source": "sync",                    // 標記為自動同步
  "externalTransactionId": "TXN-123"  // 外部系統ID
}
```

## 🎯 預設錢包模組

系統提供以下預設模組：

### 1. 手動記帳錢包
```javascript
{
  moduleName: '手動記帳錢包',
  moduleConfigFormat: {
    walletName: 'string',
    walletColor: 'string', 
    initialBalance: 'number',
    description: 'string'
  },
  moduleCallURL: null
}
```

### 2. 銀行模組
- 台新銀行（帳號、密碼、分行代碼）
- 富邦銀行（帳號、密碼、身分證號）

### 3. 投資模組
- 幣安交易所（API Key、Secret Key）

### 4. 電子支付
- 悠遊卡（卡號、授權碼）

## 🔄 混合模式優勢

### 使用場景
1. **銀行同步延遲** - 手動先記錄，後續自動對帳
2. **現金交易** - 銀行帳戶無法同步的現金支出
3. **交易分類** - 手動調整自動同步的交易分類
4. **備註補充** - 為同步交易新增個人備註

### 交易來源標示
```
📊 台新銀行帳戶

今日交易:
🔄 午餐費用        -$150   [手動]  12:30
🔗 薪資入帳      +$50,000  [同步]  09:00  
🔄 ATM提款       -$3,000   [手動]  08:45
⚠️ 重複交易      -$150     [需對帳] 12:35

圖示說明:
🔄 = 手動新增
🔗 = 自動同步  
⚠️ = 需要對帳
```

## 🛡️ 安全性與驗證

### 權限控制
- 使用者只能存取自己的錢包配置
- 建立錢包時驗證配置所有權
- JWT 認證保護所有 API

### 資料驗證
- 錢包配置格式驗證
- 交易來源一致性檢查
- 外部ID唯一性驗證

## 📈 未來擴展

### 1. 對帳功能
```http
GET /wallets/:id/reconciliation     # 查看對帳狀況
POST /wallets/:id/reconcile         # 手動對帳
```

### 2. 重複交易檢測
- 自動識別相同金額、日期的交易
- 提供合併或刪除建議
- 對帳狀態追蹤

### 3. 同步控制
```http  
POST /wallets/:id/sync              # 觸發手動同步
PUT /wallets/:id/sync-settings      # 設定同步頻率
```

### 4. 批量匯入
```http
POST /wallets/:id/import            # 匯入外部交易檔案
```

## 🎨 前端整合建議

### 統一建立流程
1. 使用者選擇錢包模組類型
2. 填寫對應的模組設定參數
3. 系統建立配置和錢包實例
4. 提供統一的交易管理介面

### 交易介面
- 所有錢包都支援手動新增交易
- 同步錢包額外顯示同步狀態
- 交易列表區分來源（圖示或顏色）
- 提供對帳管理頁面

這個新架構讓系統更加靈活，使用者可以根據需求選擇純手動、純同步或混合模式的錢包管理方式。
