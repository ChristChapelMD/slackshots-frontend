import "@/styles/globals.css";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Header } from "@/components/dashboard/header/header";
import { Toolbar } from "@/components/dashboard/toolbar/toolbar";
import { AuthInit } from "@/components/auth/auth-init";
import { TextureContainer } from "@/components/ui/texture-container";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const hasRefreshToken = cookieStore.has("refreshToken");
  const hasAccessToken = cookieStore.has("accessToken");

  if (process.env.NEXT_PUBLIC_NODE_ENV !== "development") {
    if (!hasRefreshToken && !hasAccessToken) {
      redirect("/");
    }
  }

  return (
    <div className="max-h-fit inset-0 flex items-center justify-center p-4">
      <TextureContainer className="w-[95vw] h-[95vh] flex flex-col overflow-hidden">
        <AuthInit />
        <Header />
        <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
          <div className="w-full md:w-[350px] order-last md:order-first overflow-hidden bg-transparent">
            <Toolbar />
          </div>
          {children}
        </div>
      </TextureContainer>
    </div>
  );
}
