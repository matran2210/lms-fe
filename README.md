---
# 📘 Hướng dẫn Phát triển Monorepo (LMS Frontend)

Tài liệu này hướng dẫn quy trình làm việc chuẩn trong dự án **Monorepo**, bao gồm:
  - Quản lý các **ứng dụng con** (`apps/`) bằng **Git Subtree**.
  - Tạo và liên kết các **gói thư viện** (`libs/`, `features/`) bằng **pnpm workspace**.
---

## 📂 Cấu trúc thư mục

| Thư mục    | Mô tả                                                       | Ví dụ                                    |
| ---------- | ----------------------------------------------------------- | ---------------------------------------- |
| `apps`     | Chứa các ứng dụng con (deploy được). Mỗi app là một subtree | `apps/lms-pro`, `apps/lms-finhub`            |
| `libs`     | Chứa các thư viện dùng chung (Core, UI, Utils...)           | `@lms/ui`, `@lms/utils`                  |
| `features` | Chứa các module nghiệp vụ dùng chung                        | `@lms/feature-auth`, `@lms/feature-test` |

---

## PHẦN 1: Quản lý Apps con (Git Subtree)

**Git Subtree** cho phép nhúng hoặc đồng bộ code từ repo bên ngoài vào thư mục `apps/` của monorepo.

### 1️⃣ Thêm một App mới (`subtree add`)

Dùng khi muốn thêm một dự án mới vào monorepo lần đầu.

```bash
git subtree add --prefix=<đường_dẫn_trong_monorepo> <url_repo_con> <tên_nhánh>
```

**Ví dụ:**

```bash
# Đứng tại thư mục gốc (lms-fe)
git subtree add --prefix=apps/lms-finhub https://github.com/user/lms-finhub-repo.git main
```

---

### 2️⃣ Đồng bộ code từ App con (`subtree pull`)

Dùng khi repo con có code mới và bạn muốn cập nhật vào monorepo.

```bash
git subtree pull --prefix=<đường_dẫn_trong_monorepo> <url_repo_con> <tên_nhánh>
```

**Ví dụ:**

```bash
git subtree pull --prefix=apps/lms-pro https://github.com/user/lms-pro.git staging
```

---

## PHẦN 2: Tạo và Liên kết Package (`libs/`, `features/`)

Để một package mới (ví dụ `@lms/utils`) có thể được import bởi một package khác (ví dụ `@lms/feature-user`), bạn **bắt buộc** phải tuân thủ quy trình 5 bước dưới đây.

### ✅ Checklist 5 File quan trọng

- `pnpm-workspace.yaml` (Gốc)
- `package.json` (Của gói mới)
- `index.ts` (Cổng vào của gói mới)
- `tsconfig.base.json` (Gốc/Tools)
- `package.json` (Của gói muốn sử dụng)

---

### 📝 Ví dụ: Tạo package `@lms/utils`

Giả sử bạn muốn tạo package `utils` chứa hàm `formatDate` để `user` sử dụng.

---

#### Bước 1: Kiểm tra `pnpm-workspace.yaml` (Làm 1 lần)

Đảm bảo file này ở thư mục gốc đã khai báo các thư mục chứa package:

```yaml
packages:
  - "apps/*"
  - "libs/*" # <-- Bắt buộc
  - "features/*" # <-- Bắt buộc
```

---

#### Bước 2: Tạo Package mới (3 file)

Tạo thư mục `libs/utils` và thêm các file sau:

**A. File code (`libs/utils/formatDate.ts`)**

```ts
export const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};
```

**B. File định danh (`libs/utils/package.json`)**

```json
{
  "name": "@lms/utils",
  "version": "1.0.0",
  "private": true,
  "main": "./index.ts", // Cổng vào code
  "types": "./index.ts", // Cổng vào types
  "scripts": {
    "lint": "eslint ."
  }
}
```

**C. File cấu hình TS (`libs/utils/tsconfig.json`)**

```json
{
  "extends": "../../tools/typescript-config/tsconfig.base.json"
}
```

---

#### Bước 3: Tạo "Cổng vào" (`index.ts`)

File `libs/utils/index.ts` là nơi duy nhất được phép export code ra ngoài.

```ts
// libs/utils/index.ts
export * from "./formatDate";
// export * from './stringUtils';
```

---

#### Bước 4: Cấu hình "Lối tắt" (Path Alias)

