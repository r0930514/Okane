# 錢包模組系統

錢包模組系統是一個可擴展的金融帳戶管理平台，讓使用者能夠統一管理不同類型的金融帳戶。

## 系統架構

### 資料表設計

#### 錢包模組（wallet_modules）
- `moduleId`: 模組唯一識別碼
- `moduleName`: 模組名稱（如：台新銀行、幣安交易所）
- `moduleConfigFormat`: JSON格式，定義該模組所需的設定檔格式
- `moduleCallURL`: 該模組呼叫的外部API服務

#### 錢包設定檔（wallet_config）
- `configId`: 設定檔唯一識別碼
- `moduleId`: 關聯的錢包模組ID
- `userId`: 使用者ID
- `moduleConfigData`: JSON格式，實際的設定檔內容

## API 端點

### 錢包模組管理（需要管理員權限）

#### 取得所有錢包模組
```http
GET /wallet-modules
Authorization: Bearer <token>
```

#### 建立新錢包模組
```http
POST /wallet-modules
Authorization: Bearer <token>
Content-Type: application/json

{
  "moduleName": "台新銀行",
  "moduleConfigFormat": {
    "accountNumber": "string",
    "password": "string",
    "branchCode": "string"
  },
  "moduleCallURL": "https://api.taishin.com.tw"
}
```

#### 取得特定錢包模組
```http
GET /wallet-modules/:id
Authorization: Bearer <token>
```

#### 更新錢包模組
```http
PATCH /wallet-modules/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "moduleName": "台新銀行（更新）"
}
```

#### 刪除錢包模組
```http
DELETE /wallet-modules/:id
Authorization: Bearer <token>
```

### 錢包設定檔管理（使用者權限）

#### 取得使用者的所有錢包設定檔
```http
GET /wallet-configs
Authorization: Bearer <token>
```

#### 建立新錢包設定檔
```http
POST /wallet-configs
Authorization: Bearer <token>
Content-Type: application/json

{
  "moduleId": 1,
  "moduleConfigData": {
    "accountNumber": "1234567890",
    "password": "encrypted_password",
    "branchCode": "822"
  }
}
```

#### 取得特定錢包設定檔
```http
GET /wallet-configs/:id
Authorization: Bearer <token>
```

#### 更新錢包設定檔
```http
PATCH /wallet-configs/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "moduleConfigData": {
    "accountNumber": "0987654321",
    "password": "new_encrypted_password",
    "branchCode": "822"
  }
}
```

#### 刪除錢包設定檔
```http
DELETE /wallet-configs/:id
Authorization: Bearer <token>
```

## 使用範例

### 1. 建立銀行模組
管理員建立台新銀行模組，定義需要的設定格式：
```json
{
  "moduleName": "台新銀行",
  "moduleConfigFormat": {
    "accountNumber": "string",
    "password": "string",
    "branchCode": "string"
  },
  "moduleCallURL": "https://api.taishin.com.tw"
}
```

### 2. 使用者建立銀行設定檔
使用者根據模組格式建立自己的銀行帳戶設定：
```json
{
  "moduleId": 1,
  "moduleConfigData": {
    "accountNumber": "1234567890",
    "password": "my_secure_password",
    "branchCode": "822"
  }
}
```

### 3. 建立交易所模組
管理員建立幣安交易所模組：
```json
{
  "moduleName": "幣安交易所",
  "moduleConfigFormat": {
    "apiKey": "string",
    "secretKey": "string"
  },
  "moduleCallURL": "https://api.binance.com"
}
```

### 4. 使用者建立交易所設定檔
使用者設定幣安交易所API金鑰：
```json
{
  "moduleId": 2,
  "moduleConfigData": {
    "apiKey": "my_binance_api_key",
    "secretKey": "my_binance_secret_key"
  }
}
```

## 安全性考量

1. **設定檔格式驗證**：系統會驗證使用者輸入的設定檔是否符合模組定義的格式
2. **權限控制**：使用者只能存取自己的錢包設定檔
3. **加密存儲**：敏感資訊應該加密存儲（建議後續實作）
4. **JWT認證**：所有API都需要有效的JWT token

## 預設模組

系統預設包含以下模組：
- 台新銀行
- 富邦銀行
- 幣安交易所
- 悠遊卡

## 未來擴展

1. **資料加密**：實作敏感設定資料的加密存儲
2. **模組驗證**：加強模組設定格式的驗證邏輯
3. **外部API整合**：實際連接外部金融服務API
4. **自動同步**：定期同步外部帳戶資料
5. **多重驗證**：實作2FA等額外安全機制
