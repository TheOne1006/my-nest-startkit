# 重构 NestJS Starter Kit (基于 Prisma)

我已分析您的需求和代码库。以下是将项目重构为轻量级 Starter Kit 的计划，包括移除多余模块并将 Sequelize 替换为 Prisma (PostgreSQL)。

## 1. 清理阶段 (移除多余文件和模块)
**目标:** 移除所有与核心 `User` 模型无关的业务逻辑。

*   **删除目录:**
    *   `src/purchases`
    *   `src/games`
    *   `src/feedback`
    *   `src/base-feedback`
    *   `src/chat`
    *   `src/common/apple`
    *   `src/common/rsa`
    *   `src/common/assistant`
    *   `src/core/database` (Sequelize 设置)
*   **移除文件:**
    *   `src/users/users.entity.ts` (Sequelize 模型)
    *   `src/users/user-registration-log.entity.ts` 和 `src/users/user-registration-log.service.ts`

## 2. 配置与依赖更新
**目标:** 清理配置文件并切换依赖到 Prisma。

*   **更新 `package.json`:**
    *   **移除:** `sequelize`, `sequelize-typescript`, `@nestjs/sequelize`, `mysql2`, `@apple/app-store-server-library`, `flowise-sdk`, `jwks-rsa`, `passport-apple`.
    *   **添加:** `prisma`, `@prisma/client`.
*   **更新 `config/config.default.ts`:**
    *   移除 `rsa`, `flowise`, `dify`, `assistant`, `apple`, `app`, `sequelize` 的配置项。
*   **更新 `.env.example`:**
    *   移除未使用的环境变量。
    *   添加 PostgreSQL 的 `DATABASE_URL`。

## 3. Prisma 集成
**目标:** 配置 Prisma 使用 PostgreSQL 并定义 User 模型。

*   **初始化 Prisma:** 运行 `npx prisma init`.
*   **定义 Schema (`prisma/schema.prisma`):**
    *   配置数据源为 PostgreSQL。
    *   基于现有实体重新创建 `User` 模型 (字段包括 id, uid, username, email, password, salt, roles 等)。
*   **创建 Prisma 模块:**
    *   `src/prisma/prisma.service.ts`: 继承 `PrismaClient` 并处理数据库连接。
    *   `src/prisma/prisma.module.ts`: 全局模块，导出 `PrismaService`。

## 4. 代码重构
**目标:** 更新现有服务以使用 Prisma。

*   **重构 `UsersService`:**
    *   将 `Sequelize` 调用 (如 `findOne`, `create`, `save`, `destroy`) 替换为 `PrismaClient` 调用。
    *   更新逻辑以适配 Prisma 生成的类型。
*   **重构 `UsersModule`:**
    *   导入 `PrismaModule`。
    *   移除 `SequelizeModule` 导入。
*   **重构 `AppModule` 和 `CoreModule`:**
    *   移除已删除模块的导入 (`Feedback`, `Chat`, `Apple` 等)。
    *   移除 `DatabaseModule` (Sequelize)。
    *   导入 `PrismaModule`。

## 5. 验证
*   生成 Prisma 客户端: `npx prisma generate`.
*   确保项目能够成功构建 (`npm run build`)。
