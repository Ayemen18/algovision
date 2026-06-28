import { Navbar }                from "@/components/layout/Navbar";
import { Footer }                from "@/components/layout/Footer";
import { HeroSection }           from "@/components/sections/HeroSection";
import { FeaturesSection }       from "@/components/sections/FeaturesSection";
import { HowItWorksSection }     from "@/components/sections/HowItWorksSection";
import { ProblemsPreviewSection } from "@/components/sections/ProblemsPreviewSection";
import { TestimonialsSection }   from "@/components/sections/TestimonialsSection";
import { CTASection }            from "@/components/sections/CTASection";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        <HeroSection />
        <ProblemsPreviewSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <CTASection />
      </main>

      <Footer />
    </>
  );
}