import Footer from "@/components/landing-page/footer";
import Hero from "@/components/landing-page/hero";
import { PhilosophySection } from "@/components/landing-page/philosophy";
import { WhatQwirlIsNotSection } from "@/components/landing-page/what-qwirl-is-not";
import { WhatQwirlIsSection } from "@/components/landing-page/what-qwirl-is";
import { WhyUseQwirlSection } from "@/components/landing-page/why-use-qwirl";
import SiteNav from "@/components/site-nav";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="">
        <Hero />
        <PhilosophySection />
        <WhatQwirlIsSection />
        <WhyUseQwirlSection />
        <WhatQwirlIsNotSection />
      </main>
      <Footer />
    </div>
  );
}
