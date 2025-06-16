"use client";

import { type ReactElement, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "../ui/forms/LoginForm";
import { useAuth } from "../context/AuthContext";

export default function LoginPage(): ReactElement | null {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  if (isLoggedIn) {
    return null; // Don't render anything while redirecting
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <LoginForm />
    </main>
  );
}
