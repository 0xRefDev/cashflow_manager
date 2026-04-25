"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { sileo } from "sileo";

import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { User } from "@/icons/User";
import { Lock } from "@/icons/Lock";
import Logo from "@/assets/images/cashflow-logo.webp";

import { authService } from "@/services/client/auth.services";
import { useAuthStore } from "@/store/useAuthStore";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().nonempty("Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function Login() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  function showError(title: string, description: string) {
    sileo.error({
      title,
      description: (
        <span className="text-center">{description}</span>
      ),
      fill: "black",
      styles: {
        title: "text-white!",
        description: "text-white/75!",
        badge: "bg-white/5!",
      },
    });
  }

  async function onSubmit(values: LoginValues) {
    try {
      const res = await authService.login(values);
      setUser(res.user);
      router.push(res.user.completedSetup ? "/dashboard" : "/setup/step/onboarding");
    } catch (error) {
      showError(
        "Authentication Failed",
        error instanceof Error ? error.message : "Invalid credentials, please verify and try again."
      );
    }
  }

  function onInvalid() {
    showError("Missing Fields", "Username and password are required.");
  }

  return (
    <main className="relative overflow-hidden bg-[#0E0E0E] min-h-dvh">
      <div className="absolute w-full h-full">
        <div className="hidden lg:block absolute w-100 h-100 border-2 border-landing-primary/3 rounded-xl -bottom-40 left-1/6" />
        <div className="hidden lg:block absolute w-80 h-80 border-2 border-landing-primary/3 rounded-xl -top-20 right-1/6" />

        <div className="hidden lg:flex bottom-10 right-0 absolute flex-col gap-2 items-end">
          <span className="w-50 h-0.5 bg-landing-primary/30 animate-fade-left animate-delay-[0.35s]" />
          <span className="w-40 h-0.5 bg-landing-primary/30 animate-fade-left animate-delay-[0.6s]" />
        </div>
      </div>

      <div className="absolute -right-10 -top-10 w-[70%] h-[40%] bg-[#0DEA79]/5 rounded-full blur-[80px] pointer-events-none lg:-right-20 lg:top-0 lg:w-[45%] lg:h-[60%] lg:blur-[120px] xl:-right-10 xl:w-[50%]" />
      <div className="absolute -left-10 bottom-0 w-[65%] h-[35%] bg-[#0DEA79]/4 rounded-full blur-[80px] pointer-events-none lg:-left-20 lg:w-[40%] lg:h-[55%] lg:blur-[100px] xl:-left-10 xl:w-[45%]" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[20%] bg-[#0DEA79]/3 rounded-full blur-[100px] pointer-events-none lg:w-[30%] lg:h-[30%] lg:blur-[140px] xl:w-[25%]" />

      <header className="relative animate-fade">
        <Image
          src={Logo}
          alt="Cashflow Logo"
          loading="eager"
          className="w-8 lg:w-24 absolute top-4 left-6 lg:top-6 lg:left-12"
        />
      </header>

      <section className="flex flex-col h-dvh justify-center items-center gap-6 lg:gap-8 px-4">

        <div className="flex flex-col items-center animate-fade-down">
          <h1 className="text-center text-landing-primary text-xl lg:text-2xl xl:text-4xl font-bold">CashFlow</h1>
          <p className="uppercase font-normal text-[#ADAAAA] text-xs lg:text-sm font-inter">Premium Ledger</p>
        </div>

        <article
          className="w-full max-w-sm lg:w-86 xl:w-96 p-6 lg:p-8 rounded-3xl flex flex-col gap-4 relative animate-fade-up"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.03) 100%)",
            backdropFilter: "blur(40px) saturate(180%)",
            WebkitBackdropFilter: "blur(40px) saturate(180%)",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: `
              0 0 0 0.5px rgba(255,255,255,0.06) inset,
              0 1px 0 rgba(255,255,255,0.12) inset,
              0 32px 64px rgba(0,0,0,0.4),
              0 8px 24px rgba(0,0,0,0.25)
            `,
          }}
        >
          <div
            className="absolute top-0 left-4 right-4 h-px pointer-events-none rounded-full"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
            }}
          />

          <div className="flex flex-col">
            <h3 className="text-xl lg:text-2xl font-bold text-center">Welcome Back</h3>
            <p className="text-xs lg:text-sm text-[#ADAAAA] text-center">Access your financial headquarters</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="flex flex-col gap-3 lg:gap-4">
            <div className="relative">
              <label htmlFor="username" className="uppercase font-semibold text-xs text-[#ADAAAA] tracking-widest">
                Username
              </label>
              <User className="absolute top-9 left-2.5" />
              <Input
                type="text"
                placeholder="johnDoe"
                id="username"
                autoComplete="username"
                className="pl-8"
                {...register("username")}
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="uppercase font-semibold text-xs text-[#ADAAAA] tracking-widest">
                Password
              </label>
              <Lock className="absolute top-9 left-2.5" />
              <Link href="/auth/forgot-password" className="absolute right-0 top-0 text-xs text-landing-primary">
                Forgot Password?
              </Link>
              <Input
                type="password"
                placeholder="•••••••••••"
                id="password"
                autoComplete="current-password"
                className="pl-8"
                {...register("password")}
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full p-2 lg:p-2.5 rounded-xl shadow-lg shadow-black/20 bg-linear-to-r from-landing-primary to-[#13EA79] text-[#002712] font-semibold hover:bg-linear-to-r hover:from-[#10ca67] hover:to-[#089549] transition-colors duration-300 disabled:opacity-60"
            >
              {isSubmitting ? "Verifying..." : "Login to Dashboard"}
            </Button>
          </form>

          <div className="flex items-center gap-2">
            <div className="w-full h-px bg-linear-to-r from-[#ADAAAA]/10 to-[#ADAAAA]/0" />
            <p className="text-sm text-[#ADAAAA]">or</p>
            <div className="w-full h-px bg-linear-to-r from-[#ADAAAA]/0 to-[#ADAAAA]/10" />
          </div>

          <p className="text-center text-xs lg:text-sm text-[#ADAAAA]">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-landing-primary">Register</Link>
          </p>
        </article>

        <article className="flex items-center gap-6 lg:gap-12">
          <Link href="#" className="text-[#ADAAAA] text-xs lg:text-sm uppercase animate-fade-up animate-delay-[0.2s]">Security</Link>
          <Link href="#" className="text-[#ADAAAA] text-xs lg:text-sm uppercase animate-fade-up animate-delay-[0.3s]">Privacy</Link>
          <Link href="#" className="text-[#ADAAAA] text-xs lg:text-sm uppercase animate-fade-up animate-delay-[0.4s]">Help</Link>
        </article>

      </section>
    </main>
  );
}
