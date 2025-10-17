import { Card } from "@heroui/card";

import { Sidebar } from "@/components/docs/sidebar";
import { Navbar } from "@/components/navbar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <Card
            isBlurred
            className="w-full h-12 bg-yellow-600 rounded-lg p-2 mb-8 z-50 font-bold text-lg"
          >
            🚧 Docs Under Construction. Please bear with us! 🚧
          </Card>
          {children}
        </main>
      </div>
    </>
  );
}
