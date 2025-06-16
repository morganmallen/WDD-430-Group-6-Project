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

  const PRODUCT_CATEGORIES = [
    "All",
    "Electronics",
    "Musical Instruments",
    "Sports & Recreation",
    "Fashion & Clothing",
    "Home & Garden",
    "Entertainment",
    "Other"
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

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const term = e.target.value;
    const params = new URLSearchParams(searchParams);
    if (term && term !== 'All') {
      params.set('category', term);
    } else {
      params.delete('category');
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(type === 'min' ? 'minPrice' : 'maxPrice', value);
    } else {
      params.delete(type === 'min' ? 'minPrice' : 'maxPrice');
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="search-bar-container">
      <input
        type="text"
        placeholder="Search products..."
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get('searchTerm')?.toString() || ''}
        className="search-bar-input"
      />
      <select
        onChange={handleConditionChange}
        defaultValue={searchParams.get('condition')?.toString() || 'All'}
        className="search-bar-select"
      >
        <option value="All">All Conditions</option>
        {PRODUCT_CONDITIONS.map((condition) => (
          <option key={condition} value={condition}>
            {condition}
          </option>
        ))}
      </select>
      <select
        onChange={handleCategoryChange}
        defaultValue={searchParams.get('category')?.toString() || 'All'}
        className="search-bar-select"
      >
        {PRODUCT_CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <div className="price-range-container">
        <input
          type="number"
          placeholder="Min Price"
          onChange={(e) => handlePriceChange('min', e.target.value)}
          defaultValue={searchParams.get('minPrice')?.toString() || ''}
          className="price-input"
          min="0"
        />
        <span>-</span>
        <input
          type="number"
          placeholder="Max Price"
          onChange={(e) => handlePriceChange('max', e.target.value)}
          defaultValue={searchParams.get('maxPrice')?.toString() || ''}
          className="price-input"
          min="0"
        />
      </div>
    </div>
  );
}