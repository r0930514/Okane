# 使用官方的 Node.js 鏡像作為基礎
FROM node:22-slim

# 設定工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json 到工作目錄
COPY package*.json ./

# 安裝相依套件
RUN npm install

# 複製專案的所有檔案到工作目錄
COPY . .

# 暴露應用程式的埠號
EXPOSE 3000

# 定義啟動指令
CMD [ "npm", "start" ]