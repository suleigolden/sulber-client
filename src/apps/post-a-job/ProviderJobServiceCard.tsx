import {
  Badge,
  Box,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  Spacer,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import type { ProviderJobService } from "@suleigolden/sulber-api-client";
import { ProviderServiceTypesList } from "@suleigolden/sulber-api-client";
import { FaCar, FaParking, FaSnowflake, FaHome, FaTree, FaLeaf, FaMapMarkerAlt, FaStickyNote, FaCalendarAlt } from "react-icons/fa";

const getServiceIcon = (serviceType: string): React.ElementType => {
  const iconMap: Record<string, React.ElementType> = {
    DRIVEWAY_CAR_WASH: FaCar,
    DRIVEWAY_CAR_CLEANING: FaCar,
    PARKING_LOT_CAR_CLEANING: FaParking,
    PARKING_LOT_CAR_WASH: FaParking,
    GENERAL_CAR_CLEANING: FaCar,
    DRIVEWAY_CLEANING: FaHome,
    DRIVEWAY_SNOW_SHOVELING: FaSnowflake,
    SNOW_SHOVELING: FaSnowflake,
    FRONT_YARD_CLEANING: FaLeaf,
    BACK_YARD_CLEANING: FaLeaf,
    FRONT_YARD_LANDSCAPING: FaTree,
    BACK_YARD_LANDSCAPING: FaTree,
    FRONT_YARD_SNOW_SHOVELING: FaSnowflake,
    BACK_YARD_SNOW_SHOVELING: FaSnowflake,
  };
  return iconMap[serviceType] ?? FaCar;
};

const statusColorMap: Record<string, string> = {
  active: "green",
  inactive: "gray",
  pending: "yellow",
  published: "blue",
  approved: "green",
  archived: "gray",
  deleted: "red",
};

type ProviderJobServiceCardProps = {
  job: ProviderJobService;
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  const color = useColorModeValue("gray.600", "gray.400");
  return (
    <Text as="span" fontSize="xs" fontWeight="semibold" color={color} textTransform="uppercase" letterSpacing="wider">
      {children}
    </Text>
  );
}

export function ProviderJobServiceCard({ job }: ProviderJobServiceCardProps) {
  const cardBg = useColorModeValue("white", "whiteAlpha.50");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");
  const mutedColor = useColorModeValue("gray.600", "gray.400");
  const requirementsColor = useColorModeValue("gray.700", "gray.300");

  const serviceConfig = ProviderServiceTypesList.services.find(
    (s) => s.type === job.serviceType
  );
  const serviceTitle = serviceConfig?.title ?? job.serviceType;
  const requirements = (serviceConfig as { requirements_for_provider?: { equipment?: string; experience?: string; license?: string; physical?: string; availability?: string } })?.requirements_for_provider;
  const priceDollars = (job.priceCents / 100).toFixed(2);
  const statusColor = statusColorMap[job.status] ?? "gray";
  const IconComponent = getServiceIcon(job.serviceType);
  const hoverBorderColor = useColorModeValue("gray.300", "whiteAlpha.300");

  return (
    <Box
      bg={cardBg}
      borderRadius={{ base: "md", md: "lg" }}
      borderWidth="1px"
      borderColor={borderColor}
      p={{ base: 3, sm: 4, md: 5 }}
      transition="all 0.2s"
      _hover={{
        borderColor: hoverBorderColor,
        transform: { base: "none", md: "translateY(-2px)" },
        boxShadow: { base: "sm", md: "md" },
      }}
      position="relative"
      w="full"
    >
      {/* Same layout as ServiceCard: Badge + Icon, Heading, requirements */}
      <Flex
        justify="space-between"
        align="start"
        direction={{ base: "column", sm: "row" }}
        gap={{ base: 3, sm: 4 }}
      >
        <VStack align="start" spacing={{ base: 2, sm: 3 }} flex={1} w="full">
          <Flex px="4" mb="6" justifyContent="space-between" align="center" w="full">
            <HStack spacing={2} flexWrap="wrap">
              <Badge
                colorScheme="blue"
                borderRadius="full"
                px={{ base: 2, sm: 3 }}
                py={1}
                fontSize="xs"
                fontWeight="medium"
              >
                Service
              </Badge>
              <Badge
                colorScheme={statusColor}
                borderRadius="full"
                px={{ base: 2, sm: 3 }}
                py={1}
                fontSize="xs"
                fontWeight="medium"
                textTransform="capitalize"
              >
                {job.status}
              </Badge>
            </HStack>
            <Spacer />
            <Box
              ml={{ base: "90px", sm: 0 }}
              alignSelf={{ base: "flex-start", sm: "flex-start" }}
              flexShrink={0}
              display={{ base: "block", sm: "none" }}
            >
              <Icon as={IconComponent} boxSize={6} color="brand.500" />
            </Box>
          </Flex>

          <Heading size={{ base: "sm", sm: "md" }} fontWeight="600">
            {serviceTitle}
          </Heading>

          {/* Provider requirements (same as ServiceCard) */}
          {requirements && (
            <VStack align="start" spacing={{ base: 0.5, sm: 1 }} w="full">
              {requirements.equipment && (
                <Text fontSize={{ base: "xs", sm: "sm" }} color={requirementsColor} lineHeight="tall">
                  <Text as="span" fontWeight="bold">Equipment:</Text> {requirements.equipment}
                </Text>
              )}
              {requirements.experience && (
                <Text fontSize={{ base: "xs", sm: "sm" }} color={requirementsColor} lineHeight="tall">
                  <Text as="span" fontWeight="bold">Experience:</Text> {requirements.experience}
                </Text>
              )}
              {requirements.license && (
                <Text fontSize={{ base: "xs", sm: "sm" }} color={requirementsColor} lineHeight="tall">
                  <Text as="span" fontWeight="bold">License:</Text> {requirements.license}
                </Text>
              )}
              {requirements.physical && (
                <Text fontSize={{ base: "xs", sm: "sm" }} color={requirementsColor} lineHeight="tall">
                  <Text as="span" fontWeight="bold">Physical:</Text> {requirements.physical}
                </Text>
              )}
              {requirements.availability && (
                <Text fontSize={{ base: "xs", sm: "sm" }} color={requirementsColor} lineHeight="tall">
                  <Text as="span" fontWeight="bold">Availability:</Text> {requirements.availability}
                </Text>
              )}
            </VStack>
          )}
        </VStack>

        <Box
          ml={{ base: 0, sm: 4 }}
          alignSelf="flex-start"
          flexShrink={0}
          display={{ base: "none", sm: "block" }}
        >
          <Icon as={IconComponent} boxSize={6} color="brand.500" />
        </Box>
      </Flex>

      {/* Additional fields: Price, locations, description, notes, status, availability */}
      <Divider my={4} />

      <VStack align="stretch" spacing={4}>
        {/* Price */}
        <Box>
          <FieldLabel>Price</FieldLabel>
          <Text fontSize="lg" fontWeight="bold" color="brand.500" mt={1}>
            ${priceDollars}
          </Text>
          <Text fontSize="xs" color={mutedColor}>Base price</Text>
        </Box>

        {/* Primary location */}
        <Box>
          <FieldLabel>Primary location</FieldLabel>
          <HStack align="start" spacing={2} mt={1}>
            <Icon as={FaMapMarkerAlt} boxSize={4} color={mutedColor} mt={0.5} />
            <Text fontSize="sm" color={requirementsColor}>
              {job.primaryLocation}
            </Text>
          </HStack>
        </Box>

        {/* Other locations */}
        {job.otherLocations?.length > 0 && (
          <Box>
            <FieldLabel>Other locations</FieldLabel>
            <VStack align="stretch" spacing={1} mt={1}>
              {job.otherLocations.map((addr, i) => (
                <HStack key={i} align="start" spacing={2}>
                  <Icon as={FaMapMarkerAlt} boxSize={3} color={mutedColor} mt={1} />
                  <Text fontSize="sm" color={requirementsColor}>{addr}</Text>
                </HStack>
              ))}
            </VStack>
          </Box>
        )}

        {/* Description */}
        {job.description && (
          <Box>
            <FieldLabel>Description</FieldLabel>
            <Text fontSize="sm" color={requirementsColor} mt={1} lineHeight="tall">
              {job.description}
            </Text>
          </Box>
        )}

        {/* Internal notes */}
        {job.notes && (
          <Box>
            <FieldLabel>Internal notes</FieldLabel>
            <HStack align="start" spacing={2} mt={1}>
              <Icon as={FaStickyNote} boxSize={4} color={mutedColor} mt={0.5} />
              <Text fontSize="sm" color={requirementsColor} fontStyle="italic">
                {job.notes}
              </Text>
            </HStack>
          </Box>
        )}

        {/* Availability */}
        {job.daysOfWeekAvailable?.length > 0 && (
          <Box>
            <FieldLabel>Availability</FieldLabel>
            <HStack align="start" spacing={2} mt={1} flexWrap="wrap">
              <Icon as={FaCalendarAlt} boxSize={4} color={mutedColor} mt={0.5} />
              <Flex wrap="wrap" gap={2}>
                {job.daysOfWeekAvailable.map((slot, i) => (
                  <Badge key={i} variant="subtle" colorScheme="brand" fontSize="xs" px={2} py={1} borderRadius="md">
                    {slot}
                  </Badge>
                ))}
              </Flex>
            </HStack>
          </Box>
        )}
      </VStack>
    </Box>
  );
}
