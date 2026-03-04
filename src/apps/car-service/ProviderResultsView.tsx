import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogHeader,
  Avatar,
  Badge,
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  HStack,
  Spinner,
  Text,
  VStack,
  Wrap,
  WrapItem,
  useColorModeValue,
} from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  api,
  ProviderJobService,
  ProviderServiceType,
  ProviderServiceTypesList,
} from "@suleigolden/sulber-api-client";
import { LocationMap } from "~/components/location-map/LocationMap";
import { useCustomerVehicles } from "~/hooks/use-customer-vehicles";
import { useUser } from "~/hooks/use-user";
import { CustomToast } from "~/hooks/CustomToast";
import type { ConfirmServiceRequestData } from "./ConfirmServiceRequest";
import { SelectAdditionalCarDialog } from "./SelectAdditionalCarDialog";
import { ServiceDetailsDialogContent } from "./ServiceDetailsDialogContent";

const RADIUS_KM = 100;
function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const CAR_TYPES = [
  { id: "sedan", label: "Sedan", key: "sedan_price" as const },
  { id: "suv", label: "SUV", key: "suv_price" as const },
  { id: "truck", label: "Truck", key: "truck_price" as const },
  { id: "van", label: "Van", key: "van_price" as const },
] as const;

/** Map vehicle type (from CustomerVehicle.type) to provider price key (sedan/suv/truck/van). */
function vehicleTypeToCarType(vehicleType: string | null | undefined): "sedan" | "suv" | "truck" | "van" | null {
  if (!vehicleType) return null;
  const t = vehicleType.toUpperCase();
  if (t === "SEDAN" || t === "COUPE" || t === "HATCHBACK") return "sedan";
  if (t === "SUV" || t === "CROSSOVER") return "suv";
  if (t === "PICKUP_TRUCK" || t === "SPORTS_CAR") return "truck";
  if (t === "MINIVAN" || t === "VAN") return "van";
  return null;
}

const ADDON_LABELS: Record<string, string> = {
  interior_deep_cleaning: "Interior deep cleaning",
  wax_polish: "Wax polish",
  engine_bay_cleaning: "Engine bay cleaning",
  odor_removal: "Odor removal",
  multiple_vehicles_discount: "Multiple vehicles discount",
};

function isCarWashService(serviceType: string): boolean {
  return (serviceType ?? "").toLowerCase().includes("car");
}

function getAddOnOptions(service: ProviderJobService): { id: string; label: string; price: number }[] {
  const raw = service.add_on_prices;
  if (!Array.isArray(raw) || raw.length === 0) return [];
  const out: { id: string; label: string; price: number }[] = [];
  for (const entry of raw) {
    if (entry && typeof entry === "object") {
      for (const key of Object.keys(entry)) {
        const val = (entry as Record<string, { price?: number }>)[key]?.price;
        if (val != null) {
          out.push({ id: key, label: ADDON_LABELS[key] ?? key, price: Number(val) });
        }
      }
    }
  }
  return out;
}

function getBasePriceCents(service: ProviderJobService, carType: string | null): number {
  if (isCarWashService(service.service_type ?? "") && carType) {
    const ct = CAR_TYPES.find((c) => c.id === carType);
    if (ct) {
      const p = service[ct.key];
      if (p != null) return Number(p);
    }
  }
  return Number(service.price) || 0;
}

function getAddOnPriceCents(service: ProviderJobService, addOnId: string): number {
  const raw = service.add_on_prices;
  if (!Array.isArray(raw)) return 0;
  for (const entry of raw) {
    const val = (entry as Record<string, { price?: number }>)[addOnId]?.price;
    if (val != null) return Number(val);
  }
  return 0;
}

function formatPrices(service: ProviderJobService): string {
  const isCarWash = isCarWashService(service.service_type ?? "");
  if (isCarWash && (service.sedan_price || service.suv_price || service.truck_price || service.van_price)) {
    const parts: string[] = [];
    if (service.sedan_price) parts.push(`Sedan: $${(service.sedan_price / 100).toFixed(0)}`);
    if (service.suv_price) parts.push(`SUV: $${(service.suv_price / 100).toFixed(0)}`);
    if (service.truck_price) parts.push(`Truck: $${(service.truck_price / 100).toFixed(0)}`);
    if (service.van_price) parts.push(`Van: $${(service.van_price / 100).toFixed(0)}`);
    return parts.length > 0 ? parts.join(" · ") : `$${(service.price / 100).toFixed(0)}`;
  }
  return `$${(service.price / 100).toFixed(0)}`;
}

