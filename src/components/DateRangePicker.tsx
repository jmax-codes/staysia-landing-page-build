"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
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
      <PopoverContent className="w-auto p-0 bg-white" align="start" sideOffset={8}>
        <div className="p-6">
          <Calendar
            mode="range"
            defaultMonth={date?.from || new Date()}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            classNames={{
              months: "flex flex-row gap-8",
              month: "space-y-4",
              month_caption: "flex justify-center pt-1 relative items-center mb-4",
              caption_label: "text-xl font-semibold text-gray-900",
              nav: "flex items-center gap-1",
              button_previous: cn(
                "absolute left-0 h-8 w-8 bg-transparent p-0 hover:bg-gray-100 rounded-md transition-colors"
              ),
              button_next: cn(
                "absolute right-0 h-8 w-8 bg-transparent p-0 hover:bg-gray-100 rounded-md transition-colors"
              ),
              table: "w-full border-collapse",
              weekdays: "flex",
              weekday: "text-gray-500 w-12 font-medium text-sm uppercase tracking-wide text-center py-2",
              week: "flex w-full",
              day: cn(
                "relative h-12 w-12 text-center text-base p-0 font-normal",
                "[&:has([data-range-middle])]:bg-gray-200",
                "first:[&:has([data-range-middle])]:rounded-l-none",
                "last:[&:has([data-range-middle])]:rounded-r-none"
              ),
              day_button: cn(
                "relative h-12 w-12 p-0 font-normal text-base transition-colors",
                "hover:bg-gray-100 rounded-full",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#283B73] focus-visible:ring-offset-2",
                "data-[selected-single=true]:bg-[#283B73] data-[selected-single=true]:text-white data-[selected-single=true]:hover:bg-[#283B73] data-[selected-single=true]:hover:text-white data-[selected-single=true]:rounded-full",
                "data-[range-start=true]:bg-[#283B73] data-[range-start=true]:text-white data-[range-start=true]:hover:bg-[#283B73] data-[range-start=true]:hover:text-white data-[range-start=true]:rounded-full data-[range-start=true]:z-10",
                "data-[range-end=true]:bg-[#283B73] data-[range-end=true]:text-white data-[range-end=true]:hover:bg-[#283B73] data-[range-end=true]:hover:text-white data-[range-end=true]:rounded-full data-[range-end=true]:z-10",
                "data-[range-middle=true]:bg-transparent data-[range-middle=true]:text-gray-900 data-[range-middle=true]:hover:bg-transparent data-[range-middle=true]:rounded-none"
              ),
              range_start: "bg-[#283B73] text-white rounded-full",
              range_end: "bg-[#283B73] text-white rounded-full",
              range_middle: "bg-gray-200 text-gray-900",
              today: "font-semibold text-gray-900",
              outside: "text-gray-300 opacity-50 hover:bg-transparent",
              disabled: "text-gray-300 opacity-30 cursor-not-allowed hover:bg-transparent",
              hidden: "invisible",
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}