"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useTranslation } from "react-i18next";

interface PricingData {
  id: number;
  date: string;
  price: number;
  status: string;
}

interface PricingCalendarProps {
  propertyId: number;
  pricingData: PricingData[];
  basePrice: number;
}

const STATUS_COLORS = {
  available: "bg-green-50 hover:bg-green-100 text-green-900 border-green-200",
  peak_season: "bg-orange-50 hover:bg-orange-100 text-orange-900 border-orange-200",
  best_deal: "bg-blue-50 hover:bg-blue-100 text-blue-900 border-blue-200",
  sold_out: "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300",
};

export function PricingCalendar({ propertyId, pricingData, basePrice }: PricingCalendarProps) {
  const { t } = useTranslation();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedCheckIn, setSelectedCheckIn] = useState<string | null>(null);
  const [selectedCheckOut, setSelectedCheckOut] = useState<string | null>(null);
  const { selectedCurrency, exchangeRate } = useCurrency();

  // Create a map for quick pricing lookup
  const pricingMap = useMemo(() => {
    const map = new Map<string, PricingData>();
    pricingData.forEach((p) => map.set(p.date, p));
    return map;
  }, [pricingData]);

  const formatPrice = (price: number) => {
    const converted = price * exchangeRate;
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: selectedCurrency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(converted);
  };

  const formatShortPrice = (price: number) => {
    const converted = price * exchangeRate;
    if (converted >= 1000000) {
      return Math.round(converted / 1000000) + "M";
    } else if (converted >= 1000) {
      return Math.round(converted / 1000) + "k";
    }
    return converted.toString();
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);

  const monthName = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const isPastDate = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(dateString);
    return checkDate < today;
  };

  const handleDateClick = (day: number) => {
    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    
    // Disable past dates for check-in
    if (isPastDate(dateString)) return;
    
    const pricing = pricingMap.get(dateString);

    if (pricing?.status === "sold_out") return;

    if (!selectedCheckIn || (selectedCheckIn && selectedCheckOut)) {
      // Start new selection
      setSelectedCheckIn(dateString);
      setSelectedCheckOut(null);
    } else {
      // Set check-out
      if (new Date(dateString) > new Date(selectedCheckIn)) {
        setSelectedCheckOut(dateString);
      } else {
        // If selected date is before check-in, reset
        setSelectedCheckIn(dateString);
        setSelectedCheckOut(null);
      }
    }
  };

  const handleClearDates = () => {
    setSelectedCheckIn(null);
    setSelectedCheckOut(null);
  };

  const handleConfirmSelection = () => {
    if (selectedCheckIn && selectedCheckOut) {
      // Handle booking confirmation
      console.log("Booking from", selectedCheckIn, "to", selectedCheckOut);
    }
  };

  const isDateInRange = (dateString: string) => {
    if (!selectedCheckIn || !selectedCheckOut) return false;
    const date = new Date(dateString);
    return date > new Date(selectedCheckIn) && date < new Date(selectedCheckOut);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
      {/* Check-in / Check-out Display */}
      <div className="mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="border border-gray-300 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <CalendarIcon className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-semibold text-gray-700">{t('search.checkIn').toUpperCase()}</span>
            </div>
            <p className="text-sm font-medium text-gray-900">
              {selectedCheckIn
                ? new Date(selectedCheckIn).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                : t('calendar.selectDates')}
            </p>
            {selectedCheckIn && (
              <p className="text-xs text-gray-500">After 2:00 PM</p>
            )}
          </div>
          <div className="border border-gray-300 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <CalendarIcon className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-semibold text-gray-700">{t('search.checkOut').toUpperCase()}</span>
            </div>
            <p className="text-sm font-medium text-gray-900">
              {selectedCheckOut
                ? new Date(selectedCheckOut).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                : t('calendar.selectDates')}
            </p>
            {selectedCheckOut && (
              <p className="text-xs text-gray-500">Before 12:00 PM</p>
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-700 mb-2">
          {t('calendar.checkAvailability')}
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
            <span className="text-gray-600">{t('calendar.soldOut')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-gray-600">{t('calendar.peakSeason')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-gray-600">{t('calendar.bestDeal')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-600">{t('calendar.available')}</span>
          </div>
        </div>
      </div>

      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="font-semibold text-gray-900">{monthName}</h3>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="mb-6">
        {/* Day Labels */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before month starts */}
          {Array.from({ length: startingDayOfWeek }).map((_, idx) => (
            <div key={`empty-${idx}`} className="aspect-square"></div>
          ))}

          {/* Actual days */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const day = idx + 1;
            const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const pricing = pricingMap.get(dateString);
            const status = pricing?.status || "available";
            const price = pricing?.price || basePrice;
            const isPast = isPastDate(dateString);

            const isCheckIn = selectedCheckIn === dateString;
            const isCheckOut = selectedCheckOut === dateString;
            const isInRange = isDateInRange(dateString);

            return (
              <button
                key={day}
                onClick={() => handleDateClick(day)}
                disabled={status === "sold_out" || isPast}
                className={`aspect-square border rounded-lg p-1 flex flex-col items-center justify-center text-center transition-all ${
                  isPast
                    ? "bg-gray-50 text-gray-300 cursor-not-allowed border-gray-200"
                    : STATUS_COLORS[status as keyof typeof STATUS_COLORS]
                } ${
                  isCheckIn || isCheckOut
                    ? "ring-2 ring-[#283B73] ring-offset-2"
                    : isInRange
                    ? "bg-[#283B73]/10 border-[#283B73]"
                    : ""
                }`}
              >
                <span className="text-sm font-semibold">{day}</span>
                <span className="text-[10px] leading-tight">
                  {status === "sold_out" || isPast ? "✕" : formatShortPrice(price)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={handleClearDates}
          variant="outline"
          className="flex-1"
          disabled={!selectedCheckIn && !selectedCheckOut}
        >
          Clear Dates
        </Button>
        <Button
          onClick={handleConfirmSelection}
          className="flex-1 bg-[#283B73] hover:bg-[#1e2d5a] text-white"
          disabled={!selectedCheckIn || !selectedCheckOut}
        >
          Confirm Selection
        </Button>
      </div>
    </div>
  );
}