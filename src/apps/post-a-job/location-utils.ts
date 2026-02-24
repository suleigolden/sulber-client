export type ProviderJobServiceLocation = {
  street: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  latitude: number;
  longitude: number;
};

export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export type AvailabilitySlot = {
  day: string;
  startTime: string;
  endTime: string;
};

export function emptyLocation(): ProviderJobServiceLocation {
  return {
    street: "",
    city: "",
    state: "",
    country: "",
    postal_code: "",
    latitude: 0,
    longitude: 0,
  };
}

export function locationFromSearch(result: {
  lat: number;
  lng: number;
  address: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}): ProviderJobServiceLocation {
  return {
    street: result.address ?? "",
    city: result.city ?? "",
    state: result.state ?? "",
    country: result.country ?? "",
    postal_code: result.postalCode ?? "",
    latitude: result.lat,
    longitude: result.lng,
  };
}

export function formatLocationDisplay(loc: ProviderJobServiceLocation | string | null | undefined): string {
  if (loc == null) return "";
  if (typeof loc === "string") return loc;
  const parts = [loc.street, loc.city, loc.state, loc.postal_code, loc.country].filter(Boolean);
  return parts.join(", ") || "";
}

export function slotsToDaysOfWeekAvailable(slots: AvailabilitySlot[]): string[] {
  return slots
    .filter((s) => s.startTime && s.endTime)
    .map((s) => `${s.day} ${s.startTime}-${s.endTime}`);
}

export function daysOfWeekAvailableToSlots(days: string[] | undefined): AvailabilitySlot[] {
  const byDay = new Map<string, AvailabilitySlot>();
  DAYS_OF_WEEK.forEach((day) => {
    byDay.set(day, { day, startTime: "", endTime: "" });
  });
  (days ?? []).forEach((s) => {
    const match = s.match(/^(\w+)\s+(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})$/i);
    if (match) {
      const [, dayPart, start, end] = match;
      const dayKey = dayPart!.charAt(0).toUpperCase() + dayPart!.slice(1).toLowerCase();
      if (DAYS_OF_WEEK.includes(dayKey as (typeof DAYS_OF_WEEK)[number])) {
        byDay.set(dayKey, { day: dayKey, startTime: start!, endTime: end! });
      }
    }
  });
  return DAYS_OF_WEEK.map((d) => byDay.get(d) ?? { day: d, startTime: "", endTime: "" });
}
