# ERD
ERD editor

## Next.jsのプロジェクト作成

```sh
$ docker compose build --no-cache
$ docker compose up -d
$ docker exec -it erd /bin/bash

$ npx create-next-app .
Need to install the following packages:
create-next-app@15.3.3
Ok to proceed? (y) y

✔ Would you like to use TypeScript? … Yes
✔ Would you like to use ESLint? … Yes
✔ Would you like to use Tailwind CSS? … Yes
✔ Would you like your code inside a `src/` directory? … Yes
✔ Would you like to use App Router? (recommended) … Yes
✔ Would you like to use Turbopack for `next dev`? … Yes
✔ Would you like to customize the import alias (`@/*` by default)? … No

$ npm run dev
```

## Prismaのインストール

.envファイルをnewprojectディレクトリにコピーする

Prismaとts-nodeのインストール

```sh
npm install prisma ts-node
npm install @prisma/client
```

Prismaの初期化

```sh
npx prisma init
```

.envのDATABASE_URL設定

```diff
DB_HOST=db
DB_NAME=mydb
DB_USER=admin
DB_PASS=password


# This was inserted by `prisma init`:
# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

# The following `prisma+postgres` URL is similar to the URL produced by running a local Prisma Postgres 
# server with the `prisma dev` CLI command, when not choosing any non-default ports or settings. The API key, unlike the 
# one found in a remote Prisma Postgres URL, does not contain any sensitive information.

- DATABASE_URL="prisma+postgres://localhost:51213/?api_key=eyJkYXRhYmFzZVVybCI6InBvc3RncmVzOi8vcG9zdGdyZXM6cG9zdGdyZXNAbG9jYWxob3N0OjUxMjE0L3RlbXBsYXRlMT9jb25uZWN0aW9uX2xpbWl0PTEmY29ubmVjdF90aW1lb3V0PTAmbWF4X2lkbGVfY29ubmVjdGlvbl9saWZldGltZT0wJnBvb2xfdGltZW91dD0wJnNvY2tldF90aW1lb3V0PTAmc3NsbW9kZT1kaXNhYmxlIiwic2hhZG93RGF0YWJhc2VVcmwiOiJwb3N0Z3JlczovL3Bvc3RncmVzOnBvc3RncmVzQGxvY2FsaG9zdDo1MTIxNS90ZW1wbGF0ZTE_Y29ubmVjdGlvbl9saW1pdD0xJmNvbm5lY3RfdGltZW91dD0wJm1heF9pZGxlX2Nvbm5lY3Rpb25fbGlmZXRpbWU9MCZwb29sX3RpbWVvdXQ9MCZzb2NrZXRfdGltZW91dD0wJnNzbG1vZGU9ZGlzYWJsZSJ9"
+ DATABASE_URL="postgresql://admin:password@db:5432/mydb?schema=public"
```

schema.prismaの変更

```diff
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client-js"
-  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## install

```sh
npm install @xyflow/react
```

## Git

### ファイルパーミッションの変更を無視

```sh
git config core.filemode false
```