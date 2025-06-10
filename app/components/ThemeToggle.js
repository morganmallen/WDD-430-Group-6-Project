'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Load saved theme on mount
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setIsDark(!isDark);
  };

  return (
    <button onClick={toggleTheme} style={{ 
    position: 'fixed',
    right: '2rem',
    top: '2rem',
    padding: '0.75rem 1.5rem',
    borderRadius: '9999px',
    backgroundColor: 'white',
    fontSize: '15px',
    color: 'black',
    border: 'solid rgba(229, 215, 136, 0.9)',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'}}>
    {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
    </button>
  );
}
