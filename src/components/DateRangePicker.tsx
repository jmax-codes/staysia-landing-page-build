"use client";

import { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import { Calendar } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import "./date-range-picker.css";

interface DateRangePickerProps {
  startDate?: Date | null;
  endDate?: Date | null;
  onChange: (dates: [Date | null, Date | null]) => void;
}

export function DateRangePicker({ startDate, endDate, onChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const datePickerRef = useRef<DatePicker>(null);

  const formatDateRange = (start: Date | null, end: Date | null) => {
    if (!start && !end) return "17 Oct 2025 - 18 Oct 2025";
    if (start && !end) {
      return `${start.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} - Select end date`;
    }
    if (start && end) {
      const startStr = start.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
      const endStr = end.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
      return `${startStr} - ${endStr}`;
    }
    return "17 Oct 2025 - 18 Oct 2025";
  };

  return (
    <div className="relative w-full">
      <div 
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0" />
        <input
          type="text"
          value={formatDateRange(startDate, endDate)}
          readOnly
          placeholder="17 Oct 2025 - 18 Oct 2025"
          className="w-full text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none cursor-pointer"
        />
      </div>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 z-50 bg-white rounded-xl shadow-2xl border border-gray-200">
            <DatePicker
              ref={datePickerRef}
              selected={startDate}
              onChange={(dates) => {
                onChange(dates as [Date | null, Date | null]);
                // Close when both dates are selected
                if (dates && Array.isArray(dates) && dates[0] && dates[1]) {
                  setTimeout(() => setIsOpen(false), 200);
                }
              }}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              inline
              monthsShown={2}
              minDate={new Date()}
              calendarClassName="staysia-datepicker"
            />
          </div>
        </>
      )}
    </div>
  );
}
