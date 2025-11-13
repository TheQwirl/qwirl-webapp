import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AuthForm } from "@/components/external-login-buttons";
import Image from "next/image";

const Auth = () => {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10 overflow-hidden">
      <div
        className="absolute blur-3xl opacity-20 bg-primary rounded-full w-96 h-96 transition-transform duration-[2000ms] ease-in-out"
        style={{ left: "-48px", top: "-48px" }}
      />
      <div className="absolute blur-3xl opacity-20 bg-gradient-to-r bg-primary rounded-full w-full h-full transition-all duration-700 ease-in-out" />

      <div className={cn("flex flex-col gap-6 relative z-10")}>
        <Card className="backdrop-blur-sm bg-card/95 shadow-lg">
          <CardHeader className="text-center space-y-4">
            <CardTitle className="text-2xl font-bold text-card-foreground">
              <div className="flex w-full max-w-sm flex-col gap-6">
                <Link
                  href="/"
                  className="flex items-center gap-2 self-center font-medium z-10"
                >
                  <Image
                    src="/logos/logo-icon-dark-transparent.svg"
                    alt="Qwirl Logo"
                    width={60}
                    height={60}
                  />
                </Link>
              </div>
            </CardTitle>
            <CardDescription className="text-base">
              Login with your Apple or Google account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-6 bg-muted rounded-lg text-center space-y-2">
              <p className="font-medium text-sm text-card-foreground">
                Start Creating Your Qwirl!
              </p>
              <p className="text-xs text-muted-foreground">
                Let others find out what makes you unique.
              </p>
            </div>

            <AuthForm apiUrl={process.env.NEXT_PUBLIC_API_URL!} />

            <div className="pt-4 border-t border-border">
              <p className="text-xs text-center text-muted-foreground">
                Trusted by thousands of users worldwide
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
          By clicking continue, you agree to our{" "}
          <Link href="/terms-of-service">Terms of Service</Link> and{" "}
          <Link href="/privacy-policy">Privacy Policy</Link>.
        </div>
      </div>
    </div>
  );
};

export default Auth;
