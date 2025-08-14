# Zoom Project: Next.js 14+ Tailwind Starter with TypeScript

Starter for Next.js App Router + Tailwind CSS + TypeScript.  
Production-ready, easy to extend and customize.

---

## Key Features

- Next.js 14+ App Router (optimized performance, SEO, flexible routing)
- Tailwind CSS 3.4+ (utility-first, rapid UI customization)
- TypeScript (strict type checking)
- Custom Auth-ready (easy integration of custom, OAuth, or JWT authentication)
- Form Validation: React Hook Form + Zod
- Lint/Format: ESLint + Prettier
- Absolute import alias: @/ points to src/
- Ready for CI/CD, deploy easily to Vercel, Render, Railway, or VPS

---

## 1. Quick Start

git clone https://github.com/your-org/your-repo.git my-nextjs-app
cd my-nextjs-app
yarn install
yarn dev

# Visit http://localhost:3000

---

## 2. Project Structure

.
├── README.md
├── public/
├── src/
│ ├── app/ # Next.js App Router
│ ├── components/ # Reusable UI components
│ ├── services/ # API calls, axios config (client)
│ ├── styles/ # Tailwind and global CSS
│ ├── utils/ # Helper functions
│ ├── types/ # Shared type definitions
│ └── validations/ # Zod validation schemas
├── .env\* # Environment files (per environment)
├── next.config.js / mjs # Next.js configuration
├── tailwind.config.ts # Tailwind configuration
├── tsconfig.json # TypeScript configuration (with alias)
└── package.json

---

## 3. Tech Stack

Framework: Next.js (App Router)

UI: Tailwind CSS (optionally add Ant Design)

Type: TypeScript

Form: React Hook Form + Zod

Lint/Format: ESLint, Prettier

API client: Axios (pre-configured with interceptor)

---

## 4. Configuration & Customization

Alias imports: Use @/ for internal imports from /src

Environment variables: Store API, domain, keys... in .env, for example:

NEXT_PUBLIC_BASE_API_URL=https://api.yourdomain.com

Tailwind: Easily customize in tailwind.config.ts

---

## 5. Add API backend (mock/fake)

To quickly add a RESTful API file at pages/api/hello.ts:

import type { NextApiRequest, NextApiResponse } from "next";
export default function handler(req: NextApiRequest, res: NextApiResponse) {
if (req.method === "GET") {
return res.status(200).json({ message: "Hello from Next.js API route!" });
}
return res.status(405).json({ error: "Method not allowed" });
}

Call it from client using axios:

import axios from "axios";
const res = await axios.get("/api/hello");
console.log(res.data.message); // Hello from Next.js API route!

---

## 6. Build & Deploy

yarn build # Build for production
yarn start # Start production build

# Deploy easily to Vercel, Netlify, Render, Railway, etc.

---

## 7. Code Guidelines

Commit message: Follow Conventional Commits

Check code: yarn lint, yarn format, yarn type-check (if available)

CI/CD: Easily integrate with GitHub Actions or other CI tools

---

## 8. Contribution & Development

Pull Requests, create issues, or fork to add new features

Code structure prioritizes readability, maintainability, and scalability

---

## 9. Docker Setup

### Multi-stage Build

Ứng dụng này đã được Docker hóa với multi-stage build để tối ưu hóa kích thước image và bảo mật.

#### Cấu trúc Docker

1. **Stage 1 (deps)**: Cài đặt dependencies
2. **Stage 2 (builder)**: Build ứng dụng Next.js  
3. **Stage 3 (runner)**: Runtime environment tối ưu

#### Tối ưu hóa

- Sử dụng Alpine Linux để giảm kích thước
- Chỉ copy các file cần thiết cho production
- Non-root user để tăng bảo mật
- Sử dụng `dumb-init` để xử lý signals đúng cách

### Cách sử dụng

#### Sử dụng Makefile (Khuyến nghị)

```bash
# Xem tất cả commands
make help

# Build image
make build

# Chạy ứng dụng
make run

# Dừng ứng dụng
make stop

# Xem logs
make logs

# Truy cập container shell
make shell

# Dọn dẹp
make clean
```

#### Sử dụng Docker Compose

```bash
# Build và chạy
docker-compose up -d

# Chỉ build
docker-compose build

# Dừng
docker-compose down

# Xem logs
docker-compose logs -f zoom-fe
```

#### Sử dụng Docker trực tiếp

```bash
# Build
docker build -t zoom-fe:latest .

# Chạy
docker run -d -p 3000:3000 --name zoom-fe-app zoom-fe:latest

# Dừng và xóa
docker stop zoom-fe-app && docker rm zoom-fe-app
```

### Environment Variables

Các biến môi trường được cấu hình trong file `.env`:

```bash
# Zoom SDK Configuration
NEXT_PUBLIC_ZOOM_SDK_KEY=your_zoom_sdk_key_here
NEXT_PUBLIC_ZOOM_SDK_SECRET=your_zoom_sdk_secret_here

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
# ... và các biến khác
```

### Ports

Ứng dụng chạy trên port **3000** (có thể thay đổi trong docker-compose.yml)

### Health Check

Container có health check tự động kiểm tra endpoint `/` mỗi 30 giây.

### Bảo mật

- Non-root user (nextjs:1001)
- Chỉ copy các file cần thiết
- Sử dụng Alpine Linux (ít attack surface)
- Proper signal handling với dumb-init

### Performance

#### Image Size
- **Base image**: ~200MB
- **Final image**: ~150-200MB (tùy thuộc vào dependencies)

#### Build Time
- **First build**: ~5-10 phút
- **Subsequent builds**: ~2-5 phút (với cache)

#### Memory Usage
- **Container**: ~100-200MB RAM
- **Node.js process**: ~50-100MB RAM

### Troubleshooting

#### Build fails
```bash
# Xóa cache và build lại
make clean
make build
```

#### Container không start
```bash
# Kiểm tra logs
make logs

# Kiểm tra container status
docker ps -a
```

#### Port conflict
```bash
# Thay đổi port trong docker-compose.yml
ports:
  - "3001:3000"  # Map port 3001 của host với port 3000 của container
```

---

## 10. License

MIT © 2025 SAPP Team

For any feedback or feature requests, please open an issue or contact the SAPP Team.
