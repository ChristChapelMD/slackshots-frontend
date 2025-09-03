import { SlackAuthButton } from "@/components/auth/slack-auth-button";
import { HeroSection } from "@/components/marketing/layouts/hero-section";

export default function HomePage() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div>
        <HeroSection />
      </div>

      <SlackAuthButton />
    </section>
  );
}
