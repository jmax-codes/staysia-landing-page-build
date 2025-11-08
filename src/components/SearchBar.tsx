"use client";

import { useState } from "react";
import { Calendar, Search, Home, Castle, Building2, Hotel, Building, X } from "lucide-react";
import { Button } from "./ui/button";
import { LocationAutocomplete } from "./LocationAutocomplete";
import { DateRangePicker } from "./DateRangePicker";
import { GuestsInput } from "./GuestsSelector";
import { format } from "date-fns";

export function SearchBar() {
  const [activeTab, setActiveTab] = useState("all");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);

  const categories = [
  { id: "all", label: "All", icon: null, color: null },
  { id: "houses", label: "Houses", icon: Home, color: "#FF6B6B" },
  { id: "villas", label: "Villas", icon: Castle, color: "#4ECDC4" },
  { id: "apartment", label: "Apartment", icon: Building2, color: "#95E1D3" },
  { id: "hotels", label: "Hotels", icon: Hotel, color: "#F38181" },
  { id: "condos", label: "Condos", icon: Building, color: "#AA96DA" },
  { id: "penthouses", label: "Penthouses", icon: Building2, color: "#FCBAD3" }];

  const handleDateSelect = (checkInDate: Date | null, checkOutDate: Date | null) => {
    setCheckIn(checkInDate);
    setCheckOut(checkOutDate);
  };

  const clearDates = () => {
    setCheckIn(null);
    setCheckOut(null);
  };

  const formatDateRange = () => {
    if (checkIn && checkOut) {
      return `${format(checkIn, "MMM d")} - ${format(checkOut, "MMM d, yyyy")}`;
    } else if (checkIn) {
      return format(checkIn, "MMM d, yyyy");
    }
    return "";
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Tabs */}
      <div className="flex gap-2 mb-4 justify-start overflow-x-auto scrollbar-hide py-3 px-1">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full font-medium transition-all whitespace-nowrap flex-shrink-0 ${
              activeTab === category.id ?
              "bg-white text-[#283B73] shadow-lg scale-105" :
              "text-white hover:bg-white/10 hover:scale-105"}`
              }>

              {Icon &&
              <Icon
                className="w-4 h-4"
                style={{ color: category.color }} />

              }
              <span className="text-sm sm:text-base">{category.label}</span>
            </button>);

        })}
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-2xl shadow-2xl p-3 sm:p-4 relative">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_2fr_1.5fr_auto] gap-3 md:gap-0 md:divide-x">
          {/* Location */}
          <div className="px-4 py-3">
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              City, destination, or hotel name
            </label>
            <LocationAutocomplete />
          </div>

          {/* Dates */}
          <div className="px-4 py-3 relative">
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Check-in & Check-out Dates
            </label>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <button
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                className="flex-1 text-left text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
              >
                {formatDateRange() || "Add dates"}
              </button>
              {(checkIn || checkOut) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearDates();
                  }}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              )}
            </div>
          </div>

          {/* Guests */}
          <div className="px-4 py-3">
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Guests
            </label>
            <GuestsInput />
          </div>

          {/* Search Button */}
          <div className="flex items-center justify-center px-2">
            <Button className="bg-[#FFB400] hover:bg-[#e5a200] text-white rounded-xl w-full md:w-auto px-8 py-6 md:py-3 font-semibold transition-colors">
              <Search className="w-5 h-5 mr-0 md:mr-0" />
              <span className="md:hidden ml-2">Search</span>
            </Button>
          </div>
        </div>

        {/* Date Range Picker */}
        <DateRangePicker
          isOpen={isCalendarOpen}
          onClose={() => setIsCalendarOpen(false)}
          onSelect={handleDateSelect}
        />
      </div>
    </div>
  );
}