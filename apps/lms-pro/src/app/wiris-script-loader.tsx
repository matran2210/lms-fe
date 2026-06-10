"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

export default function WirisScriptLoader() {
  const pathname = usePathname();

  if (pathname === "/courses") return null;

  return (
    <Script
      src="https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image"
      strategy="afterInteractive"
    />
  );
}
