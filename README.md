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

## 9. License

MIT © 2025 SAPP Team

For any feedback or feature requests, please open an issue or contact the SAPP Team.
