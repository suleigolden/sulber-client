import {
  Box,
  Spinner,
  Text,
  useColorMode,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { Address } from "@suleigolden/sulber-api-client";
import { fullAddress } from "~/common/utils/address";
import { loadGoogleMapsScript } from "~/common/utils/loadGoogleMapsScript";

// Dark map style (Maps JavaScript API) – same as JobsMap
const DARK_MAP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
  { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
];

const DEFAULT_CENTER = { lat: 43.6532, lng: -79.3832 };

type LocationMapProps = {
  address: Address;
};

/**
 * Renders a Google Map for the given address using the Maps JavaScript API
 * (no Embed API required). Uses the same API key as the rest of the app.
 */
export const LocationMap = ({ address }: LocationMapProps) => {
  const { colorMode } = useColorMode();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const loadingBg = useColorModeValue("gray.100", "gray.800");
  const loadingTextColor = useColorModeValue("gray.600", "gray.400");
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    const addressStr = fullAddress(address);
    if (!addressStr?.trim()) {
      setIsLoading(false);
      setMapError("No address provided");
      return;
    }

    if (!mapRef.current) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    loadGoogleMapsScript()
      .then(() => {
        const checkGoogleMaps = () => {
          if (window.google?.maps && isMounted) {
            initMap(addressStr);
          } else if (isMounted) {
            setTimeout(checkGoogleMaps, 100);
          }
        };
        checkGoogleMaps();
      })
      .catch(() => {
        if (isMounted) {
          setMapError("Failed to load map");
          setIsLoading(false);
        }
      });

    function initMap(addr: string) {
      if (!mapRef.current || !window.google?.maps || !isMounted) return;

      try {
        const map = new window.google.maps.Map(mapRef.current, {
          zoom: 14,
          center: DEFAULT_CENTER,
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: true,
          styles: colorMode === "dark" ? DARK_MAP_STYLES : [],
        });
        mapInstanceRef.current = map;

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address: addr }, (results, status) => {
          if (!isMounted) return;

          if (status === "OK" && results?.[0]) {
            const location = results[0].geometry.location;
            map.setCenter(location);

            const marker = new window.google.maps.Marker({
              position: location,
              map,
              title: addr,
            });
            markerRef.current = marker;
          }
          if (isMounted) {
            setIsLoading(false);
          }
        });

        if (window.google.maps.event && mapRef.current) {
          requestAnimationFrame(() => {
            window.google.maps.event.trigger(map, "resize");
          });
        }
      } catch (err) {
        if (isMounted) {
          setMapError("Failed to initialize map");
          setIsLoading(false);
        }
      }
    }

    return () => {
      isMounted = false;
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
      mapInstanceRef.current = null;
    };
  }, [address]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.setOptions({
      styles: colorMode === "dark" ? DARK_MAP_STYLES : [],
    });
  }, [colorMode]);

  if (mapError) {
    return (
      <Box
        w="full"
        h="full"
        minH="300px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg={loadingBg}
      >
        <Text color="red.500" fontSize="sm">
          {mapError}
        </Text>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box
        w="full"
        h="full"
        minH="300px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg={loadingBg}
      >
        <VStack spacing={2}>
          <Spinner size="lg" color="brand.500" thickness="4px" />
          <Text color={loadingTextColor} fontSize="sm">
            Loading map...
          </Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box
      ref={mapRef}
      w="full"
      h="full"
      minH="300px"
      boxShadow="lg"
      borderRadius="lg"
      overflow="hidden"
    />
  );
};
