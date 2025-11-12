import CallToAction from "@/components/landing-page/call-to-action";
import { FAQ } from "@/components/landing-page/faq";
import Footer from "@/components/landing-page/footer";
import Hero from "@/components/landing-page/hero";
import SiteNav from "@/components/site-nav";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="relative">
        <Hero />
      </main>
      <CallToAction />
      <FAQ />
      <Footer />
    </div>
  );
}
