"use client";

import React, { createContext, useContext, useEffect } from "react";
import { useGlobalStore } from "@/store/useGlobalStore";

interface CurrencyContextType {
  selectedCurrency: string;
  exchangeRate: number;
  setSelectedCurrency: (currency: string) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const { currency, setCurrency } = useGlobalStore();

  useEffect(() => {
    async function fetchExchangeRate() {
      // Use the rate from the currency object in global store
      // The currencies data already has exchange rates
    }
    fetchExchangeRate();
  }, [currency.code]);

  const setSelectedCurrency = (currencyCode: string) => {
    // Find the currency in the currencies data and update global store
    const currencies = require("@/data/currencies").currencies;
    const newCurrency = currencies.find((c: any) => c.code === currencyCode);
    if (newCurrency) {
      setCurrency(newCurrency);
    }
  };

  return (
    <CurrencyContext.Provider value={{ 
      selectedCurrency: currency.code, 
      exchangeRate: currency.rate, 
      setSelectedCurrency 
    }}>
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