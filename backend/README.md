<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description


## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## 資料庫遷移說明

本專案使用 TypeORM 進行資料庫遷移管理。請依照下列方式操作：

### 產生新的 migration 檔案

```bash
npm run migration:generate
```
> 產生一個新的 migration 檔案，預設檔名為 migration。建議產生後手動修改檔名，或直接於 src/migrations/ 目錄下重新命名。

### 執行所有尚未套用的 migration

```bash
npm run migration:run
```
> 執行所有尚未套用的 migration，將資料庫結構更新至最新狀態。

### 還原上一個 migration

```bash
npm run migration:revert
```
> 還原最近一次執行的 migration。

### 注意事項

- 請勿在 production 環境下使用 `synchronize` 或 `dropSchema` 等自動同步或刪除資料表的功能，以避免資料遺失。
- 建議每次修改資料表結構時都建立 migration 檔案，並經過測試後再套用到正式環境。
- migration 相關指令皆會使用 `./src/config/database.config.ts` 作為資料庫連線設定檔。
- migration 檔案會產生在 `src/migrations/` 目錄下。

### 在 Docker 環境下執行 migration

若專案以 Docker 運行，請先進入 backend 容器，再執行 migration 指令：

```bash
docker exec -it okane-backend sh
npm run migration:run
```
