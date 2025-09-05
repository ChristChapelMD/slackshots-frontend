import Link from "next/link";

import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AnimatedGridPattern
        className={cn(
          "[mask-image:radial-gradient(700px_circle_at_center,white,transparent)]",
          "skew-y-12 overflow-hidden overscroll-none",
        )}
        duration={3}
        maxOpacity={0.1}
        numSquares={30}
      />
      <div className="flex flex-col min-h-screen items-center justify-center">
        {children}
        <Link href="google.com" />
      </div>
    </>
  );
}
