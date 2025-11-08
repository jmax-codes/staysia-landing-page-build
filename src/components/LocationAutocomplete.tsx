"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { useGlobalStore } from "@/store/useGlobalStore";

interface Location {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
}

interface LocationAutocompleteProps {
  onSelect?: (location: string) => void;
}

export function LocationAutocomplete({ onSelect }: LocationAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { selectedLocation, setSelectedLocation } = useGlobalStore();

  // Search with debounce
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?` +
            new URLSearchParams({
              q: query,
              format: "json",
              addressdetails: "1",
              limit: "8",
            }),
          {
            headers: {
              "User-Agent": "Staysia Property Rental App",
            },
          }
        );
        const data = await response.json();
        setResults(data);
        setIsOpen(true);
      } catch (error) {
        console.error("Error fetching locations:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (location: Location) => {
    const cityName = location.display_name.split(",")[0];
    setQuery(cityName);
    setSelectedLocation(cityName);
    setIsOpen(false);
    onSelect?.(cityName);
  };

  const formatLocationName = (displayName: string) => {
    const parts = displayName.split(",");
    return parts.slice(0, 3).join(", ");
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-2">
        <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && results.length > 0 && setIsOpen(true)}
          placeholder="City, hotel, place to go"
          className="w-full text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none bg-transparent"
        />
        {isLoading && <Loader2 className="w-4 h-4 text-gray-400 animate-spin flex-shrink-0" />}
      </div>

      {/* Liquid Glass Dropdown */}
      {isOpen && results.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto"
          style={{
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)",
          }}
        >
          {results.map((location) => (
            <button
              key={location.place_id}
              onClick={() => handleSelect(location)}
              className="w-full px-4 py-3 text-left hover:bg-white/60 transition-all duration-200 border-b border-gray-100/50 last:border-0 group"
            >
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#283B73] mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {formatLocationName(location.display_name)}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{location.type}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
