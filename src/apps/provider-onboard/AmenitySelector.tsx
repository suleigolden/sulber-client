import {
  Box,
  Button,
  SimpleGrid,
  VStack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { amenities } from "~/common/constants/amenities";

export type Amenity = {
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  category: "favorites" | "standouts" | "safety";
};

type AmenitySelectorProps = {
  selectedAmenities: string[];
  setSelectedAmenities: React.Dispatch<React.SetStateAction<string[]>>;
};

export function AmenitySelector({
  selectedAmenities,
  setSelectedAmenities,
}: AmenitySelectorProps) {
  const buttonBg = useColorModeValue("white", "gray.800");
  const buttonBgSelected = useColorModeValue("brand.100", "brand.900");
  const borderColor = useColorModeValue("gray.300", "whiteAlpha.400");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const hoverBgSelected = useColorModeValue("brand.200", "brand.800");

  const categories = useMemo(() => {
    const grouped: { [key: string]: Amenity[] } = {};
    amenities.forEach((a) => {
      if (!grouped[a.category]) grouped[a.category] = [];
      grouped[a.category].push(a);
    });
    return grouped;
  }, []);

  const handleToggle = (label: string) => {
    setSelectedAmenities((prev: string[]) =>
      prev.includes(label)
        ? prev.filter((item: string) => item !== label)
        : [...prev, label],
    );
  };

  return (
    <VStack align="start" spacing={8}>
      {Object.entries(categories).map(([category, items]) => (
        <Box key={category} w="100%">
          <Text fontSize="md" fontWeight="semibold" mb={4}>
            {category === "favorites"
              ? "What about these guest favourites?"
              : category === "standouts"
              ? "Do you have any standout amenities?"
              : category === "safety"
              ? "  Do you have any of these safety items?"
              : ""}
          </Text>
          <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4}>
            {items.map(({ label, icon: Icon }) => {
              const isSelected = selectedAmenities.includes(label);
              return (
                <Button
                  key={label}
                  onClick={() => handleToggle(label)}
                  variant="outline"
                  leftIcon={<Icon />}
                  bg={isSelected ? buttonBgSelected : buttonBg}
                  borderColor={isSelected ? "brand.400" : borderColor}
                  _hover={{ bg: isSelected ? hoverBgSelected : hoverBg }}
                  _active={{ transform: "scale(0.98)" }}
                  borderWidth="1px"
                  borderRadius="md"
                  px={4}
                  py={6}
                  p={9}
                  w="full"
                  h="auto"
                  justifyContent="flex-start"
                  alignItems="center"
                  flexDirection="column"
                  gap={2}
                >
                  <Text fontSize="sm" fontWeight="medium">
                    {label}
                  </Text>
                </Button>
              );
            })}
          </SimpleGrid>
        </Box>
      ))}
    </VStack>
  );
}