/** Format 24h time string (e.g. "10:33", "19:00") to 12h (e.g. "10:33 AM", "7:00 PM") */
function formatTime12h(timeStr: string): string {
  if (!timeStr?.trim()) return "";
  const [h, m] = timeStr.trim().split(":").map(Number);
  const hour = Number.isNaN(h) ? 0 : h % 24;
  const min = Number.isNaN(m) ? 0 : m % 60;
  const isPm = hour >= 12;
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const amPm = isPm ? " PM" : " AM";
  const mm = min === 0 ? "00" : String(min).padStart(2, "0");
  return `${hour12}:${mm}${amPm}`;
}

const DAY_ORDER = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const DEFAULT_START = "9:00";
const DEFAULT_END = "17:00";

function sortedDayLabels(days: string[]): string[] {
  if (!days?.length) return [];
  const sorted = [...days].sort(
    (a, b) => DAY_ORDER.indexOf(a.toLowerCase()) - DAY_ORDER.indexOf(b.toLowerCase())
  );
  return sorted.map((d) => d.charAt(0).toUpperCase() + d.slice(1).toLowerCase());
}

/** Availability slot with optional times (API may add these later). */
type AvailabilitySlot = { day: string; start_time?: string; end_time?: string };

function formatAvailabilityBadge(slot: AvailabilitySlot): string {
  const day = slot.day.charAt(0).toUpperCase() + slot.day.slice(1).toLowerCase();
  const start = formatTime12h(slot.start_time ?? DEFAULT_START);
  const end = formatTime12h(slot.end_time ?? DEFAULT_END);
  return `${day} ${start} - ${end}`;
}

function toAvailabilitySlots(days: string[]): AvailabilitySlot[] {
  if (!days?.length) return [];
  return sortedDayLabels(days).map((day) => ({
    day: day.toLowerCase(),
    start_time: DEFAULT_START,
    end_time: DEFAULT_END,
  }));
}

/** Provider object as returned by the API when listing provider-job-services with relation */
type ProviderFromList = {
  id?: string;
  profile?: {
    first_name?: string | null;
    last_name?: string | null;
    avatar_url?: string | null;
  } | null;
};

type ProviderJobServiceWithProvider = ProviderJobService & {
  provider?: ProviderFromList | null;
};

type ProviderCardItem = {
  service: ProviderJobService;
  distanceKm: number;
  providerName: string;
  avatarUrl: string | null;
};

function fromProvider(p: ProviderFromList | undefined | null): { name: string; avatarUrl: string | null } {
  if (!p?.profile) return { name: "Provider", avatarUrl: null };
  const { first_name, last_name, avatar_url } = p.profile;
  const name = [first_name, last_name].filter(Boolean).join(" ").trim() || "Provider";
  return { name, avatarUrl: avatar_url ?? null };
}

type ProviderResultsViewProps = {
  data: ConfirmServiceRequestData;
  onBack: () => void;
};