Cập nhật `tools/typescript-config/base.json` để VSCode và TypeScript hiểu đường dẫn `@lms/utils`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@lms/assets": ["libs/assets/index.ts"],
      "@lms/ui": ["libs/ui/index.ts"],
      "@lms/utils": ["libs/utils/index.ts"] // <-- Thêm dòng này
    }
  }
}
```

---

#### Bước 5: Khai báo phụ thuộc & cài đặt

Để `features/user` dùng được `utils`, bạn phải khai báo dependency:

**A. Sửa `features/user/package.json`**

```json
{
  "name": "@lms/feature-user",
  "dependencies": {
    "@lms/ui": "workspace:_",
    "@lms/utils": "workspace:*" // <-- Thêm dòng này
  }
}
```

**B. Chạy lệnh cài đặt (tại thư mục gốc)**

```bash
pnpm install
```

**C. Sử dụng**

```ts
import { formatDate } from "@lms/utils";
```

---

Ok, để rõ ràng và chuẩn chỉnh cho monorepo, mình viết luôn **một mục hướng dẫn hoàn chỉnh** cho tất cả các trường hợp export trong `index.ts`, bao gồm:

- **named export**
- **default export**
- **kết hợp cả default + named**
- **đổi tên default export**
- **re-export nhiều file**

Nội dung này bạn có thể đưa thẳng vào README để dev theo đúng chuẩn.

---

# 📦 Hướng dẫn Export chuẩn trong `index.ts` cho packages (libs/, features/)

`index.ts` là **cổng vào duy nhất** của mỗi package.
Tất cả logic bên trong phải được export ra từ file này theo chuẩn sau.

---

# 1️⃣ Export các hàm / biến / class bình thường (Named Export)

File `formatDate.ts`:

```ts
export const formatDate = () => {};
```

**index.ts**

```ts
export * from "./formatDate";
```

Hoặc chọn lọc:

```ts
export { formatDate } from "./formatDate";
```

---

# 2️⃣ Export default từ file con

File `logger.ts`:

```ts
export default function logger() {}
```

**Cách export lại trong `index.ts`:**

### Cách 1: Export default giữ nguyên tên

```ts
export { default as logger } from "./logger";
```

→ Sử dụng:

```ts
import { logger } from "@lms/utils";
```

### Cách 2: Export default dưới tên khác

```ts
export { default as log } from "./logger";
```

→ Sử dụng:

```ts
import { log } from "@lms/utils";
```

### ❗ KHÔNG BAO GIỜ làm:

```ts
export * from "./logger";
```

Vì default export **không được re-export qua dấu `*`** (nó sẽ bị mất).

---

# 3️⃣ File có cả default export + named export

File `math.ts`:

```ts
export default function calculate() {}
export const add = () => {};
export const subtract = () => {};
```

**index.ts**

```ts
export { default as calculate } from "./math";
export * from "./math";
```

→ Sử dụng:

```ts
import { calculate, add, subtract } from "@lms/utils";
```

---

# 4️⃣ Re-export nhiều file trong thư mục

Cách chuẩn:

```ts
export * from "./date";
export * from "./string";
export * from "./number";
export { default as logger } from "./logger";
```

---

# 5️⃣ Export mọi thứ từ 1 folder lớn

Nếu thư mục có nhiều file, bạn có thể gom bằng barrel file trong chính thư mục đó:

```
utils/
  date.ts
  string.ts
  number.ts
  index.ts
```

File `utils/index.ts`:

```ts
export * from "./date";
export * from "./string";
export * from "./number";
```

Và ở package root:

```ts
export * from "./utils";
```

---

# 6️⃣ Export class / interface / type

```ts
export interface User { ... }
export type ID = string | number;
export class Parser {}
```

**index.ts**

```ts
export * from "./types";
export * from "./parser";
```

---

# 7️⃣ Khi nào KHÔNG nên dùng `export *`

Không dùng khi:

- file có default export
- bạn muốn kiểm soát public API
- file có quá nhiều thứ không muốn lộ ra ngoài

Còn lại: dùng thoải mái.

---

# 8️⃣ Template chuẩn cho một package `index.ts`

```ts
// Named exports
export * from "./format";
export * from "./math";

// Default exports re-export
export { default as logger } from "./logger";
export { default as http } from "./http";
```

---

Dưới đây là **hướng dẫn chạy – build – kiểm tra** cho monorepo của team m, viết rõ ràng, dễ hiểu, làm nội bộ luôn được.
Dựa đúng vào block script m gửi, không thêm thắt lung tung.

---

# **HƯỚNG DẪN CHẠY & BUILD MONOREPO**

## **1. Chạy toàn bộ dự án**

Dùng khi muốn chạy tất cả apps trong monorepo (lms-pro + lms-finhub), Turborepo sẽ lo caching:

### **Chạy toàn bộ apps**

```
pnpm dev
```

- Turbo sẽ tự phát hiện app nào cần chạy `dev`
- App nào không thay đổi → turbo skip

---

## **2. Chạy từng app riêng (cách chuẩn)**

### **Chạy LMS Pro**

```
pnpm dev:lms-pro
```

Chạy đúng app `/apps/lms-pro`
Dùng khi dev tính năng chỉ nằm trong LMS Pro.

### **Chạy lms-finhub**

```
pnpm dev:lms-finhub
```

Tương tự, chạy đúng app `/apps/lms-finhub`.

---

## **3. Build toàn bộ apps**

Dùng khi deploy, hoặc muốn verify tất cả apps build thành công:

```
pnpm build
```

Turbo sẽ build theo dependency graph:

- build libs trước
- sau đó build từng app phụ thuộc vào libs
- cache build để lần sau nhanh hơn

---

## **4. Build từng app riêng**

Dùng khi muốn test build một app cụ thể mà không cần build cả monorepo:

### **Build LMS Pro**

```
pnpm build:lms-pro
```

### **Build lms-finhub**

```
pnpm build:finhub
```

Ứng với:

```json
"build:lms-pro": "pnpm --filter ./apps/lms-pro build",
"build:lms-finhub": "pnpm --filter ./apps/lms-finhub build",
```

---
