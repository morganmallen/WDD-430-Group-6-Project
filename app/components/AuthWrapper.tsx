"use client";

import { ReactNode } from "react";
import { AuthProvider } from "../context/AuthContext";
import Header from "./header";
import Footer from "./footer";

export default function AuthWrapper({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <Header />
      {children}
      <Footer />
    </AuthProvider>
  );
}
