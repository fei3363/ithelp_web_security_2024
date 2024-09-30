FROM node:14

WORKDIR /usr/src/app

# 複製 package.json 和 package-lock.json（如果存在）
COPY package*.json ./

# 安裝相依性套件
RUN npm install

# 安裝 sequelize-cli
RUN npm install -g sequelize-cli

# 安裝 PostgreSQL 客戶端（用於 Sequelize）
RUN npm install --save sequelize pg pg-hstore

# 安裝 MongoDB 驅動（使用 MongoDB）
RUN npm install --save mongoose

# 安裝 zip 工具
RUN apt-get update && apt-get install -y zip

# 複製專案文件
COPY . .

# 確保 config 目錄存在
RUN mkdir -p /usr/src/app/config

# 公開端口 3000
EXPOSE 3000

# 啟動應用
CMD ["npm", "run", "dev"]