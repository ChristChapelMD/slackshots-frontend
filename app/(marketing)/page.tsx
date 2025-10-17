import { HeroSection } from "@/components/marketing/layouts/hero-section";
import { FeatureSection } from "@/components/marketing/layouts/feature-section";
import { HowItWorksSection } from "@/components/marketing/layouts/how-it-works-section";
import { CTASection } from "@/components/marketing/layouts/cta-section";

export default function HomePage() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 md:py-10">
      <HeroSection />
      <FeatureSection />
      <HowItWorksSection />
      <CTASection />
    </section>
  );
}
