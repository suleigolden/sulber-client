import { useState, useEffect } from "react";
import { loadGoogleMapsScript } from "~/common/utils/loadGoogleMapsScript";

// Extend Window interface for Google Maps
declare global {
  interface Window {
    google?: typeof google;
  }
}

export type CurrentLocation = {
  lat: number;
  lng: number;
  address: string;
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
};

export const useCurrentLocation = () => {
  const [currentLocation, setCurrentLocation] = useState<CurrentLocation | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(true);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentLocation = async () => {
      setIsLoadingLocation(true);
      setLocationError(null);

      // Check if geolocation is supported
      if (!navigator.geolocation) {
        setLocationError("Geolocation is not supported by your browser");
        setIsLoadingLocation(false);
        return;
      }

      try {
        // Get current position
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            
            try {
              // Load Google Maps script if not already loaded
              await loadGoogleMapsScript();
              
              // Check if Google Maps is loaded
              if (typeof window.google === 'undefined' || !window.google.maps) {
                throw new Error("Google Maps API not loaded");
              }

              // Reverse geocode coordinates to get address
              const geocoder = new window.google.maps.Geocoder();
              geocoder.geocode(
                { location: { lat: latitude, lng: longitude } },
                (results, status) => {
                  if (status === 'OK' && results && results[0]) {
                    const result = results[0];
                    const addressComponents = result.address_components || [];
                    
                    let street = '';
                    let city = '';
                    let state = '';
                    let country = '';
                    let postalCode = '';

                    addressComponents.forEach((component: any) => {
                      const types = component.types;
                      if (types.includes('street_number') || types.includes('route')) {
                        street = street
                          ? `${component.long_name} ${street}`
                          : component.long_name;
                      } else if (types.includes('locality') || types.includes('administrative_area_level_2')) {
                        city = component.long_name;
                      } else if (types.includes('administrative_area_level_1')) {
                        state = component.short_name || component.long_name;
                      } else if (types.includes('country')) {
                        country = component.short_name || component.long_name;
                      } else if (types.includes('postal_code')) {
                        postalCode = component.long_name;
                      }
                    });

                    const location: CurrentLocation = {
                      lat: latitude,
                      lng: longitude,
                      address: result.formatted_address,
                      street: street || undefined,
                      city: city || undefined,
                      state: state || undefined,
                      country: country || undefined,
                      postalCode: postalCode || undefined,
                    };

                    setCurrentLocation(location);
                    setIsLoadingLocation(false);
                  } else {
                    setLocationError("Unable to get address from location");
                    setIsLoadingLocation(false);
                  }
                }
              );
            } catch (error) {
              console.error("Error reverse geocoding:", error);
              setLocationError("Failed to get address from location");
              setIsLoadingLocation(false);
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
            let errorMessage = "Failed to get your location";
            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage = "Location access denied by user";
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage = "Location information unavailable";
                break;
              case error.TIMEOUT:
                errorMessage = "Location request timed out";
                break;
            }
            setLocationError(errorMessage);
            setIsLoadingLocation(false);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      } catch (error) {
        console.error("Error getting location:", error);
        setLocationError("Failed to get your location");
        setIsLoadingLocation(false);
      }
    };

    getCurrentLocation();
  }, []);

  return {
    currentLocation,
    isLoadingLocation,
    locationError,
  };
};

