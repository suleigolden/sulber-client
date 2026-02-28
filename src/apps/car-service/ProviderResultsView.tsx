import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Spinner,
  Text,
  VStack,
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

function formatDays(days: string[]): string {
  if (!days?.length) return "—";
  const order = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const sorted = [...days].sort(
    (a, b) => order.indexOf(a.toLowerCase()) - order.indexOf(b.toLowerCase())
  );
  return sorted.map((d) => d.charAt(0).toUpperCase() + d.slice(1).toLowerCase()).join(", ");
}

type ProviderWithProfile = {
  service: ProviderJobService;
  distanceKm: number;
  providerName: string;
};

type ProviderResultsViewProps = {
  data: ConfirmServiceRequestData;
  onBack: () => void;
};

export const ProviderResultsView = ({ data, onBack }: ProviderResultsViewProps) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const showToast = CustomToast();
  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState<ProviderWithProfile[]>([]);
  const [sendingId, setSendingId] = useState<string | null>(null);

  const cardBg = useColorModeValue("white", "#0b1437");
  const cardBorder = useColorModeValue("gray.200", "whiteAlpha.300");
  const labelColor = useColorModeValue("gray.600", "gray.300");
  const valueColor = useColorModeValue("gray.800", "white");
  const listBg = useColorModeValue("gray.50", "#0b1437");
  const mapBg = useColorModeValue("gray.100", "gray.800");

  const fetchProviders = useCallback(async () => {
    if (!data.serviceLocationData || !data.serviceType) return;
    setLoading(true);
    try {
      const list = await api.service("provider-job-service").list(undefined, "active");
      const serviceType = data.serviceType as ProviderServiceType;
      const lat = data.serviceLocationData.lat;
      const lng = data.serviceLocationData.lng;

      const filtered: { service: ProviderJobService; distanceKm: number }[] = [];
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

      const uniqueByProvider = new Map<string, { service: ProviderJobService; distanceKm: number }>();
      for (const item of filtered) {
        const pid = item.service.provider_id;
        if (!uniqueByProvider.has(pid)) {
          uniqueByProvider.set(pid, item);
        }
      }

      const withNames: ProviderWithProfile[] = [];
      for (const [, item] of uniqueByProvider) {
        let name = "Provider";
        try {
          const profile = await api.service("user-profile").findByUserId(item.service.provider_id);
          if (profile?.first_name || profile?.last_name) {
            name = [profile.first_name, profile.last_name].filter(Boolean).join(" ");
          }
        } catch {
          // keep "Provider"
        }
        withNames.push({ ...item, providerName: name });
      }
      setProviders(withNames);
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
            {providers.map(({ service, distanceKm, providerName }) => (
              <Box
                key={service.id}
                p={4}
                bg={cardBg}
                borderRadius="lg"
                borderWidth="1px"
                borderColor={cardBorder}
              >
                <Text fontWeight="semibold" color={valueColor} fontSize="md">
                  {providerName}
                </Text>
                <HStack mt={2} spacing={4} flexWrap="wrap">
                  <Text fontSize="sm" color={labelColor}>
                    Rating: —
                  </Text>
                  <Text fontSize="sm" color={labelColor}>
                    {distanceKm < 1 ? `${(distanceKm * 1000).toFixed(0)} m away` : `${distanceKm.toFixed(1)} km away`}
                  </Text>
                </HStack>
                <Text fontSize="sm" color={valueColor} mt={2}>
                  {formatPrices(service)}
                </Text>
                <Text fontSize="sm" color={labelColor} mt={1}>
                  Available: {formatDays(service.days_of_week_available ?? [])}
                </Text>
                <Button
                  size="sm"
                  colorScheme="brand"
                  mt={3}
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
