# 手動記帳錢包系統

手動記帳錢包系統是 Okane 平台的核心功能，讓使用者能夠手動管理個人財務記錄。

## 🎯 功能特色

### 錢包管理
- 建立多個錢包（現金、銀行帳戶、信用卡等）
- 設定初始餘額
- 自訂錢包顏色和名稱
- 即時餘額計算

### 交易記錄
- 收入/支出記錄
- 自訂交易分類
- 即時餘額更新
- 交易歷史查詢

### 分析功能
- 分類統計
- 收支報表
- 餘額追蹤

## 📊 資料庫設計

### Wallet 實體
```typescript
- id: 錢包唯一識別碼
- walletName: 錢包名稱
- accountNumber: 帳戶號碼
- walletType: 錢包類型（manual/sync）
- walletColor: 錢包顏色
- initialBalance: 初始餘額
- createdAt/updatedAt: 建立/更新時間
```

### Transaction 實體
```typescript
- id: 交易唯一識別碼
- amount: 交易金額
- description: 交易描述
- type: 交易類型（income/expense）
- category: 交易分類
- date: 交易日期
- balanceAfter: 交易後餘額
- createdAt/updatedAt: 建立/更新時間
```

## 🔗 API 端點

### 錢包管理 API

#### 建立錢包
```http
POST /wallets
Authorization: Bearer <token>
Content-Type: application/json

{
  "walletName": "現金錢包",
  "walletType": "manual",
  "walletColor": "#007bff",
  "initialBalance": 1000.00
}
```

#### 取得所有錢包
```http
GET /wallets
Authorization: Bearer <token>
```

#### 取得錢包餘額
```http
GET /wallets/:id/balance
Authorization: Bearer <token>
```

#### 取得錢包詳細資訊（含交易記錄）
```http
GET /wallets/:id?page=1&limit=20
Authorization: Bearer <token>
```

#### 更新錢包
```http
PATCH /wallets/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "walletName": "更新後的錢包名稱",
  "walletColor": "#28a745"
}
```

#### 刪除錢包
```http
DELETE /wallets/:id
Authorization: Bearer <token>
```

### 交易記錄 API

#### 新增交易記錄
```http
POST /wallets/:walletId/transactions
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 100.50,
  "description": "午餐費用",
  "type": "expense",
  "category": "餐飲",
  "date": "2024-01-15T12:30:00Z"
}
```

#### 取得錢包交易記錄
```http
GET /wallets/:walletId/transactions?page=1&limit=20
Authorization: Bearer <token>
```

#### 取得分類統計
```http
GET /wallets/:walletId/transactions/categories?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <token>
```

#### 更新交易記錄
```http
PATCH /transactions/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 120.00,
  "description": "更新後的描述",
  "category": "購物"
}
```

#### 刪除交易記錄
```http
DELETE /transactions/:id
Authorization: Bearer <token>
```

## 📱 使用流程範例

### 1. 建立錢包
使用者首次使用時建立錢包：
```json
{
  "walletName": "我的現金",
  "walletType": "manual",
  "walletColor": "#007bff",
  "initialBalance": 5000.00
}
```

### 2. 記錄支出
用戶購買午餐：
```json
{
  "amount": 150.00,
  "description": "麥當勞午餐",
  "type": "expense",
  "category": "餐飲"
}
```

### 3. 記錄收入
用戶收到薪資：
```json
{
  "amount": 50000.00,
  "description": "月薪",
  "type": "income",
  "category": "薪資"
}
```

### 4. 查看餘額
系統自動計算：
- 初始餘額：5,000
- 支出：-150
- 收入：+50,000
- **當前餘額：54,850**

## 🔧 業務邏輯

### 餘額計算
```
當前餘額 = 初始餘額 + 所有收入 - 所有支出
```

### 交易後餘額更新
每筆交易都會記錄交易後的餘額快照，方便追蹤歷史餘額變化。

### 權限控制
- 使用者只能管理自己的錢包和交易記錄
- JWT 認證保護所有 API
- 錢包所有權驗證

## 🏷️ 預設分類

### 支出分類
- 餐飲、交通、購物、娛樂
- 醫療、教育、房租、水電
- 通訊、保險、投資、其他支出

### 收入分類
- 薪資、獎金、投資收益
- 兼職、禮金、退款、其他收入

## 🔒 安全特性

1. **JWT 認證**：所有 API 都需要有效的認證令牌
2. **權限驗證**：使用者只能存取自己的資料
3. **資料驗證**：完整的輸入格式驗證
4. **交易完整性**：確保餘額計算的準確性

## 📈 未來擴展

1. **預算管理**：設定分類預算和提醒
2. **重複交易**：自動記錄定期收支
3. **匯出功能**：CSV/PDF 報表匯出
4. **多幣別支援**：支援不同貨幣記帳
5. **圖表分析**：收支趨勢和分類分析圖表

這個手動記帳錢包系統提供了完整的個人財務管理功能，讓使用者能夠輕鬆追蹤收支並分析財務狀況。
