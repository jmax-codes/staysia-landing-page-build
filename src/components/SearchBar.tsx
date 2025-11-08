"use client";

import { useState } from "react";
import { Users, Search, Home, Castle, Building2, Hotel, Building } from "lucide-react";
import { Button } from "./ui/button";
import { LocationAutocomplete } from "./LocationAutocomplete";
import { DateRangePicker } from "./DateRangePicker";

export function SearchBar() {
  const [activeTab, setActiveTab] = useState("all");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const categories = [
  { id: "all", label: "All", icon: null, color: null },
  { id: "houses", label: "Houses", icon: Home, color: "#FF6B6B" },
  { id: "villas", label: "Villas", icon: Castle, color: "#4ECDC4" },
  { id: "apartment", label: "Apartment", icon: Building2, color: "#95E1D3" },
  { id: "hotels", label: "Hotels", icon: Hotel, color: "#F38181" },
  { id: "condos", label: "Condos", icon: Building, color: "#AA96DA" },
  { id: "penthouses", label: "Penthouses", icon: Building2, color: "#FCBAD3" }];

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
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
      <div className="bg-white rounded-2xl shadow-2xl p-3 sm:p-4">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_2fr_1.5fr_auto] gap-3 md:gap-0 md:divide-x">
          {/* Location */}
          <div className="px-4 py-3">
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              City, destination, or hotel name
            </label>
            <LocationAutocomplete />
          </div>

          {/* Dates */}
          <div className="px-4 py-3">
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Check-in & Check-out Dates
            </label>
            <DateRangePicker 
              startDate={startDate}
              endDate={endDate}
              onChange={handleDateChange}
            />
          </div>

          {/* Guests */}
          <div className="px-4 py-3">
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Guests and Rooms
            </label>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="1 Adult(s), 0 Child, 1 Room"
                className="w-full text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none" />

            </div>
          </div>

          {/* Search Button */}
          <div className="flex items-center justify-center px-2">
            <Button className="bg-[#FFB400] hover:bg-[#e5a200] text-white rounded-xl w-full md:w-auto px-8 py-6 md:py-3 font-semibold transition-colors">
              <Search className="w-5 h-5 mr-0 md:mr-0" />
              <span className="md:hidden ml-2">Search</span>
            </Button>
          </div>
        </div>
      </div>
    </div>);

}