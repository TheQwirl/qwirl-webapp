import Footer from "@/components/landing-page/footer";
import Hero from "@/components/landing-page/hero";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="px-6">
      <div className="pt-6 pb-10 md:px-10 px-6 flex justify-between items-center">
        <div className="text-3xl font-bold uppercase">Qwirl</div>
        <Link href="/auth">
          <Button>Continue</Button>
        </Link>
      </div>
      <Hero />
      <Footer />
    </main>
  );
}
