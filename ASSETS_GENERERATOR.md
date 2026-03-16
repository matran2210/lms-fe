# @lms/assets – Assets Generator

Thư viện này dùng để **quản lý và export assets (images, animations, …) theo cách chuẩn hoá**
trong monorepo (Next.js / React).

Assets được **auto-generate thành 1 file export duy nhất**, giúp:

- Import gọn gàng
- Tránh hardcode đường dẫn
- Giảm coupling giữa app và file system
- Dễ maintain khi assets tăng nhiều

---

# 📂 Cấu trúc thư mục

```
libs/
└── assets/
    ├── images/
    │   ├── logo.png
    │   ├── user_avatar.svg
    ├── animations/
    │   ├── loading.json
    │   ├── success.json
    ├── types/
    │   ├── assets.d.ts                # TypeScript declarations
    ├── image-generate.ts          # auto generated
    ├── animations-generate.ts     # auto generated
    ├── index.ts
scripts/
└── generate-assets-index.js
```

---

# 1. Nguyên lý hoạt động

Script _generate-assets-index.js_ sẽ:

Đọc toàn bộ file trong từng folder assets (images, animations, …)

Convert tên file sang PascalCase

Append thêm suffix (Image, Animation, …)

Generate file export duy nhất cho mỗi folder

## 1.1 Ví dụ generate

Input

```
images/
├── logo.png
├── user_avatar.svg
```

Output (image-generate.ts)

```
// AUTO-GENERATED — DO NOT EDIT
export { default as LogoImage } from "./images/logo.png";
export { default as UserAvatarImage } from "./images/user_avatar.svg";
```

---

# 2. Naming Convention

```
| File name         | Export name        |
| ----------------- | ------------------ |
| `logo.png`        | `LogoImage`        |
| `user_avatar.svg` | `UserAvatarImage`  |
| `loading.json`    | `LoadingAnimation` |
```

Khuyến nghị

- Dùng _kebab-case_ hoặc _snake_case_

- Không dùng space trong tên file

---

# 3. Cấu hình generate

Script sử dụng mảng **CONFIG**:

```
const CONFIG = [
  {
    folder: "images",
    output: "image-generate.ts",
    suffix: "Image",
  },
  {
    folder: "animations",
    output: "animations-generate.ts",
    suffix: "Animation",
  },
];
```

## Thêm folder mới

Ví dụ thêm icons/:

```
{
  folder: "icons",
  output: "icons-generate.ts",
  suffix: "Icon",
}
```

---

# 4. Cách chạy script

## 4.1 Chạy trực tiếp

```
node scripts/generate-assets-index.js
```

## 4.2 Hoặc qua package.json

```
{
  "scripts": {
    "generate:assets": "node scripts/generate-assets-index.js"
  }
}

pnpm generate:assets
```

---

# 5. TypeScript Declaration (Bắt buộc)

Vì assets được import trực tiếp trong TypeScript, cần khai báo module cho TS.
File: **libs/assets/types/assets.d.ts**

```
declare module "*.png" {
  const src: string
  export default src
}

declare module "*.jpg" {
  const src: string
  export default src
}

declare module "*.jpeg" {
  const src: string
  export default src
}

declare module "*.webp" {
  const src: string
  export default src
}

declare module "*.gif" {
  const src: string
  export default src
}

declare module "*.svg" {
  const src: string
  export default src
}

declare module "*.json" {
  const value: any
  export default value
}
```

**File này phải được include trong tsconfig của monorepo.**

```
{
  "compilerOptions": {
    "types": ["./types/assets.d.ts"],
    ...
  },
  "include": ["./types/**/*", "apps"]
}
```

---

# 6. Cách sử dụng trong app

**❌ Không import trực tiếp file:**

```
import Logo from "@/assets/images/logo.png";
```

**✅ Import qua package:**

```
import { LogoImage } from "@lms/assets";
```

---

# 7. Lưu ý quan trọng

- KHÔNG chỉnh sửa các file **\*-generate.ts** thủ công

- Mọi thay đổi assets → _chạy lại script_

- Nên commit cả file generate vào repo

---

# 8. Best Practices

- Chỉ export assets qua **@lms/assets**

- Không để app phụ thuộc vào cấu trúc folder nội bộ

- Chạy generate:assets khi:
  - Thêm / xoá assets

  - Rename assets
