import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],

  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        secondary: "#64748b",
        accent: "#f59e42",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        card: "0 4px 16px 0 rgba(0,0,0,0.07)",
      },
      spacing: {
        128: "32rem", // custom spacing
      },
    },
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/forms"),
  ],
} satisfies Config;
