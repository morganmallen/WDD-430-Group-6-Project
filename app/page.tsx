"use client";
import Link from 'next/link';
import Image from 'next/image';

export default function Page() {
  return (
    <main>
      {/*Hero Section*/ }
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
          {/* Banner */}
          <div className="hero-banner">
            <h1>Upgrade Your Space</h1>
            <p>Discover handcrafted pieces to transform your home.</p>
            
            {/* Link to login */}
            <Link href="/login">
              <button>Shop Now</button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}