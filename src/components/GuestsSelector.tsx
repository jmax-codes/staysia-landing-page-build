"use client";

import { useState, useRef, useEffect } from "react";
import { Users, Minus, Plus } from "lucide-react";

interface GuestCounts {
  adults: number;
  children: number;
  pets: number;
  rooms: number;
}

interface GuestsSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GuestsSelector({ isOpen, onClose }: GuestsSelectorProps) {
  const [guests, setGuests] = useState<GuestCounts>({
    adults: 0,
    children: 0,
    pets: 0,
    rooms: 0,
  });

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const updateGuest = (type: keyof GuestCounts, delta: number) => {
    setGuests((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] + delta),
    }));
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full mt-12 right-0 bg-white rounded-2xl shadow-2xl p-6 w-[380px] z-50 border border-gray-100"
    >
      <div className="space-y-6">
        {/* Adults */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-base font-semibold text-gray-900">Adults</div>
            <div className="text-sm text-gray-500">Ages 13 or above</div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => updateGuest("adults", -1)}
              disabled={guests.adults === 0}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Minus className="w-4 h-4 text-gray-600" />
            </button>
            <span className="w-8 text-center font-medium text-gray-900">{guests.adults}</span>
            <button
              onClick={() => updateGuest("adults", 1)}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
            >
              <Plus className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* Children */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-base font-semibold text-gray-900">Children</div>
            <div className="text-sm text-gray-500">Ages 2–12</div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => updateGuest("children", -1)}
              disabled={guests.children === 0}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Minus className="w-4 h-4 text-gray-600" />
            </button>
            <span className="w-8 text-center font-medium text-gray-900">{guests.children}</span>
            <button
              onClick={() => updateGuest("children", 1)}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
            >
              <Plus className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* Pets */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-base font-semibold text-gray-900">Pets</div>
            <div className="text-sm text-gray-500 underline cursor-pointer">
              Bringing a service animal?
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => updateGuest("pets", -1)}
              disabled={guests.pets === 0}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Minus className="w-4 h-4 text-gray-600" />
            </button>
            <span className="w-8 text-center font-medium text-gray-900">{guests.pets}</span>
            <button
              onClick={() => updateGuest("pets", 1)}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
            >
              <Plus className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* Rooms */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-base font-semibold text-gray-900">Rooms</div>
            <div className="text-sm text-gray-500">Number of rooms</div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => updateGuest("rooms", -1)}
              disabled={guests.rooms === 0}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Minus className="w-4 h-4 text-gray-600" />
            </button>
            <span className="w-8 text-center font-medium text-gray-900">{guests.rooms}</span>
            <button
              onClick={() => updateGuest("rooms", 1)}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
            >
              <Plus className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface GuestsInputProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

export function GuestsInput({ isOpen, onOpenChange }: GuestsInputProps) {
  const [guests, setGuests] = useState({
    adults: 0,
    children: 0,
    pets: 0,
    rooms: 0,
  });

  const formatGuestSummary = () => {
    const parts = [];
    if (guests.adults > 0) parts.push(`${guests.adults} Adult${guests.adults > 1 ? "s" : ""}`);
    if (guests.children > 0) parts.push(`${guests.children} Child${guests.children > 1 ? "ren" : ""}`);
    if (guests.pets > 0) parts.push(`${guests.pets} Pet${guests.pets > 1 ? "s" : ""}`);
    if (guests.rooms > 0) parts.push(`${guests.rooms} Room${guests.rooms > 1 ? "s" : ""}`);
    return parts.length > 0 ? parts.join(", ") : "Add guests";
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-gray-400" />
        <button
          onClick={onOpenChange}
          className="flex-1 text-left text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
        >
          {formatGuestSummary()}
        </button>
      </div>
      <GuestsSelector isOpen={isOpen} onClose={onOpenChange} />
    </div>
  );
}