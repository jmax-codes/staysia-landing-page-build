"use client";

import { SearchBar } from "./SearchBar";

export function Header() {
  return (
    <header className="relative min-h-[600px] lg:min-h-[700px]">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-12 pt-32 lg:pt-40 pb-16">
        <div className="max-w-[1400px] mx-auto">
          <h1 
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-center mb-12 lg:mb-16 tracking-tight"
            style={{ 
              color: '#f4e9d8',
              fontFamily: "'Playfair Display', serif"
            }}
          >
            Find your perfect stay
          </h1>
          
          <SearchBar />
        </div>
      </div>
    </header>
  );
}