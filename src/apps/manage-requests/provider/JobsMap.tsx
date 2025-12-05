import { Box, Spinner, Text, VStack } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { Job } from "@suleigolden/sulber-api-client";
import { fullAddress } from "~/common/utils/address";
import { formatNumberWithCommas } from "~/common/utils/currency-formatter";
import { loadGoogleMapsScript } from "~/common/utils/loadGoogleMapsScript";

type JobsMapProps = {
  jobs: Job[];
  selectedJobId?: string | null;
  onJobSelect?: (job: Job) => void;
};

export const JobsMap = ({ jobs, selectedJobId, onJobSelect }: JobsMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current) {
      setIsLoading(false);
      return;
    }

    if (jobs.length === 0) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    // Load Google Maps script
    loadGoogleMapsScript()
      .then(() => {
        // Wait a bit for Google Maps to be fully initialized
        const checkGoogleMaps = () => {
          if (window.google?.maps && isMounted) {
            initializeMap();
          } else if (isMounted) {
            setTimeout(checkGoogleMaps, 100);
          }
        };
        checkGoogleMaps();
      })
      .catch(() => {
        if (isMounted) {
          setMapError("Failed to load Google Maps");
          setIsLoading(false);
        }
      });

    function initializeMap() {
      if (!mapRef.current || !window.google?.maps || !isMounted) return;
      if (!mapRef.current || !window.google?.maps) return;

      try {
        // Initialize map centered on first job or default location
        const firstJob = jobs[0];
        const defaultCenter = firstJob
          ? {
              lat: 0, // Will be geocoded
              lng: 0,
            }
          : { lat: 43.6532, lng: -79.3832 }; // Default to Toronto

        const map = new window.google.maps.Map(mapRef.current, {
          zoom: 12,
          center: defaultCenter,
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: true,
        });

        mapInstanceRef.current = map;

        // Geocode addresses and add markers
        const geocoder = new window.google.maps.Geocoder();
        const bounds = new window.google.maps.LatLngBounds();
        let geocodedCount = 0;
        let failedCount = 0;

        const checkIfDone = () => {
          if (geocodedCount + failedCount === jobs.length) {
            setIsLoading(false);
            // Fit bounds if we have at least one marker
            if (markersRef.current.length > 1) {
              map.fitBounds(bounds);
            } else if (markersRef.current.length === 1) {
              const firstMarker = markersRef.current[0];
              if (firstMarker.getPosition()) {
                map.setCenter(firstMarker.getPosition()!);
                map.setZoom(15);
              }
            }
          }
        };

        jobs.forEach((job) => {
          const address = fullAddress(job.address);
          geocoder.geocode({ address }, (results, status) => {
            if (!isMounted) return;

            if (status === "OK" && results && results[0]) {
              const location = results[0].geometry.location;
              const price = job.totalPriceCents
                ? formatNumberWithCommas(Number(job.totalPriceCents) / 100)
                : "0";

              // Create custom marker icon with price
              const markerIcon = {
                url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                  <svg width="60" height="80" xmlns="http://www.w3.org/2000/svg">
                    <path d="M30 0 C13.4 0 0 13.4 0 30 C0 45 30 80 30 80 C30 80 60 45 60 30 C60 13.4 46.6 0 30 0 Z" fill="#6868f7" stroke="#FFF" stroke-width="2"/>
                    <text x="30" y="35" text-anchor="middle" fill="white" font-size="17" font-weight="bold">$${price}</text>
                  </svg>
                `)}`,
                scaledSize: new window.google.maps.Size(60, 80),
                anchor: new window.google.maps.Point(30, 80),
              };

              // Create marker with custom icon showing price
              const marker = new window.google.maps.Marker({
                position: location,
                map: map,
                title: `${address} - $${price}`,
                icon: markerIcon,
                animation: selectedJobId === job.id ? window.google.maps.Animation.BOUNCE : undefined,
              });

              // Add click listener
              marker.addListener("click", () => {
                if (onJobSelect && isMounted) {
                  onJobSelect(job);
                }
                // Center map on marker
                if (isMounted) {
                  map.setCenter(location);
                  map.setZoom(15);
                }
              });

              markersRef.current.push(marker);
              bounds.extend(location);
              geocodedCount++;
            } else {
              console.error(`Geocoding failed for ${address}:`, status);
              failedCount++;
            }

            checkIfDone();
          });
        });
      } catch (error) {
        console.error("Error initializing map:", error);
        setMapError("Failed to initialize map");
        setIsLoading(false);
      }
    }

    // Cleanup markers on unmount
    return () => {
      isMounted = false;
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
    };
  }, [jobs, selectedJobId, onJobSelect]);

  if (mapError) {
    return (
      <Box w="full" h="full" display="flex" alignItems="center" justifyContent="center" bg="gray.100">
        <Text color="red.500">{mapError}</Text>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box w="full" h="full" display="flex" alignItems="center" justifyContent="center" bg="gray.100">
        <VStack spacing={2}>
          <Spinner size="xl" color="brand.500" thickness="4px" />
          <Text color="gray.600" fontSize="sm">
            Loading map...
          </Text>
        </VStack>
      </Box>
    );
  }

  return <Box ref={mapRef} w="full" h="full" minH="600px" borderRadius="lg" overflow="hidden" />;
};

