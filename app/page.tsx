import Footer from "@/components/landing-page/footer";
import Hero from "@/components/landing-page/hero";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="px-6">
      <div className="pt-6 pb-10 px-10 flex justify-between items-center">
        <div className="text-3xl font-bold uppercase">Qwirl</div>
        <div className="flex gap-4 items-center">
          <Link href="/auth/sign-in">
            <Button variant="outline">Login</Button>
          </Link>
          <Link href="/auth/sign-up">
            <Button>Sign Up</Button>
          </Link>
        </div>
      </div>
      <Hero />
      <Footer />
    </main>
  );
}
