import { Sponsors } from "@/components/Sponsors";

export const metadata = {
  title: "Next.js App – Tailwind Starter",
  description: "Minimal Next.js starter with Tailwind CSS.",
};

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">
        Hello, Next.js + Tailwind CSS! 👋
      </h1>
      <p className="text-lg text-gray-700 mb-8">
        Welcome to your minimal Next.js starter.
        <br />
        Edit <code className="bg-gray-100 px-1 rounded">
          src/app/page.tsx
        </code>{" "}
        to get started!
      </p>
      <Sponsors />
    </main>
  );
}