export const ProviderResultsView = ({ data, onBack }: ProviderResultsViewProps) => {
  const { user } = useUser();
  const showToast = CustomToast();
  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState<ProviderCardItem[]>([]);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedForDetails, setSelectedForDetails] = useState<{
    service: ProviderJobService;
    providerName: string;
  } | null>(null);
  const [expandedAvailabilityId, setExpandedAvailabilityId] = useState<string | null>(null);
  const [cardSelections, setCardSelections] = useState<
    Record<string, { carType: string | null; addOns: string[] }>
  >({});
  const [confirmSendOpen, setConfirmSendOpen] = useState(false);
  const [addCarDialogOpen, setAddCarDialogOpen] = useState(false);
  const [pendingSend, setPendingSend] = useState<{
    providerId: string;
    service: ProviderJobService;
    selection: { carType: string | null; addOns: string[] };
    requestLines: { vehicleId: string | null }[];
  } | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const { vehicles } = useCustomerVehicles();

  const getSelection = (serviceId: string) =>
    cardSelections[serviceId] ?? { carType: null, addOns: [] };
  const setSelection = (
    serviceId: string,
    patch: Partial<{ carType: string | null; addOns: string[] }>
  ) => {
    setCardSelections((prev) => ({
      ...prev,
      [serviceId]: { ...getSelection(serviceId), ...patch },
    }));
  };

  const serviceTypeDefinition = ProviderServiceTypesList.services.find(
    (s) => s.type === data.serviceType
  );
  const included = serviceTypeDefinition?.included ?? [];
  const requirements = serviceTypeDefinition?.requirements_for_customer ?? [];

  const cardBg = useColorModeValue("white", "#0b1437");
  const cardBorder = useColorModeValue("gray.200", "whiteAlpha.300");
  const labelColor = useColorModeValue("gray.600", "gray.300");
  const valueColor = useColorModeValue("gray.800", "white");
  const listBg = useColorModeValue("gray.50", "#0b1437");
  const mapBg = useColorModeValue("gray.100", "gray.800");
  const priceLabelColor = useColorModeValue("gray.500", "gray.400");
  const priceBoxBg = useColorModeValue("brand.50", "whiteAlpha.100");
  const priceBoxBorder = useColorModeValue("brand.200", "brand.500");
  const priceValueColor = useColorModeValue("brand.600", "brand.300");

  const fetchProviders = useCallback(async () => {
    if (!data.serviceLocationData || !data.serviceType || !user?.id) return;
    setLoading(true);
    try {
      // Fetch existing jobs for this customer to hide providers
      const existingJobs = await api.service("job").findByCustomerId(user.id);
      const blockedProviderIds = new Set(
        existingJobs
          .filter((job) =>
            job.provider_id &&
            (job.status === "PENDING" ||
              job.status === "ACCEPTED" ||
              job.status === "IN_PROGRESS")
          )
          .map((job) => job.provider_id as string)
      );

      const list = (await api.service("provider-job-service").list(
        undefined,
        "active"
      )) as ProviderJobServiceWithProvider[];
      const serviceType = data.serviceType as ProviderServiceType;
      const lat = data.serviceLocationData.lat;
      const lng = data.serviceLocationData.lng;

      const filtered: {
        service: ProviderJobServiceWithProvider;
        distanceKm: number;
      }[] = [];
      for (const s of list) {
        if (s.service_type !== serviceType) continue;
        // Hide providers that already have an active/pending job with this customer
        if (blockedProviderIds.has(s.provider?.id ?? "")) continue;
        const loc = s.primary_location;
        if (!loc?.latitude || !loc?.longitude) continue;
        const distanceKm = haversineKm(lat, lng, loc.latitude, loc.longitude);
        if (distanceKm <= RADIUS_KM) {
          filtered.push({ service: s, distanceKm });
        }
      }
      filtered.sort((a, b) => a.distanceKm - b.distanceKm);

      const uniqueByProvider = new Map<
        string,
        { service: ProviderJobServiceWithProvider; distanceKm: number }
      >();
      for (const item of filtered) {
        const pid = item.service.provider_id;
        if (!uniqueByProvider.has(pid)) {
          uniqueByProvider.set(pid, item);
        }
      }

      const cards: ProviderCardItem[] = Array.from(
        uniqueByProvider.values()
      ).map(({ service, distanceKm }) => {
        const { name: providerName, avatarUrl } = fromProvider(service.provider);
        return { service, distanceKm, providerName, avatarUrl };
      });
      setProviders(cards);
    } catch (e) {
      console.error(e);
      showToast("Error", "Failed to load providers", "error");
      setProviders([]);
    } finally {
      setLoading(false);
    }
  }, [data.serviceLocationData, data.serviceType, showToast, user?.id]);

  useEffect(() => {
    fetchProviders();
  }, []);

  const computeTotalAndAddOns = (
    service: ProviderJobService,
    carType: string | null,
    addOns: string[]
  ): { totalCents: number; addOnPrices: Record<string, { price: number }>[] } => {
    const base = getBasePriceCents(service, carType);
    const addOnPrices: Record<string, { price: number }>[] = [];
    let addOnTotal = 0;
    for (const id of addOns) {
      const p = getAddOnPriceCents(service, id);
      if (p > 0) {
        addOnPrices.push({ [id]: { price: p } });
        addOnTotal += p;
      }
    }
    return { totalCents: base + addOnTotal, addOnPrices };
  };

  const buildBaseNotes = (): string[] => {
    const parts: string[] = [];
    if (data.serviceRequestType === "monthly") {
      parts.push("Monthly subscription service (4 times per month)");
    }
    return parts;
  };

  const getVehicleLabel = (vehicleId: string): string => {
    const v = vehicles.find((x) => x.id === vehicleId);
    if (!v) return `Vehicle ${vehicleId}`;
    const parts: string[] = [];
    if (v.year) parts.push(String(v.year));
    if (v.make) parts.push(v.make);
    if (v.model) parts.push(v.model);
    if (v.color) parts.push(v.color);
    return parts.length > 0 ? parts.join(" ") : "Vehicle";
  };

  /** Derive car type (sedan/suv/truck/van) from selected vehicle for pricing. */
  const getDerivedCarType = (vehicleId: string | null): string | null => {
    if (!vehicleId) return null;
    const v = vehicles.find((x) => x.id === vehicleId);
    return vehicleTypeToCarType(v?.type ?? null);
  };

  const handleSendRequest = async (
    service: ProviderJobService,
    selection: { carType: string | null; addOns: string[] },
    requestLines?: { vehicleId: string | null }[]
  ) => {
    const providerId = service.provider.id;
    if (!user?.id || !data.serviceLocationData) return;
    const isCarWash = isCarWashService(service.service_type ?? "");
    const lines = requestLines ?? [{ vehicleId: data.selectedVehicleId ?? null }];
    if (isCarWash && lines.length > 0 && !lines[0].vehicleId) {
      showToast("Error", "Please select a vehicle for the car wash request", "error");
      return;
    }
    setSendingId(providerId);
    try {
      const address = {
        street: data.serviceLocationData.street || data.serviceLocationData.address || "",
        city: data.serviceLocationData.city || "",
        state: data.serviceLocationData.state || "",
        country: data.serviceLocationData.country || "",
        postal_code: data.serviceLocationData.postalCode || "",
      };
      let scheduledStart: string | undefined;
      let scheduledEnd: string | undefined;
      if (data.serviceDate && data.serviceTime) {
        const start = new Date(`${data.serviceDate}T${data.serviceTime}`);
        scheduledStart = start.toISOString();
        const end = new Date(start);
        end.setHours(end.getHours() + 2);
        scheduledEnd = end.toISOString();
      }
      const baseNotes = buildBaseNotes();

      if (lines.length > 1) {
        const jobs = lines.map((line) => {
          const carType = getDerivedCarType(line.vehicleId);
          const { totalCents, addOnPrices } = computeTotalAndAddOns(
            service,
            carType,
            selection.addOns
          );
          const noteParts = [...baseNotes];
          if (line.vehicleId) {
            noteParts.push(`Vehicle: ${getVehicleLabel(line.vehicleId)}`);
          }
          return {
            customerId: user.id,
            providerId,
            serviceType: data.serviceType as ProviderServiceType,
            address,
            scheduledStart: scheduledStart,
            scheduledEnd: scheduledEnd,
            totalPriceCents: String(totalCents),
            addOnPrices: addOnPrices.length > 0 ? addOnPrices : undefined,
            currency: "CAD",
            notes: noteParts.length > 0 ? noteParts.join(". ") : undefined,
          };
        });
        const created = await api.service("job").createMany(jobs as any);
        showToast("Success", `${created.length} requests sent to provider`, "success");
        window.location.href = `/customer/${user.id}/waiting-to-connect-with-provider?jobId=${created[0].id}`;
      } else {
        const carType = getDerivedCarType(lines[0].vehicleId);
        const { totalCents, addOnPrices } = computeTotalAndAddOns(
          service,
          carType,
          selection.addOns
        );
        const noteParts = [...baseNotes];
        if (lines[0].vehicleId) {
          noteParts.push(`Vehicle: ${getVehicleLabel(lines[0].vehicleId)}`);
        }
        const job = await api.service("job").create({
          customerId: user.id,
          providerId,
          serviceType: data.serviceType as ProviderServiceType,
          address,
          scheduledStart,
          scheduledEnd,
          totalPriceCents: String(totalCents),
          addOnPrices: addOnPrices.length > 0 ? addOnPrices : undefined,
          currency: "CAD",
          notes: noteParts.length > 0 ? noteParts.join(". ") : undefined,
        } as any);
        showToast("Success", "Request sent to provider", "success");
        window.location.href = `/customer/${user.id}/waiting-to-connect-with-provider?jobId=${job.id}`;
      }
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "message" in err ? String((err as { message: string }).message) : "Failed to send request";
      showToast("Error", msg, "error");
    } finally {
      setSendingId(null);
      setPendingSend(null);
      setConfirmSendOpen(false);
    }
  };

  const mapAddress = data.serviceLocationData
    ? {
      street: data.serviceLocationData.street || "",
      city: data.serviceLocationData.city || "",
      state: data.serviceLocationData.state || "",
      country: data.serviceLocationData.country || "",
      postal_code: data.serviceLocationData.postalCode || "",
    }
    : { street: "", city: "", state: "", country: "", postal_code: "" };

  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      h={{ base: "auto", md: "100vh" }}
      overflow="hidden"
      w="full"
    >
      <Box
        w={{ base: "100%", md: "400px", lg: "450px" }}
        bg={listBg}
        overflowY="auto"
        maxH={{ base: "50vh", md: "100vh" }}
        p={4}
      >
        <HStack mb={4} justify="space-between">
          <Heading size="md" color={valueColor}>
            Providers near you
          </Heading>
          <Button size="sm" variant="outline" onClick={onBack}>
            Back to search
          </Button>
        </HStack>
        {loading ? (
          <VStack py={8}>
            <Spinner />
            <Text color={labelColor}>Loading providers...</Text>
          </VStack>
        ) : providers.length === 0 ? (
          <Text color={labelColor}>No providers found for this service in your area.</Text>
        ) : (
          <VStack align="stretch" spacing={4}>
            {providers.map(({ service, distanceKm, providerName, avatarUrl }) => (
              <Box
                key={service.id}
                p={4}
                bg={cardBg}
                borderRadius="xl"
                borderWidth="1px"
                borderColor={cardBorder}
                shadow="sm"
              >
                <HStack align="center" spacing={3} mb={3}>
                  <Avatar
                    size="lg"
                    name={providerName}
                    src={avatarUrl ?? undefined}
                    bg="brand.100"
                    color="brand.600"
                  />
                  <VStack align="start" spacing={0} flex={1} minW={0}>
                    <Text fontWeight="semibold" color={valueColor} fontSize="md" noOfLines={1}>
                      {providerName}
                    </Text>
                    <Text fontSize="md" color={labelColor}>
                      {distanceKm < 1 ? `${(distanceKm * 1000).toFixed(0)} m away` : `${distanceKm.toFixed(1)} km away`}
                      {" · "}
                      Rating: ***
                      {" · "}
                      Completed: **
                    </Text>
                  </VStack>
                </HStack>

                {(() => {
                  const selection = getSelection(service.id);
                  const addOnOptions = getAddOnOptions(service);
                  const isCarWash = isCarWashService(service.service_type ?? "");
                  const derivedCarType = isCarWash ? getDerivedCarType(data.selectedVehicleId ?? null) : null;
                  const { totalCents } = computeTotalAndAddOns(
                    service,
                    derivedCarType,
                    selection.addOns
                  );
                  const baseCents = getBasePriceCents(service, derivedCarType);
                  const showAddOns = addOnOptions.length > 0;
                  return (
                    <>
                      {isCarWash && data.selectedVehicleId && (
                        <Box mb={3}>
                          <Text fontSize="sm" color={priceLabelColor} fontWeight="medium" mb={2}>
                            Selected car:{" "}
                            <Text as="span" color={valueColor} fontWeight="semibold">
                              {getVehicleLabel(data.selectedVehicleId)}
                            </Text>
                            {derivedCarType && (
                              <Text as="span" fontSize="xs" color={labelColor} ml={2}>
                                ({CAR_TYPES.find((c) => c.id === derivedCarType)?.label ?? derivedCarType})
                              </Text>
                            )}
                          </Text>
                        </Box>
                      )}

                      {showAddOns && (
                        <Box mb={3}>
                          <Text fontSize="sm" color={priceLabelColor} fontWeight="medium" mb={2}>
                            Add-ons
                          </Text>
                          <VStack align="stretch" spacing={2}>
                            {addOnOptions.map((addon) => (
                              <Checkbox
                                key={addon.id}
                                size="sm"
                                colorScheme="brand"
                                isChecked={selection.addOns.includes(addon.id)}
                                onChange={() => {
                                  const next = selection.addOns.includes(addon.id)
                                    ? selection.addOns.filter((x) => x !== addon.id)
                                    : [...selection.addOns, addon.id];
                                  setSelection(service.id, { addOns: next });
                                }}
                              >
                                <Text fontSize="sm" color={valueColor}>
                                  {addon.label} — ${(addon.price / 100).toFixed(2)}
                                </Text>
                              </Checkbox>
                            ))}
                          </VStack>
                        </Box>
                      )}

                      {!isCarWash && (
                        <Box
                          p={3}
                          borderRadius="lg"
                          bg={priceBoxBg}
                          borderWidth="1px"
                          borderColor={priceBoxBorder}
                          mb={3}
                        >
                          <Text fontSize="sm" color={priceLabelColor} fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" mb={1}>
                            Price
                          </Text>
                          <Text fontSize="md" fontWeight="bold" color={priceValueColor}>
                            {formatPrices(service)}
                          </Text>
                        </Box>
                      )}

                      <Box
                        p={3}
                        borderRadius="lg"
                        bg={priceBoxBg}
                        borderWidth="1px"
                        borderColor={priceBoxBorder}
                        mb={3}
                      >
                        <Text fontSize="sm" color={priceLabelColor} fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" mb={1}>
                          Total price
                        </Text>
                        <Text fontSize="lg" fontWeight="bold" color={priceValueColor}>
                          ${(totalCents / 100).toFixed(2)}
                        </Text>
                        {isCarWash && derivedCarType && (
                          <Text fontSize="sm" color={labelColor} mt={1}>
                            Base: ${(baseCents / 100).toFixed(2)}
                            {selection.addOns.length > 0 &&
                              ` · Add-ons: $${((totalCents - baseCents) / 100).toFixed(2)}`}
                          </Text>
                        )}
                      </Box>
                    </>
                  );
                })()}

                <Button
                  as="button"
                  type="button"
                  fontSize="md"
                  variant="outline"
                  fontWeight="medium"
                  _hover={{ color: "brand.600" }}
                  mb={2}
                  onClick={() => {
                    setSelectedForDetails({ service, providerName });
                    setDetailsDialogOpen(true);
                  }}
                >
                  See What's Included ?
                </Button>

                <Button
                  ml={4}
                  mt={expandedAvailabilityId === service.id ? 0 : -2}
                  as="button"
                  type="button"
                  fontSize="md"
                  variant="outline"
                  fontWeight="medium"
                  mb={expandedAvailabilityId === service.id ? 2 : 0}
                  onClick={() =>
                    setExpandedAvailabilityId((id) => (id === service.id ? null : service.id))
                  }
                >
                  {expandedAvailabilityId === service.id ? "Hide availability" : "See Availability"}
                </Button>
                {expandedAvailabilityId === service.id && (
                  <Wrap spacing={2} mb={2}>
                    {toAvailabilitySlots(service.days_of_week_available ?? []).length > 0 ? (
                      toAvailabilitySlots(service.days_of_week_available ?? []).map((slot) => (
                        <WrapItem key={slot.day}>
                          <Badge
                            colorScheme="brand"
                            variant="subtle"
                            px={2}
                            py={1}
                            borderRadius="md"
                            fontSize="sm" 
                            fontWeight="medium"
                            whiteSpace="normal"
                          >
                            {formatAvailabilityBadge(slot)}
                          </Badge>
                        </WrapItem>
                      ))
                    ) : (
                      <Badge colorScheme="gray" variant="subtle" px={2} py={1} borderRadius="md" fontSize="sm" >
                        Not set
                      </Badge>
                    )}
                  </Wrap>
                )}

                <Button
                  size="sm"
                  colorScheme="brand"
                  mt={4}
                  w="full"
                  onClick={() => {
                    const selection = getSelection(service.id);
                    const isCarWash = isCarWashService(service.service_type ?? "");
                    if (isCarWash) {
                      setPendingSend({
                        providerId: service.provider_id,
                        service,
                        selection,
                        requestLines: [{ vehicleId: data.selectedVehicleId ?? null }],
                      });
                      setConfirmSendOpen(true);
                    } else {
                      handleSendRequest(service, selection, [{ vehicleId: data.selectedVehicleId ?? null }]);
                    }
                  }}
                  isLoading={sendingId === service.provider_id}
                  loadingText="Sending..."
                >
                  Send request
                </Button>
              </Box>
            ))}
          </VStack>
        )}
      </Box>

      <AlertDialog
        isOpen={detailsDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => {
          setDetailsDialogOpen(false);
          setSelectedForDetails(null);
        }}
      >
        <ServiceDetailsDialogContent
          included={included}
          requirements={requirements}
          onCancel={() => {
            setDetailsDialogOpen(false);
            setSelectedForDetails(null);
          }}
          onSendRequest={() => {
            if (selectedForDetails) {
              const sel = getSelection(selectedForDetails.service.id);
              const isCarWash = isCarWashService(selectedForDetails.service.service_type ?? "");
              if (isCarWash) {
                setPendingSend({
                  providerId: selectedForDetails.service.provider_id,
                  service: selectedForDetails.service,
                  selection: sel,
                  requestLines: [{ vehicleId: data.selectedVehicleId ?? null }],
                });
                setConfirmSendOpen(true);
                setDetailsDialogOpen(false);
                setSelectedForDetails(null);
              } else {
                handleSendRequest(
                  selectedForDetails.service,
                  sel
                );
                setDetailsDialogOpen(false);
                setSelectedForDetails(null);
              }
            }
          }}
          isSending={selectedForDetails ? sendingId === selectedForDetails.service.provider_id : false}
          cancelRef={cancelRef}
          providerName={selectedForDetails?.providerName ?? ""}
        />
      </AlertDialog>

      <AlertDialog
        isOpen={confirmSendOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => {
          setConfirmSendOpen(false);
          setPendingSend(null);
        }}
      >
        <AlertDialogContent bg={cardBg}>
          <AlertDialogHeader fontSize="lg" fontWeight="bold" color={valueColor}>
            Send car wash request(s)
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text fontSize="sm" color={labelColor} mb={4}>
              You're about to send {pendingSend?.requestLines.length ?? 0} car wash request(s).
              Add another car to request multiple washes at once.
            </Text>
            <HStack spacing={3}>
              <Button
                variant="outline"
                onClick={() => {
                  setAddCarDialogOpen(true);
                }}
              >
                Add another car
              </Button>
              <Button
                colorScheme="brand"
                onClick={() => {
                  if (pendingSend) {
                    handleSendRequest(
                      pendingSend.service,
                      pendingSend.selection,
                      pendingSend.requestLines ?? [{ vehicleId: data.selectedVehicleId ?? null }]
                    );
                  }
                }}
                isLoading={pendingSend ? sendingId === pendingSend.providerId : false}
                loadingText="Sending..."
              >
                Send {pendingSend?.requestLines.length ?? 0} request(s)
              </Button>
              <Button ref={cancelRef} onClick={() => { setConfirmSendOpen(false); setPendingSend(null); }}>
                Cancel
              </Button>
            </HStack>
          </AlertDialogBody>
        </AlertDialogContent>
      </AlertDialog>

      <SelectAdditionalCarDialog
        isOpen={addCarDialogOpen}
        onClose={() => setAddCarDialogOpen(false)}
        vehicles={vehicles}
        excludeVehicleIds={pendingSend?.requestLines
          .map((l) => l.vehicleId)
          .filter((id): id is string => id != null) ?? []}
        onSelect={(vehicleId) => {
          if (pendingSend) {
            setPendingSend({
              ...pendingSend,
              requestLines: [...pendingSend.requestLines, { vehicleId }],
            });
          }
          setAddCarDialogOpen(false);
        }}
        isLoading={false}
      />

      <Box
        flex={1}
        minH={{ base: "300px", md: "100%" }}
        bg={mapBg}
        borderLeftWidth={{ base: 0, md: 2 }}
        borderColor={cardBorder}
      >
        {mapAddress && (
          <LocationMap address={mapAddress} />
        )}
      </Box>
    </Flex>
  );
};
