"use client";
import Image from 'next/image';

export default function Page() {
  return (
    <main>
      {/* Hero Section */}
      <div className="hero-container">
        <div className="hero-border">
          <Image
            src="/hero2.jpg"
            alt="Handcrafted Haven"
            className="hero-image"
            width={1100}
            height={400}
            priority
          />
          <div className="hero-text"><h1>Upgrade your space</h1></div>
        </div>
      </div>
    </main>
  );
}