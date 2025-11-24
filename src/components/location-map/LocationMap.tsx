import { Box } from "@chakra-ui/react";
import { Address } from "@suleigolden/sulber-api-client";

type LocationMapProps = {
    address: Address
};

export const LocationMap = ({ address }: LocationMapProps) => {


const getMapQuery = (location: Address) => {
  const queryParts = [
    location?.street,
    location?.city,
    location?.state,
    location?.country,
  ]
    .filter(Boolean)
    .join(" ");

  return `https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(queryParts)}`;
};

  return (
    <>
      <Box h="400px"
        w="100%"
        overflow="hidden"
        boxShadow="lg"
      >
        <iframe
          width="100%"
          height="450px"
          style={{ border: 0 }}
          loading="lazy"
          src={getMapQuery(address)}
        ></iframe>
      </Box>
    </>
  );
};