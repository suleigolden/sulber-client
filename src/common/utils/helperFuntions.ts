import { canadaProvinces, usaStates } from "./countryAndStates";

export const getStateOptions = (country: string) => {
    switch (country) {
      case "Canada":
        return canadaProvinces;
      case "US":
        return usaStates;
      case "United States":
        return usaStates;
      default:
        return [];
    }
  };

  export const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };