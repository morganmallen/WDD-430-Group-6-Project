"use client";

import { type ReactElement } from "react";
import LoginForm from "../ui/forms/LoginForm";

export default function LoginPage(): ReactElement {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <LoginForm />
    </main>
  );
}
