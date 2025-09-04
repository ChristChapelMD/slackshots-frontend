"use client";

import { FormEvent, useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";

import { useAuth } from "@/hooks/use-auth";

export default function SignInForm() {
  const { signIn, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const disabled = () => loading || !email || !password;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await signIn({
      email,
      password,
      callbackURL: "/dashboard",
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input
        isRequired
        label="Email"
        type="email"
        value={email}
        variant="faded"
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        isRequired
        label="Password"
        type="password"
        value={password}
        variant="faded"
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="text-sm text-red-500">{error.message}</p>}

      <Button
        className="w-full rounded-lg px-4 py-3 text-white font-semibold disabled:opacity-50"
        color={disabled() ? "default" : "primary"}
        isDisabled={disabled()}
        isLoading={loading}
        type="submit"
      >
        {loading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}
