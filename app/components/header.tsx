"use client";
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <header className="header">
        <img src="/logo.png" alt="Handcrafted Haven Logo" className="logo" />
        <h1>Handcrafted Haven</h1>
      </header>
      <nav id="animateme" aria-label="Main navigation">
        <button
          id="myButton"
          className={`menu-toggle ${isMenuOpen ? 'open' : ''}`}
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
          onClick={toggleMenu}
        ></button>
        <ul className={`menulinks ${isMenuOpen ? 'open' : ''}`}>
          <li className={pathname === "/" ? "active" : ""}><Link href="/">Home</Link></li>
          <li className={pathname === "/products" ? "active" : ""}><Link href="/products">Browse</Link></li>
          <li className={pathname === "/sellers" ? "active" : ""}><Link href="/sellers">Sellers</Link></li>
          <li className={pathname === "/login" ? "active" : ""}><Link href="/login">Login</Link></li>
        </ul>
      </nav>
    </>
  );
}