import Image from "next/image";
import { Card } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Link as HeroLink } from "@heroui/link";
import NextLink from "next/link";

import SlackShotsLogo from "@/public/SSLOGO_NOBG.png";
import SlackLogo from "@/public/SLA-appIcon-desktop.png";
import SignUpForm from "@/components/auth/sign-up-form";

export default function SignUpPage() {
  return (
    <Card className="w-full max-w-md rounded-xl drop-shadow-lg p-8 gap-1 text-foreground font-semibold border border-zinc-400/25 group relative flex shadow-[inset_0_-8px_10px_#8fdfff1f] whitespace-nowrap">
      <Image
        alt="SlackShots Logo"
        className="absolute -top-16 -right-16 blur-3xl opacity-20 pointer-events-none"
        height={400}
        src={SlackShotsLogo}
        width={400}
      />

      <div className="mb-8 text-center relative z-10">
        <HeroLink as={NextLink} href="/">
          <Image
            alt="SlackShots Logo"
            className="mx-auto pointer-events-none"
            height={80}
            src={SlackShotsLogo}
            width={80}
          />
        </HeroLink>
        <h1 className="text-3xl font-extrabold">Create your account</h1>
        <p className=" mt-2 text-sm">Sign up with Slack or your email</p>
      </div>

      <HeroLink
        as={NextLink}
        className="flex items-center justify-center gap-2 w-full rounded-lg px-4 py-3 text-slate-900 font-medium border border-zinc-300 bg-white shadow-sm hover:shadow-md transition-shadow"
        href="/dashboard"
      >
        <Image alt="Slack Logo" height={24} src={SlackLogo} width={24} />
        Continue with Slack
      </HeroLink>

      <div className="my-6 flex items-center">
        <Divider className="flex-1" />
        <span className="mx-3 text-sm text-zinc-400">or</span>
        <Divider className="flex-1" />
      </div>

      <SignUpForm />

      <p className="mt-6 text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <NextLink
          className="text-primary hover:text-primary-500 underline font-medium"
          href="/signin"
        >
          Sign in
        </NextLink>
      </p>
      <p className="text-center text-sm text-zinc-500">
        Forgot your password?{" "}
        <NextLink
          className="text-primary hover:text-primary-500 underline font-medium"
          href="/reset-passowrd"
        >
          Reset password
        </NextLink>
      </p>
    </Card>
  );
}
