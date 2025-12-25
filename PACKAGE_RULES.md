# Hướng Dẫn Quản Lý Thư Viện & Package Trong Monorepo

Tài liệu này hướng dẫn đầy đủ cách **cài thư viện**, **gỡ thư viện**, **nâng cấp package**, **tạo library**, và **quy tắc quản lý dependency** trong monorepo dùng PNPM + Turborepo.

---

# 1. Cài thư viện trong Monorepo

## 1.1. Cài cho toàn bộ monorepo

Dùng khi thư viện được dùng ở cả apps và libs (VD: axios, zod, dayjs, lodash...).

```
pnpm add <package> -w
```

**-w** = cài vào workspace root.

Ví dụ:

```
pnpm add axios -w
pnpm add zod -w
```

---

## 1.2. Cài cho 1 app hoặc 1 lib cụ thể

Dùng khi chỉ 1 app/lib cần package đó.

```
pnpm add <package> --filter <đường-dẫn>
```

Ví dụ (cài cho LMS Pro):

```
pnpm add chart.js --filter ./apps/lms-pro
```

Ví dụ (cài cho lib utils):

```
pnpm add qs --filter ./libs/utils
```

---

## 1.3. Cài devDependencies

### Cài devDeps toàn repo

```
pnpm add -D eslint prettier typescript -w
```

### Cài devDeps cho 1 package

```
pnpm add -D vitest --filter ./libs/utils
```

---

# 2. Gỡ thư viện

## 2.1. Gỡ toàn repo

```
pnpm remove <package> -w
```

## 2.2. Gỡ trong 1 app/lib

```
pnpm remove <package> --filter ./apps/lms-finhub
```

---

# 3. Nâng cấp thư viện

## 3.1. Nâng cấp toàn bộ monorepo

```
pnpm update -w
```

## 3.2. Nâng cấp 1 package cụ thể toàn repo

```
pnpm update <package> -w
```

## 3.3. Nâng cấp trong 1 app/lib

```
pnpm update <package> --filter ./apps/lms-pro
```

---

# 4. Quy tắc quản lý dependency trong Monorepo (Quan trọng)

## 4.1. Quy tắc chung

- Các thư viện dùng chung → bắt buộc cài ở root (`-w`).
- Không được để mỗi app một version React, Zod, Axios...
- Mọi libs nên dùng chuẩn:

```json
"dependencies": {
  "react": "workspace:*",
  "react-dom": "workspace:*"
}
```

## 4.2. Không để dependency phân mảnh

**Sai (mỗi app 1 version):**

```
apps/lms-pro: axios 1.6.2
apps/lms-finhub: axios 1.7.0
libs/api: axios 1.6.0
```

→ Build dễ vỡ, node_modules bị split, caching hỏng.

**Đúng:**

```
pnpm add axios -w
```

---

# 5. Quy tắc import trong monorepo

- App chỉ được import từ **libs** hoặc chính app đó.
- Lib KHÔNG được import ngược lên app.
- Lib phải độc lập, không circular dependency.

Cấu trúc đúng:

```
/apps
  /lms-pro
  /lms-finhub
/libs
  /ui
  /utils
  /api
  /types
```

---

# 6. Tạo library mới trong monorepo

## 6.1. Tạo thư mục lib

```
/libs/my-lib
  package.json
  tsconfig.json
  src/index.ts
```

## 6.2. Tạo package.json

```json
{
  "name": "@lms/my-lib",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc -p tsconfig.json"
  }
}
```

## 6.3. Export từ index.ts

### Trường hợp default export

```ts
import thing from "./thing";
export default thing;
```

### Trường hợp export thường

```ts
export * from "./stringUtils";
export * from "./dateUtils";
```

### Trường hợp file có cả default + named

```ts
export { default as Button } from "./Button";
export * from "./types";
```

---

# 7. Kiểm tra và build libs trước apps

Toàn monorepo phải build theo thứ tự:

```
libs → apps
```

