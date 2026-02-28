import {
  Avatar,
  Badge,
  Box,
  Button,
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
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  api,
  ProviderJobService,
  ProviderServiceType,
} from "@suleigolden/sulber-api-client";
import { LocationMap } from "~/components/location-map/LocationMap";
import { useUser } from "~/hooks/use-user";
import { CustomToast } from "~/hooks/CustomToast";
import type { ConfirmServiceRequestData } from "./ConfirmServiceRequest";

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

function formatPrices(service: ProviderJobService): string {
  const isCarWash =
    service.service_type?.toLowerCase().includes("car") ?? false;
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
  const navigate = useNavigate();
  const showToast = CustomToast();
  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState<ProviderCardItem[]>([]);
  const [sendingId, setSendingId] = useState<string | null>(null);

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
    if (!data.serviceLocationData || !data.serviceType) return;
    setLoading(true);
    try {
      const list = (await api.service("provider-job-service").list(undefined, "active")) as ProviderJobServiceWithProvider[];
      const serviceType = data.serviceType as ProviderServiceType;
      const lat = data.serviceLocationData.lat;
      const lng = data.serviceLocationData.lng;

      const filtered: { service: ProviderJobServiceWithProvider; distanceKm: number }[] = [];
      for (const s of list) {
        if (s.service_type !== serviceType) continue;
        const loc = s.primary_location;
        if (!loc?.latitude || !loc?.longitude) continue;
        const distanceKm = haversineKm(lat, lng, loc.latitude, loc.longitude);
        if (distanceKm <= RADIUS_KM) {
          filtered.push({ service: s, distanceKm });
        }
      }
      filtered.sort((a, b) => a.distanceKm - b.distanceKm);

      const uniqueByProvider = new Map<string, { service: ProviderJobServiceWithProvider; distanceKm: number }>();
      for (const item of filtered) {
        const pid = item.service.provider_id;
        if (!uniqueByProvider.has(pid)) {
          uniqueByProvider.set(pid, item);
        }
      }

      const cards: ProviderCardItem[] = Array.from(uniqueByProvider.values()).map(({ service, distanceKm }) => {
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
  }, [data.serviceLocationData, data.serviceType, showToast]);

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleSendRequest = async (providerId: string, service: ProviderJobService) => {
    if (!user?.id || !data.serviceLocationData) return;
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
      const notesParts: string[] = [];
      if (data.serviceRequestType === "monthly") {
        notesParts.push("Monthly subscription service (4 times per month)");
      }
      const priceCents = String(service.price ?? 0);

      const job = await api.service("job").create({
        customer_id: user.id,
        provider_id: providerId,
        service_type: data.serviceType as ProviderServiceType,
        address,
        scheduled_start: scheduledStart,
        scheduled_end: scheduledEnd,
        total_price_cents: priceCents,
        currency: "CAD",
        notes: notesParts.length > 0 ? notesParts.join(". ") : undefined,
      });
      showToast("Success", "Request sent to provider", "success");
      navigate(`/${user.id}/waiting-to-connect-with-provider?jobId=${job.id}`);
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "message" in err ? String((err as { message: string }).message) : "Failed to send request";
      showToast("Error", msg, "error");
    } finally {
      setSendingId(null);
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
                    <Text fontSize="sm"  color={labelColor}>
                      {distanceKm < 1 ? `${(distanceKm * 1000).toFixed(0)} m away` : `${distanceKm.toFixed(1)} km away`}
                      {" · "}
                      Rating: —
                    </Text>
                  </VStack>
                </HStack>

                <Box
                  p={3}
                  borderRadius="lg"
                  bg={priceBoxBg}
                  borderWidth="1px"
                  borderColor={priceBoxBorder}
                  mb={3}
                >
                  <Text fontSize="md" color={priceLabelColor} fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" mb={1}>
                    Price
                  </Text>
                  <Text fontSize="md" fontWeight="bold" color={priceValueColor}>
                    {formatPrices(service)}
                  </Text>
                </Box>

                <Text fontSize="md" color={priceLabelColor} fontWeight="medium" mb={2}>
                  Availability
                </Text>
                <Wrap spacing={2}>
                  {toAvailabilitySlots(service.days_of_week_available ?? []).length > 0 ? (
                    toAvailabilitySlots(service.days_of_week_available ?? []).map((slot) => (
                      <WrapItem key={slot.day}>
                        <Badge
                          colorScheme="brand"
                          variant="subtle"
                          px={2}
                          py={1}
                          borderRadius="md"
                          fontSize="xs"
                          fontWeight="medium"
                          whiteSpace="normal"
                        >
                          {formatAvailabilityBadge(slot)}
                        </Badge>
                      </WrapItem>
                    ))
                  ) : (
                    <Badge colorScheme="gray" variant="subtle" px={2} py={1} borderRadius="md" fontSize="xs">
                      Not set
                    </Badge>
                  )}
                </Wrap>

                <Button
                  size="sm"
                  colorScheme="brand"
                  mt={4}
                  w="full"
                  onClick={() => handleSendRequest(service.provider_id, service)}
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
      <Box
        flex={1}
        minH={{ base: "300px", md: "100%" }}
        bg={mapBg}
        borderLeftWidth={{ base: 0, md: 2 }}
        borderColor={cardBorder}
      >
        <LocationMap address={mapAddress} />
      </Box>
    </Flex>
  );
};
