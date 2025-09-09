import { HeroSection } from "@/components/marketing/layouts/hero-section";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  console.log(session);

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div>
        <HeroSection />
      </div>
    </section>
  );
}
