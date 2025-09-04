"use client";

import { FormEvent, useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";

import { useAuth } from "@/hooks/use-auth";

export default function SignUpForm() {
  const { signUp, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const disabled = () => {
    return (
      loading ||
      !email ||
      !password ||
      !confirmPassword ||
      !firstName ||
      !lastName
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");

      return;
    }
    await signUp({
      email,
      password,
      name: `${firstName} ${lastName}`,
      callbackURL: "/dashboard",
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="flex gap-4">
        <Input
          isRequired
          label="First Name"
          value={firstName}
          variant="faded"
          onChange={(e) => setFirstName(e.target.value)}
        />
        <Input
          isRequired
          label="Last Name"
          value={lastName}
          variant="faded"
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
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
      <Input
        isRequired
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        variant="faded"
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      {error && <p className="text-sm text-red-500">{error.message}</p>}

      <Button
        className="w-full rounded-lg px-4 py-3 text-white font-semibold disabled:opacity-50"
        color={disabled() ? "default" : "primary"}
        isDisabled={disabled()}
        isLoading={loading}
        type="submit"
      >
        {loading ? "Creating account..." : "Sign Up"}
      </Button>
    </form>
  );
}
