import { useEffect, useState } from "react";
import { Job } from "@suleigolden/sulber-api-client";
import { fullAddress } from "~/common/utils/address";
import { getDistanceInKm } from "~/common/utils/distance";
import { loadGoogleMapsScript } from "~/common/utils/loadGoogleMapsScript";

function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  return new Promise((resolve) => {
    if (!address?.trim()) {
      resolve(null);
      return;
    }
    loadGoogleMapsScript()
      .then(() => {
        if (!window.google?.maps?.Geocoder) {
          resolve(null);
          return;
        }
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address }, (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
          if (status === "OK" && results?.[0]) {
            const loc = results[0].geometry.location;
            resolve({ lat: loc.lat(), lng: loc.lng() });
          } else {
            resolve(null);
          }
        });
      })
      .catch(() => resolve(null));
  });
}

export function useJobDistances(
  providerAddress: string | null | undefined,
  jobs: Job[]
): { distances: Map<string, number>; isLoading: boolean } {
  const [distances, setDistances] = useState<Map<string, number>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!providerAddress?.trim() || jobs.length === 0) {
      setDistances(new Map());
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const run = async () => {
      setIsLoading(true);
      const providerCoords = await geocodeAddress(providerAddress);
      if (cancelled || !providerCoords) {
        if (!cancelled) {
          setDistances(new Map());
          setIsLoading(false);
        }
        return;
      }

      const next = new Map<string, number>();
      await Promise.all(
        jobs.map(async (job) => {
          const jobAddress = fullAddress(job.address);
          const jobCoords = await geocodeAddress(jobAddress);
          if (cancelled) return;
          if (jobCoords) {
            const km = getDistanceInKm(
              providerCoords.lat,
              providerCoords.lng,
              jobCoords.lat,
              jobCoords.lng
            );
            next.set(job.id, km);
          }
        })
      );
      if (!cancelled) {
        setDistances(next);
      }
      if (!cancelled) setIsLoading(false);
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [providerAddress, jobs]);

  return { distances, isLoading };
}
