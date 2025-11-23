import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  Flex,
  Icon,
  Button,
  Tag,
  useColorModeValue,
} from "@chakra-ui/react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { PropertyOnboardingSchemaType } from "../schema";
import { amenities } from "~/common/constants/amenities";
import { useState } from "react";

type AmenitiesSectionProps = {
  control: Control<PropertyOnboardingSchemaType>;
  errors: FieldErrors<PropertyOnboardingSchemaType>;
};

type CategoryProps = {
  title: string;
  amenityList: typeof amenities;
  selectedAmenities: string[];
  onToggle: (amenity: string) => void;
};

const AmenityCategory = ({ title, amenityList, selectedAmenities, onToggle }: CategoryProps) => {
  const selectedBg = useColorModeValue("brand.50", "brand.900");
  const selectedBorder = useColorModeValue("brand.500", "brand.200");
  const hoverBg = useColorModeValue("gray.50", "gray.700");

  return (
    <Box mb={8}>
      <Text fontSize="lg" fontWeight="semibold" mb={4} textTransform="capitalize">
        {title}
      </Text>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={3}>
        {amenityList.map((amenity) => (
          <Box
            key={amenity.label}
            onClick={() => onToggle(amenity.label)}
            cursor="pointer"
            p={4}
            borderWidth="1px"
            borderRadius="lg"
            borderColor={selectedAmenities.includes(amenity.label) ? selectedBorder : "gray.200"}
            bg={selectedAmenities.includes(amenity.label) ? selectedBg : "white"}
            _hover={{
              bg: selectedAmenities.includes(amenity.label) ? selectedBg : hoverBg,
              transform: "translateY(-1px)",
              transition: "all 0.2s",
            }}
            transition="all 0.2s"
          >
            <Flex align="center" gap={3}>
              <Icon
                as={amenity.icon}
                boxSize={5}
                color={selectedAmenities.includes(amenity.label) ? "brand.500" : "gray.500"}
              />
              <VStack align="start" spacing={0}>
                <Text fontWeight="medium">{amenity.label}</Text>
                {amenity.description && (
                  <Text fontSize="sm" color="gray.600">
                    {amenity.description}
                  </Text>
                )}
              </VStack>
            </Flex>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export const AmenitiesSection = ({ control, errors }: AmenitiesSectionProps) => {
  const [showAll, setShowAll] = useState(false);

  return (
    <Controller
      name="amenities"
      control={control}
      defaultValue={[]}
      render={({ field }) => (
        <VStack align="start" spacing={6} w="full">
          <Box>
            <Heading size="md" mb={1}>
              Amenities
            </Heading>
            <Text fontSize="sm" color="gray.600">
              Select the amenities that your property offers
            </Text>
          </Box>

          <Box 
            w="full" 
            p={6} 
            bg="gray.50" 
            borderRadius="xl"
            border="1px solid"
            borderColor="gray.200"
          >
            {/* Favorites Section - Always visible */}
            <AmenityCategory
              title="Popular amenities"
              amenityList={amenities.filter(a => a.category === "favorites")}
              selectedAmenities={field.value}
              onToggle={(amenity) => {
                const newValue = field.value.includes(amenity)
                  ? field.value.filter(a => a !== amenity)
                  : [...field.value, amenity];
                field.onChange(newValue);
              }}
            />

            {/* Show more amenities */}
            {showAll && (
              <>
                <AmenityCategory
                  title="Standout amenities"
                  amenityList={amenities.filter(a => a.category === "standouts")}
                  selectedAmenities={field.value}
                  onToggle={(amenity) => {
                    const newValue = field.value.includes(amenity)
                      ? field.value.filter(a => a !== amenity)
                      : [...field.value, amenity];
                    field.onChange(newValue);
                  }}
                />

                <AmenityCategory
                  title="Safety amenities"
                  amenityList={amenities.filter(a => a.category === "safety")}
                  selectedAmenities={field.value}
                  onToggle={(amenity) => {
                    const newValue = field.value.includes(amenity)
                      ? field.value.filter(a => a !== amenity)
                      : [...field.value, amenity];
                    field.onChange(newValue);
                  }}
                />
              </>
            )}

            <Button
              variant="ghost"
              colorScheme="brand"
              onClick={() => setShowAll(!showAll)}
              mt={4}
            >
              {showAll ? "Show less" : "Show more amenities"}
            </Button>

            {field.value.length > 0 && (
              <Box mt={6}>
                <Text fontSize="sm" fontWeight="medium" mb={2}>
                  Selected amenities ({field.value.length}):
                </Text>
                <Flex gap={2} flexWrap="wrap">
                  {field.value.map((amenity) => (
                    <Tag
                      key={amenity}
                      size="md"
                      variant="subtle"
                      colorScheme="brand"
                    >
                      {amenity}
                    </Tag>
                  ))}
                </Flex>
              </Box>
            )}
          </Box>
        </VStack>
      )}
    />
  );
}; 