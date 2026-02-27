export const currencyFormatter = (number: number) => {
  const value = number.toString().replace(/,/g, '');
  if (!Number.isFinite(Number(value))) {
    return 'N/A';
  }
  return new Intl.NumberFormat("en-CA", {
    currency: "CAD",
    style: "currency",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(value));
};

export const currencyIntFormatter = (value: number) => {
  if (!Number.isFinite(value)) {
    value = Number(value);
  }
  return new Intl.NumberFormat("en-CA", {
    currency: "CAD",
    style: "currency",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const currencyIntFormatterNoSymbol = (value: number) => {
  if (!Number.isFinite(value)) {
    value = Number(value);
  }
  return new Intl.NumberFormat("en-CA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatNumberWithCommas = (number: number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/**
 * Formats a value (cents) as dollars with thousands separators and exactly 2 decimal places.
 * e.g. 123456 -> "1,234.56", 1000 -> "10.00"
 */
export const formatNumberWithCommasAndDecimals = (number: number): string => {
  const dollars = number / 100;
  const fixed = Number.isFinite(dollars) ? dollars.toFixed(2) : "0.00";
  const [intPart, decPart = "00"] = fixed.split(".");
  const intWithCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${intWithCommas}.${decPart}`;
};
