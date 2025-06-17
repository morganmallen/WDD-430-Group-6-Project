"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isLoggedIn, logout, userName } = useAuth();
  const firstName = userName ? userName.split(" ")[0] : "";

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <header className="header">
        <Image
          src="/logo.png"
          alt="Handcrafted Haven Logo"
          className="logo"
          width={200}
          height={50}
          priority
        />
        <h1>Handcrafted Haven</h1>
        <div>
          <ThemeToggle />
        </div>
      </header>
      <nav id="animateme" aria-label="Main navigation">
        <button
          id="myButton"
          className={`menu-toggle ${isMenuOpen ? "open" : ""}`}
          aria-label={
            isMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={isMenuOpen}
          onClick={toggleMenu}
        ></button>
        <ul className={`menulinks ${isMenuOpen ? "open" : ""}`}>
          <li className={pathname === "/" ? "active" : ""}>
            <Link href="/">Home</Link>
          </li>
          <li className={pathname === "/products" ? "active" : ""}>
            <Link href="/products">Browse</Link>
          </li>
          <li className={pathname === "/sellers" ? "active" : ""}>
            <Link href="/sellers">Sellers</Link>
          </li>
          {!isLoggedIn ? (
            <li className={pathname === "/login" ? "active" : ""}>
              <Link href="/login">Login</Link>
            </li>
          ) : (
            <>
              <li className={pathname === "/profile" ? "active" : ""}>
                <Link href="/profile">Profile</Link>
              </li>
              <li>
                <button onClick={logout} className="logout-button">
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
      {isLoggedIn && userName && (
        <div className="welcome-message">Welcome, {firstName}!</div>
      )}
    </>
  );
}
