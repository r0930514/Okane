# 使用官方的 Node.js 鏡像作為基礎
FROM node:24-slim

# 設定工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json 到工作目錄
COPY package*.json ./

# 安裝相依套件
RUN rm -rf node_modules && \
    npm cache clean --force && \
    npm install

# 複製專案的所有檔案到工作目錄
COPY . .

# 確保正確的權限
RUN chown -R node:node /app

# 切換到非 root 用戶
USER node

# 暴露 Vite 開發伺服器的埠號
EXPOSE 5173

# 定義啟動指令（開發模式）
CMD ["npm", "run", "dev", "--", "--host"]
