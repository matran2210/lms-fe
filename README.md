---
# 📘 Hướng dẫn Phát triển Monorepo (LMS Frontend)

Tài liệu này hướng dẫn quy trình làm việc chuẩn trong dự án **Monorepo**, bao gồm:
  - Quản lý các **ứng dụng con** (`apps/`) bằng **Git Subtree**.
  - Tạo và liên kết các **gói thư viện** (`libs/`, `features/`) bằng **pnpm workspace**.
---

## 📂 Cấu trúc thư mục

| Thư mục    | Mô tả                                                       | Ví dụ                                    |
| ---------- | ----------------------------------------------------------- | ---------------------------------------- |
| `apps`     | Chứa các ứng dụng con (deploy được). Mỗi app là một subtree | `apps/lms-pro`, `apps/finhub`            |
| `libs`     | Chứa các thư viện dùng chung (Core, UI, Utils...)           | `@lms/ui`, `@lms/utils`                  |
| `features` | Chứa các module nghiệp vụ dùng chung                        | `@lms/feature-auth`, `@lms/feature-test` |

---

## PHẦN 1: Quản lý Apps con (Git Subtree)

**Git Subtree** cho phép nhúng hoặc đồng bộ code từ repo bên ngoài vào thư mục `apps/` của monorepo.

### 1️⃣ Thêm một App mới (`subtree add`)

Dùng khi muốn thêm một dự án mới vào monorepo lần đầu.

```bash
git subtree add --prefix=<đường_dẫn_trong_monorepo> <url_repo_con> <tên_nhánh> --squash
```

**Ví dụ:**

```bash
# Đứng tại thư mục gốc (lms-fe)
git subtree add --prefix=apps/finhub https://github.com/user/finhub-repo.git main --squash
```

> **Lưu ý:** `--squash` rất quan trọng, nén toàn bộ lịch sử commit của repo con thành một commit duy nhất.

---

### 2️⃣ Đồng bộ code từ App con (`subtree pull`)

Dùng khi repo con có code mới và bạn muốn cập nhật vào monorepo.

```bash
git subtree pull --prefix=<đường_dẫn_trong_monorepo> <url_repo_con> <tên_nhánh> --squash
```

**Ví dụ:**

```bash
git subtree pull --prefix=apps/lms-pro https://github.com/user/lms-pro.git staging --squash
```

---

## PHẦN 2: Tạo và Liên kết Package (`libs/`, `features/`)

Để một package mới (ví dụ `@lms/utils`) có thể được import bởi một package khác (ví dụ `@lms/feature-calculator`), bạn **bắt buộc** phải tuân thủ quy trình 5 bước dưới đây.

### ✅ Checklist 5 File quan trọng

- `pnpm-workspace.yaml` (Gốc)
- `package.json` (Của gói mới)
- `index.ts` (Cổng vào của gói mới)
- `tsconfig.base.json` (Gốc/Tools)
- `package.json` (Của gói muốn sử dụng)

---

### 📝 Ví dụ: Tạo package `@lms/utils`

Giả sử bạn muốn tạo package `utils` chứa hàm `formatDate` để `calculator` sử dụng.

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

Để `features/calculator` dùng được `utils`, bạn phải khai báo dependency:

**A. Sửa `features/calculator/package.json`**

```json
{
  "name": "@lms/feature-calculator",
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
