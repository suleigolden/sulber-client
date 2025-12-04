import { Address, Job } from '@suleigolden/sulber-api-client';

export const fullAddress = (address: Address): string => {
  if (typeof address === 'string') {
    return address;
  }

  const { street, city, state, postal_code, country } = address;
  return [street, city, state, postal_code, country]
    .filter((part) => part)
    .join(', ');
};

export const formatAddress = (address: Address) => {
  const parts = [];
  if (address.street) parts.push(address.street);
  if (address.city) parts.push(address.city);
  if (address.state) parts.push(address.state);
  if (address.postal_code) parts.push(address.postal_code);
  if (address.country) parts.push(address.country);
  return parts.length > 0 ? parts.join(", ") : "Address not available";
};