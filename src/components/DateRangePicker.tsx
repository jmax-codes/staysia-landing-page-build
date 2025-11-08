"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon, ChevronDown, X } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";

interface DateRangePickerProps {
  className?: string;
}

export function DateRangePicker({ className }: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeView, setActiveView] = React.useState<"dates" | "months" | "flexible">("dates");

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-2 w-full text-left focus:outline-none",
            className
          )}
        >
          <CalendarIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <span className="text-sm text-gray-800">
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd MMM yyyy")} - {format(date.to, "dd MMM yyyy")}
                </>
              ) : (
                format(date.from, "dd MMM yyyy")
              )
            ) : (
              <span className="text-gray-400">17 Oct 2025 - 18 Oct 2025</span>
            )}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-0 bg-white shadow-2xl rounded-3xl border-0" 
        align="start" 
        sideOffset={12}
        alignOffset={-50}
      >
        <div className="p-8">
          {/* View Tabs */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <button
              onClick={() => setActiveView("dates")}
              className={cn(
                "px-6 py-2.5 rounded-full text-sm font-medium transition-all",
                activeView === "dates"
                  ? "bg-gray-900 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              Dates
            </button>
            <button
              onClick={() => setActiveView("months")}
              className={cn(
                "px-6 py-2.5 rounded-full text-sm font-medium transition-all",
                activeView === "months"
                  ? "bg-gray-900 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              Months
            </button>
            <button
              onClick={() => setActiveView("flexible")}
              className={cn(
                "px-6 py-2.5 rounded-full text-sm font-medium transition-all",
                activeView === "flexible"
                  ? "bg-gray-900 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              Flexible
            </button>
          </div>

          {/* Calendar */}
          {activeView === "dates" && (
            <>
              <Calendar
                mode="range"
                defaultMonth={date?.from || new Date()}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
                classNames={{
                  months: "flex flex-row gap-12",
                  month: "space-y-6",
                  month_caption: "flex justify-center pt-1 relative items-center mb-6",
                  caption_label: "text-2xl font-semibold text-gray-900",
                  nav: "flex items-center gap-1",
                  button_previous: cn(
                    "absolute -left-2 h-10 w-10 bg-transparent p-0 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center"
                  ),
                  button_next: cn(
                    "absolute -right-2 h-10 w-10 bg-transparent p-0 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center"
                  ),
                  table: "w-full border-collapse",
                  weekdays: "flex",
                  weekday: "text-gray-500 w-14 font-medium text-sm uppercase tracking-wide text-center py-3",
                  week: "flex w-full mt-1",
                  day: cn(
                    "relative h-14 w-14 text-center text-base p-0 font-normal",
                    "[&:has([data-range-middle])]:bg-gray-200",
                    "first:[&:has([data-range-middle])]:rounded-l-none",
                    "last:[&:has([data-range-middle])]:rounded-r-none"
                  ),
                  day_button: cn(
                    "relative h-14 w-14 p-0 font-normal text-base transition-all",
                    "hover:bg-gray-100 rounded-full",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#283B73] focus-visible:ring-offset-2",
                    "data-[selected-single=true]:bg-[#283B73] data-[selected-single=true]:text-white data-[selected-single=true]:hover:bg-[#283B73] data-[selected-single=true]:hover:text-white data-[selected-single=true]:rounded-full data-[selected-single=true]:scale-100 data-[selected-single=true]:font-semibold",
                    "data-[range-start=true]:bg-[#283B73] data-[range-start=true]:text-white data-[range-start=true]:hover:bg-[#283B73] data-[range-start=true]:hover:text-white data-[range-start=true]:rounded-full data-[range-start=true]:z-10 data-[range-start=true]:scale-100 data-[range-start=true]:font-semibold",
                    "data-[range-end=true]:bg-[#283B73] data-[range-end=true]:text-white data-[range-end=true]:hover:bg-[#283B73] data-[range-end=true]:hover:text-white data-[range-end=true]:rounded-full data-[range-end=true]:z-10 data-[range-end=true]:scale-100 data-[range-end=true]:font-semibold",
                    "data-[range-middle=true]:bg-transparent data-[range-middle=true]:text-gray-900 data-[range-middle=true]:hover:bg-gray-100 data-[range-middle=true]:rounded-none"
                  ),
                  range_start: "bg-[#283B73] text-white rounded-full",
                  range_end: "bg-[#283B73] text-white rounded-full",
                  range_middle: "bg-gray-200 text-gray-900",
                  today: "font-semibold",
                  outside: "text-gray-300 opacity-50 hover:bg-transparent",
                  disabled: "text-gray-300 opacity-30 cursor-not-allowed hover:bg-transparent",
                  hidden: "invisible",
                }}
              />

              {/* Bottom Dropdowns */}
              <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-gray-200">
                <div>
                  <label className="text-sm font-semibold text-gray-900 mb-2 block">
                    Check in
                  </label>
                  <button className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                    <span className="text-sm text-gray-700">Exact day</span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-900 mb-2 block">
                    Check out
                  </label>
                  <button className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                    <span className="text-sm text-gray-700">Exact day</span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
            </>
          )}

          {activeView === "months" && (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <p className="text-sm">Month selection view coming soon</p>
            </div>
          )}

          {activeView === "flexible" && (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <p className="text-sm">Flexible dates view coming soon</p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}