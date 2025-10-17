import CallToAction from "@/components/landing-page/call-to-action";
import { FAQ } from "@/components/landing-page/faq";
import Footer from "@/components/landing-page/footer";
import Hero from "@/components/landing-page/hero";
import { HowItWorks } from "@/components/landing-page/how-it-works";
import { LightweightInsights } from "@/components/landing-page/lightweight-insights";
import { LiveWavelengthDemo } from "@/components/landing-page/live-wavelength-demo";
import { PrivacyAndControl } from "@/components/landing-page/privacy-and-control";
import { ShareWithFriends } from "@/components/landing-page/share-with-friends";
import { QwirlShowcase } from "@/components/landing-page/qwirl-showcase";
import SocialProof from "@/components/landing-page/social-proof";
import SiteNav from "@/components/site-nav";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="relative">
        <Hero />
        <HowItWorks />
        <LiveWavelengthDemo />
        <LightweightInsights />
        <ShareWithFriends />
        <QwirlShowcase />
        <PrivacyAndControl />
        <SocialProof />
      </main>
      <CallToAction />
      <FAQ />
      <Footer />
    </div>
  );
}
