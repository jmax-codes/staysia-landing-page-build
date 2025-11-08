"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface CurrencyContextType {
  selectedCurrency: string;
  exchangeRate: number;
  setSelectedCurrency: (currency: string) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [exchangeRate, setExchangeRate] = useState(1);

  useEffect(() => {
    async function fetchExchangeRate() {
      try {
        const response = await fetch(
          `https://api.exchangerate.host/convert?from=IDR&to=${selectedCurrency}`
        );
        const data = await response.json();
        
        if (data.success && data.result) {
          setExchangeRate(data.result);
        }
      } catch (error) {
        console.error("Failed to fetch exchange rate:", error);
        // Fallback rates
        const fallbackRates: Record<string, number> = {
          USD: 0.000063,
          EUR: 0.000058,
          GBP: 0.000050,
        };
        setExchangeRate(fallbackRates[selectedCurrency] || 1);
      }
    }

    fetchExchangeRate();
  }, [selectedCurrency]);

  return (
    <CurrencyContext.Provider value={{ selectedCurrency, exchangeRate, setSelectedCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
