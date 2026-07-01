// app/layout.tsx
import type { ReactNode } from "react";
import { ProvidersWrapper } from "./providers";
// TODO: Next14
import "@fortune-sheet/react/dist/index.css";
import "@lms/styles";
import "@sapp-fe/entrance-test-result-package/dist/index.css";
import "@sonhero/preview-part/dist/index.css";
import "@sapp-fe/quiz-result-package/dist/index.css";
import "@sonhero/sapp-common-package/dist/index.css";
import "@sonhero/sapp-common-package/dist/sapp-editor.css";
import "@styles/index.scss";
import "@xyflow/react/dist/style.css";
import "aos/dist/aos.css";
import Script from "next/script";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import ClientLayout from "./client-layout";
import { Inter, Roboto } from "next/font/google";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://lms-pro.sapp.edu.vn"),

  title: {
    default:
      "Hệ thống Quản lý học và thi trực tuyến",
    template: "%s | Upbase",
  },

  description:
    "Hệ thống Nền tảng Học và Thi trực tuyến nhằm mục đích cung cấp trải nghiệm học tập hiện đại, cá nhân hóa, giúp học viên tối ưu kết quả học tập",

  keywords: ["upbase", "lms"],

  authors: [{ name: "Upbase" }],

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    url: "https://lms-pro.sapp.edu.vn",
    title: "Hệ thống Quản lý học và thi trực tuyến",
    description:
      "Hệ thống Nền tảng Học và Thi trực tuyến nhằm mục đích cung cấp trải nghiệm học tập hiện đại, cá nhân hóa, giúp học viên tối ưu kết quả học tập",
    images: [
      {
        url: "https://sapp-lms-fe-prod.vercel.app/thumbnail.webp",
        width: 1200,
        height: 630,
        alt: "Upbase LMS Thumbnail",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Hệ thống Quản lý học và thi trực tuyến",
    description:
      "Hệ thống Nền tảng Học và Thi trực tuyến nhằm mục đích cung cấp trải nghiệm học tập hiện đại, cá nhân hóa, giúp học viên tối ưu kết quả học tập",
    images: ["https://sapp-lms-fe-prod.vercel.app/thumbnail.webp"],
  },

  other: {
    "X-UA-Compatible": "IE=edge,chrome=1",
    analytics: "G-HRLKW6S3X0",
    "csrf-token": "Hl4U5KjkBFkHN2m2ptOE1L8QbTGV19yrEINaOrsd",
  },
};
export const viewport = {
  width: "device-width",
  initialScale: 1,
};
export const revalidate = 0;

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  // 'optional' — browser không block render để chờ font download.
  // Nếu font chưa cache, dùng fallback ngay; swap sau khi font sẵn sàng.
  // Đây là cách duy nhất để loại bỏ render-blocking từ Google Fonts khi dùng next/font.
  display: "optional",
  preload: true,
  variable: "--font-roboto",
  adjustFontFallback: true, // tự động tạo fallback metrics khớp với Roboto → tránh layout shift
});

// Inter — load qua next/font thay vì @import CSS để tránh render-blocking request
const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "optional",
  preload: false,
  variable: "--font-inter",
  adjustFontFallback: true,
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi" className={`${roboto.variable} ${inter.variable}`}>
      <head>
        <Script
          src="https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image"
          strategy="afterInteractive"
        />
      </head>
      <body className={roboto.className}>
        <ProvidersWrapper>
          <ClientLayout />
          {children}
          {/* </ClientLayout> */}
        </ProvidersWrapper>
      </body>
    </html>
  );
}
