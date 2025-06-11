// components/SearchBar.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import React from 'react';
import '../components/SearchBar.css'; 

export function SearchBar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = '/products'; 

  const PRODUCT_CONDITIONS = [
    "New",
    "Used - Like New",
    "Used - Good",
    "Used - Fair",
    "For Parts",
  ];

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('searchTerm', term);
    } else {
      params.delete('searchTerm');
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleConditionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const term = e.target.value;
    const params = new URLSearchParams(searchParams);
    if (term && term !== 'All') {
      params.set('condition', term);
    } else {
      params.delete('condition');
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    // Apply the container class
    <div className="search-bar-container">
      <input
        type="text"
        placeholder="Search products..."
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get('searchTerm')?.toString() || ''}
        // Apply the input class
        className="search-bar-input"
      />
      <select
        onChange={handleConditionChange}
        defaultValue={searchParams.get('condition')?.toString() || 'All'}
        // Apply the select class
        className="search-bar-select"
      >
        <option value="All">All Conditions</option>
        {PRODUCT_CONDITIONS.map((condition) => (
          <option key={condition} value={condition}>
            {condition}
          </option>
        ))}
      </select>
    </div>
  );
}