Turbo sẽ tự xử lý nếu scripts chuẩn.

Build toàn bộ:

```
pnpm build
```

Build lib riêng:

```
pnpm build --filter ./libs/utils
```

---

# 8. Rule cho PR liên quan đến package

- Thay đổi package.json phải có lý do rõ ràng.
- Cập nhật dependency ảnh hưởng toàn repo phải test:

```
pnpm build
pnpm check-types
pnpm lint
```

- Không merge PR làm lệch version thư viện.

---

# 9. Checklist cho thành viên khi thêm package

1. Package dùng ở nhiều nơi? → cài ở root.
2. Package chỉ dùng ở 1 app? → filter app.
3. Lib có phụ thuộc? → đảm bảo `package.json` đúng.
4. Chạy:

```
pnpm install
pnpm build
pnpm dev
```

5. Update README nếu cần.

---

# 10. Các lỗi phổ biến khi quản lý package

### ❌ Import lib chưa build

Solution: build lại libs.

```
pnpm build --filter ./libs/utils
```

### ❌ Version React lệch nhau → app crash

→ Fix: cài React ở workspace root.

### ❌ Import vòng lặp

→ Kiểm tra lại kiến trúc libs.

### ❌ Cài package không dùng filter → loạn dependencies

→ Luôn xác định rõ nơi cần cài.

---

Nếu muốn tao thêm phần **quy trình chuẩn khi mở PR**, hoặc tạo phiên bản tiếng Anh để đưa vào repo public, nói tao biết.

---

# 11. Phân biệt **dependencies**, **devDependencies**, và **peerDependencies**

## 11.1. **dependencies** (prod deps)

Dùng cho:

- Code chạy **trực tiếp** lúc runtime.
- App hoặc lib **phụ thuộc thực sự** vào package.

Ví dụ:

- react
- axios
- zod
- jotai

📌 **Cài đặt:**

```
pnpm add <package>
```

Hoặc cho root:

```
pnpm add <package> -w
```

👉 Trong monorepo, đa số libs cần để vào:

```
"dependencies": {
  "react": "workspace:*",
  "@lms/utils": "workspace:*"
}
```

---

## 11.2. **devDependencies** (dev-only)

Dùng cho:

- Công cụ phát triển
- Build tool, lint, format, test
- Không bao giờ chạy khi deploy

Ví dụ:

- typescript
- eslint
- prettier
- vitest
- turbo

📌 **Cài đặt:**

```
pnpm add -D <package>
```

Hoặc toàn repo:

```
pnpm add -D <package> -w
```

👉 Quy tắc monorepo:

- DevDeps dùng chung → đặt vào root
- Lib hoặc app chỉ dùng để test riêng → đặt vào devDeps của chính nó

---

## 11.3. **peerDependencies** (khai báo bắt buộc, không cài)

Dùng khi:

- Lib **phụ thuộc vào version React của app**, nhưng **không được tự cài**.
- Lib muốn nói: "Tao cần React 18, còn m tự cài đi".

### Ví dụ điển hình (libs/ui):

```json
{
  "name": "@lms/ui",
  "peerDependencies": {
    "react": ">=18",
    "react-dom": ">=18"
  }
}
```

👉 Điều này giúp tránh việc lib tự kéo thêm React → gây lỗi:

```
Invalid hook call — multiple React versions
```

### Khi nào dùng peerDependencies?

- Component library (UI)
- Utils dùng React hook
- Lib phụ thuộc framework (Next, React, Vue...)

### Khi KHÔNG dùng peerDependencies:

- Các lib thuần TypeScript (utils, math, string...) → không cần.

---

## 11.4. deep rule (quan trọng trong monorepo)

### 1️⃣ App cài → dependencies

### 2️⃣ Lib UI → peerDependencies + optionalDependencies (nếu cần)

### 3️⃣ Lib thuần utils → chỉ dùng dependencies

### 4️⃣ Tools → devDependencies root

---
