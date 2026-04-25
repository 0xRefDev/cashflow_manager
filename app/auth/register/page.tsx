"use client";

import Image from "next/image";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { sileo } from "sileo";
import { useState, useRef } from "react";

import Logo from "@/assets/images/cashflow-logo.webp";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { OtpInput } from "@/components/OtpInput";
import { User } from "@/icons/User";
import { Lock } from "@/icons/Lock";
import { AtSign } from "@/icons/AtSign";
import { Mail } from "@/icons/Mail";
import { Bank } from "@/icons/Bank";
import { PiggyBank } from "@/icons/PiggyBank";
import { GraphArrow } from "@/icons/GraphArrow";

import { authService } from "@/services/client/auth.services";

const registerSchema = z.object({
  fullname: z.string().min(1, "Full name is required"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers and underscores allowed"),
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^a-zA-Z0-9]/, "Must contain at least one special character"),
});

type RegisterValues = z.infer<typeof registerSchema>;
type Step = "form" | "otp";

export default function Register() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("form");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const otpKey = useRef(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  });

  function showError(title: string, description: string) {
    sileo.error({
      title,
      description: <span className="font-semibold">{description}</span>,
      fill: "black",
      styles: {
        title: "text-white!",
        description: "text-white/75!",
        badge: "bg-white/5!",
      },
    });
  }

  async function onSubmit(values: RegisterValues) {
    try {
      await authService.register(values);
      await authService.sendOtp(values.email);
      setRegisteredEmail(values.email);
      setStep("otp");
    } catch (error) {
      showError(
        "Registration Failed",
        error instanceof Error ? error.message : "Something went wrong. Please try again."
      );
    }
  }

  function onInvalid() {
    const firstError = Object.values(errors)[0];
    showError("Invalid Fields", firstError?.message ?? "Please review your information.");
  }

  async function handleOtpComplete(code: string) {
    setIsVerifying(true);
    setOtpError(false);

    try {
      await authService.verifyOtp(registeredEmail, code);
      sileo.success({
        title: "Email Verified",
        description: <span>Your account is ready. Please log in.</span>,
        fill: "black",
        styles: {
          title: "text-white!",
          description: "text-white/75!",
          badge: "bg-white/5!",
        },
      });
      router.push("/auth/login");
    } catch (error) {
      setOtpError(true);
      otpKey.current += 1;
      showError(
        "Verification Failed",
        error instanceof Error ? error.message : "Invalid code. Please try again."
      );
    } finally {
      setIsVerifying(false);
    }
  }

  async function handleResend() {
    setIsResending(true);
    setOtpError(false);
    otpKey.current += 1;

    try {
      await authService.sendOtp(registeredEmail);
      sileo.success({
        title: "Code Sent",
        description: <span>A new verification code was sent to your email.</span>,
        fill: "black",
        styles: {
          title: "text-white!",
          description: "text-white/75!",
          badge: "bg-white/5!",
        },
      });
    } catch {
      showError("Failed to Resend", "Could not send a new code. Please try again.");
    } finally {
      setIsResending(false);
    }
  }

  return (
    <main className="relative bg-[#0E0E0E] min-h-dvh">
      <div className="absolute w-full h-full flex justify-center items-end pb-4 text-landing-primary/20 2xl:pb-16">
        <div className="hidden sm:flex w-30 h-30 border-2 border-landing-primary/3 rounded-xl justify-center items-center animate-fade">
          <GraphArrow />
        </div>
        <span className="bg-linear-to-r from-landing-primary/2.5 to-landing-primary/8 w-60 h-0.5 mb-13 animate-fade-right animate-delay-[0.40s]"></span>
        <div className="hidden sm:flex w-30 h-30 border-2 border-landing-primary/3 rounded-xl justify-center items-center animate-fade animate-delay-[0.60s]">
          <Bank />
        </div>
        <span className="bg-linear-to-r from-landing-primary/8 to-landing-primary/2.5 w-60 h-0.5 mb-13 animate-fade-left animate-delay-[0.75s]"></span>
        <div className="hidden sm:flex w-30 h-30 border-2 border-landing-primary/3 rounded-xl justify-center items-center animate-fade animate-delay-[0.85s]">
          <PiggyBank />
        </div>
      </div>

      <div className="absolute -right-10 -top-10 w-[70%] h-[40%] bg-[#0DEA79]/5 rounded-full blur-[80px] pointer-events-none lg:-right-20 lg:top-0 lg:w-[45%] lg:h-[60%] lg:blur-[120px] xl:-right-10 xl:w-[50%]" />
      <div className="absolute -left-10 bottom-0 w-[65%] h-[35%] bg-[#0DEA79]/4 rounded-full blur-[80px] pointer-events-none lg:-left-20 lg:w-[40%] lg:h-[55%] lg:blur-[100px] xl:-left-10 xl:w-[45%]" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[20%] bg-[#0DEA79]/3 rounded-full blur-[100px] pointer-events-none lg:w-[30%] lg:h-[30%] lg:blur-[140px] xl:w-[25%]" />

      <header className="relative animate-fade">
        <Link href="/auth/login">
          <Image
            src={Logo}
            alt="Cashflow Logo"
            loading="eager"
            className="w-8 lg:w-24 absolute top-4 left-6 lg:top-6 lg:left-12"
          />
        </Link>
      </header>

      <section className="flex flex-col h-dvh items-center gap-6 lg:gap-8 px-4">
        <div className="flex flex-col items-center gap-5 mt-10 2xl:mt-30">
          <h1 className="text-center text-white text-xl lg:text-2xl xl:text-5xl font-bold animate-fade-down animate-delay-[0.30s]">
            {step === "form" ? "Create your account" : "Verify your email"}
          </h1>
          <p className="font-normal text-[#ADAAAA] text-xs lg:text-[0.98rem] font-inter text-center w-2xs animate-fade-down animate-delay-[0.1s]">
            {step === "form"
              ? "Join CashFlow and start managing your wealth with precision."
              : `We sent a 6-digit code to ${registeredEmail}`}
          </p>
        </div>

        <article
          className="w-full max-w-lg lg:w-xl xl:w-152 2xl:w-160 p-6 lg:p-6 xl:p-8 2xl:p-10 rounded-3xl flex flex-col gap-5 relative animate-fade-up"
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

          {step === "form" ? (
            <>
              <div className="flex flex-col">
                <h3 className="text-xl lg:text-xl font-semibold text-center text-white/30">Welcome to your savings book</h3>
              </div>

              <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="flex flex-col gap-3 lg:gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                  <div className="relative">
                    <label htmlFor="fullname" className="uppercase font-semibold text-xs text-[#ADAAAA] tracking-widest">
                      Full name
                    </label>
                    <User className="absolute top-9 left-2.5" />
                    <Input
                      type="text"
                      placeholder="John Doe"
                      id="fullname"
                      autoComplete="fullname"
                      className={`pl-8 ${errors.fullname ? "border-red-500/50" : ""}`}
                      {...register("fullname")}
                    />
                  </div>

                  <div className="relative">
                    <label htmlFor="username" className="uppercase font-semibold text-xs text-[#ADAAAA] tracking-widest">
                      Username
                    </label>
                    <AtSign className="absolute top-9 left-2.5" />
                    <Input
                      type="text"
                      placeholder="johndoe00"
                      id="username"
                      autoComplete="username"
                      className={`pl-8 ${errors.username ? "border-red-500/50" : ""}`}
                      {...register("username")}
                    />
                  </div>

                  <div className="relative">
                    <label htmlFor="email" className="uppercase font-semibold text-xs text-[#ADAAAA] tracking-widest">
                      Email
                    </label>
                    <Mail className="absolute top-9 left-2.5" />
                    <Input
                      type="email"
                      placeholder="example@gmail.com"
                      id="email"
                      autoComplete="email"
                      className={`pl-8 ${errors.email ? "border-red-500/50" : ""}`}
                      {...register("email")}
                    />
                  </div>

                  <div className="relative">
                    <label htmlFor="password" className="uppercase font-semibold text-xs text-[#ADAAAA] tracking-widest">
                      Password
                    </label>
                    <Lock className="absolute top-9 left-2.5" />
                    <Input
                      type="password"
                      placeholder="•••••••••••"
                      id="password"
                      autoComplete="new-password"
                      className={`pl-8 ${errors.password ? "border-red-500/50" : ""}`}
                      {...register("password")}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full p-2 lg:p-2.5 rounded-xl shadow-lg shadow-black/20 bg-linear-to-r from-landing-primary to-[#13EA79] text-[#002712] font-semibold hover:bg-linear-to-r hover:from-[#10ca67] hover:to-[#089549] transition-colors duration-300 disabled:opacity-60"
                >
                  {isSubmitting ? "Creating account..." : "Create Account"}
                </Button>
              </form>

              <p className="text-center text-xs lg:text-sm text-[#ADAAAA]">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-landing-primary">Login</Link>
              </p>
            </>
          ) : (
            <div className="flex flex-col items-center gap-8 py-2">
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="w-12 h-12 rounded-full bg-landing-primary/10 border border-landing-primary/20 flex items-center justify-center mb-1">
                  <Mail className="text-landing-primary" />
                </div>
                <h3 className="text-lg font-semibold text-white">Check your inbox</h3>
                <p className="text-sm text-[#ADAAAA] max-w-xs leading-relaxed">
                  Enter the 6-digit code we sent to{" "}
                  <span className="text-white font-medium">{registeredEmail}</span>
                </p>
              </div>

              <OtpInput
                key={otpKey.current}
                onComplete={handleOtpComplete}
                disabled={isVerifying}
                hasError={otpError}
              />

              {isVerifying && (
                <p className="text-sm text-[#ADAAAA] animate-pulse">Verifying...</p>
              )}

              <div className="flex flex-col items-center gap-2 w-full">
                <p className="text-xs text-[#ADAAAA]">
                  Didn&apos;t receive the code?{" "}
                  <button
                    onClick={handleResend}
                    disabled={isResending || isVerifying}
                    className="text-landing-primary hover:underline disabled:opacity-50 disabled:no-underline transition-opacity"
                  >
                    {isResending ? "Sending..." : "Resend code"}
                  </button>
                </p>
                <button
                  onClick={() => setStep("form")}
                  disabled={isVerifying}
                  className="text-xs text-[#ADAAAA]/60 hover:text-[#ADAAAA] transition-colors disabled:opacity-30"
                >
                  ← Back to registration
                </button>
              </div>
            </div>
          )}
        </article>

        <p className="lg:absolute lg:bottom-4 text-center text-xs lg:text-sm text-[#ADAAAA]">
          By registering, you agree to our{" "}
          <Link href="/terms-of-service" className="text-landing-primary">Terms of Service</Link>{" "}
          and{" "}
          <Link href="/privacy-policy" className="text-landing-primary">Privacy Policy</Link>.
        </p>
      </section>
    </main>
  );
}
