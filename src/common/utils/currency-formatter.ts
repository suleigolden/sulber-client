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

export const formatNumberWithCommasAndDecimals = (number: string) => {
  const parts = number.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};
