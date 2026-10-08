import React, { createContext, useState, useContext } from 'react';

const CurrencyContext = createContext();

const EXCHANGE_RATES = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 150.25
};

const SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥'
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('USD');

  const formatPrice = (priceInUSD) => {
    const rate = EXCHANGE_RATES[currency] || 1;
    const symbol = SYMBOLS[currency] || '$';
    const converted = priceInUSD * rate;
    
    return `${symbol}${converted.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, availableCurrencies: Object.keys(EXCHANGE_RATES) }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
