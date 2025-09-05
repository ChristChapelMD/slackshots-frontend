"use client";

import { FormEvent, useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Eye, EyeClosed } from "@phosphor-icons/react";

import { useAuth } from "@/hooks/use-auth";

export default function SignInForm() {
  const { signIn, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [touched, setTouched] = useState({
    email: false,
  });

  const [hasTyped, setHasTyped] = useState({
    email: false,
  });

  const isEmailInvalid = !/^\S+@\S+\.\S+$/.test(email);

  const isFormValid = !isEmailInvalid;

  const disabled = loading || !isFormValid;

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
        errorMessage={
          touched.email && isEmailInvalid ? "Please enter a valid email" : null
        }
        isInvalid={touched.email && isEmailInvalid}
        label="Email"
        type="email"
        value={email}
        variant="faded"
        onBlur={() => {
          hasTyped.email
            ? setTouched((prev) => ({ ...prev, email: true }))
            : null;
        }}
        onChange={(e) => {
          setHasTyped((prev) => ({ ...prev, email: true }));
          setEmail(e.target.value);
        }}
      />
      <Input
        isRequired
        endContent={
          <Button
            disableRipple
            isIconOnly
            className="bg-transparent hover:bg-default"
            isDisabled={!password.trim()}
            onPress={() => {
              setPasswordVisible(!passwordVisible);
            }}
          >
            {passwordVisible ? <Eye /> : <EyeClosed />}
          </Button>
        }
        label="Password"
        type={passwordVisible ? "text" : "password"}
        value={password}
        variant="faded"
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="text-sm text-danger">{error.message}</p>}

      <Button
        className="w-full rounded-lg px-4 py-3 text-white font-semibold disabled:opacity-50"
        color={disabled ? "default" : "primary"}
        isDisabled={disabled}
        isLoading={loading}
        type="submit"
      >
        {loading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}
