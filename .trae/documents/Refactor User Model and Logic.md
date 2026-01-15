# Refactor User Model and Service

This plan outlines the steps to simplify the User model by removing unused fields, switching the ID to UUID, and cleaning up the corresponding service logic.

## 1. Database Schema Update
**File:** `prisma/schema.prisma`
-   **Modify `User` model:**
    -   Change `id` to `String @id @default(uuid())`.
    -   Remove fields: `uid`, `appleRefreshToken`, `deviceId`, `appleSub`, `isVip`, `vipExpireAt`, `type`.
-   **Remove:** `UserType` enum.

## 2. DTO and Interface Updates
**File:** `src/users/dtos/user.dto.ts`
-   Remove `UserType` enum.
-   Update `UserProfileDto`: Remove `uid`, `type`, `isVip`, `vipExpireAt`, `deviceId`. Add `id`.

**File:** `src/common/interfaces/request-user.interface.ts`
-   Update `RequestUser` interface: Replace `uid` with `id`.

## 3. Service Logic Refactoring
**File:** `src/common/auth/auth.service.ts`
-   Update `verify`, `sign`, and `check` methods to use `id` instead of `uid` and remove references to deleted fields (`type`, `isVip`, etc.).

**File:** `src/users/users.service.ts`
-   Remove `genUserProfile` method.
-   Refactor `register`:
    -   Remove `allowFreeVip` parameter and logic.
    -   Remove `generateFixedUuid` usage.
    -   Update `prisma.create` to match new schema.
-   Refactor `login`: Update payload generation.
-   Rename `findByUId` to `findById` and update logic.
-   Update `deleteUser` to use `id`.

**File:** `src/users/users.controller.ts`
-   Update `getProfile` to use `user.id` and `findById`.

## 4. Cleanup
-   Remove unused imports across modified files.
-   Delete `src/users/utils/uuid.ts` if no longer used.
