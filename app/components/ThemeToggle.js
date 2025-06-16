"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Only run on client-side after mount
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      setIsDark(true);
    }
  }, []);

  // Update theme only after component is mounted
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark, mounted]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  // Prevent flash of wrong theme by not rendering until mounted
  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={toggleTheme}
      style={{
        position: "fixed",
        right: "1.5rem",
        top: "1.5rem",
        zIndex: "9999",
        padding: "0.75rem 1.5rem",
        borderRadius: "9999px",
        backgroundColor: "white",
        fontSize: "15px",
        color: "black",
        border: "solid rgba(229, 215, 136, 0.9)",
        cursor: "pointer",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      }}
    >
      {isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
    </button>
  );
}
