"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, Star } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";

interface PropertyCardProps {
  id: number;
  name: string;
  city: string;
  area: string;
  type: string;
  price: number;
  nights: number;
  rating: number;
  imageUrl: string;
  isGuestFavorite: boolean;
}

export function PropertyCard({
  id,
  name,
  area,
  type,
  price,
  nights,
  rating,
  imageUrl,
  isGuestFavorite: initialFavorite,
}: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [isHovered, setIsHovered] = useState(false);
  const { selectedCurrency, exchangeRate } = useCurrency();

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const response = await fetch("/api/properties/favorite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      
      if (response.ok) {
        setIsFavorite(!isFavorite);
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  // Convert price from IDR to selected currency
  const convertedPrice = price * exchangeRate;
  
  // Format price with currency symbol
  const formattedPrice = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: selectedCurrency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(convertedPrice);

  return (
    <div
      className="group relative flex-shrink-0 w-[280px] sm:w-[320px] cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
        {/* Image Container */}
        <div className="relative h-[200px] sm:h-[240px] overflow-hidden">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className={`object-cover transition-transform duration-500 ${
              isHovered ? "scale-110" : "scale-100"
            }`}
          />
          
          {/* Guest Favorite Badge */}
          {initialFavorite && (
            <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full shadow-md">
              <span className="text-xs font-semibold text-gray-700">
                Guest favorite
              </span>
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={toggleFavorite}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 hover:bg-white shadow-md transition-all hover:scale-110"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFavorite
                  ? "fill-red-500 text-red-500"
                  : "text-gray-700"
              }`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-base line-clamp-1 mb-1">
                {type} in {area}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-1">{name}</p>
            </div>
            <div className="flex items-center gap-1 ml-2">
              <Star className="w-4 h-4 fill-gray-900 text-gray-900" />
              <span className="text-sm font-semibold text-gray-900">
                {rating.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-gray-900">
                {formattedPrice}
              </span>
              <span className="text-sm text-gray-600">
                for {nights} nights
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}