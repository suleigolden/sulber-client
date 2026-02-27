import {
  Badge,
  Box,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { MdMoreVert } from "react-icons/md";
import { FiEdit2, FiToggleLeft, FiToggleRight, FiTrash2 } from "react-icons/fi";
import type { ProviderJobService } from "@suleigolden/sulber-api-client";
import {
  ProviderServiceTypesList,
  CarWashServiceAddOnPriceEntries,
} from "@suleigolden/sulber-api-client";
import { formatLocationDisplay } from "./location-utils";
import {
  FaCar,
  FaParking,
  FaSnowflake,
  FaHome,
  FaTree,
  FaLeaf,
  FaMapMarkerAlt,
  FaStickyNote,
  FaCalendarAlt,
} from "react-icons/fa";
import { formatNumberWithCommasAndDecimals } from "~/common/utils/currency-formatter";

const DRIVEWAY_CAR_WASH = "DRIVEWAY_CAR_WASH";

const ADD_ON_LABELS: Record<
  (typeof CarWashServiceAddOnPriceEntries)[number],
  string
> = {
  interior_deep_cleaning: "Interior deep cleaning",
  wax_polish: "Wax & polish",
  engine_bay_cleaning: "Engine bay cleaning",
  odor_removal: "Odor removal",
  multiple_vehicles_discount: "Multiple vehicles discount",
};

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
  onEdit?: (job: ProviderJobService) => void;
  onToggleStatus?: (job: ProviderJobService) => void;
  onDelete?: (job: ProviderJobService) => void;
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  const color = useColorModeValue("gray.600", "gray.400");
  return (
    <Text as="span" fontSize="xs" fontWeight="semibold" color={color} textTransform="uppercase" letterSpacing="wider">
      {children}
    </Text>
  );
}

export function ProviderJobServiceCard({ job, onEdit, onToggleStatus, onDelete }: ProviderJobServiceCardProps) {
  const cardBg = useColorModeValue("white", "whiteAlpha.50");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");
  const mutedColor = useColorModeValue("gray.600", "gray.400");
  const requirementsColor = useColorModeValue("gray.700", "gray.300");
  const menuBg = useColorModeValue("white", "gray.800");
  const menuBorder = useColorModeValue("gray.200", "whiteAlpha.200");
  const menuItemHover = useColorModeValue("gray.50", "whiteAlpha.100");
  const menuButtonHover = useColorModeValue("gray.100", "whiteAlpha.200");
  const menuButtonActive = useColorModeValue("gray.200", "whiteAlpha.300");

  // Support both camelCase (client types) and snake_case (API payload) fields
  const raw: any = job as any;
  const serviceType: string =
    raw.serviceType ?? raw.service_type ?? "";
  const priceCents: number = raw.price ?? raw.price_cents ?? 0;
  const basePriceCents: number | undefined =
    raw.basePrice ?? raw.base_price ?? priceCents;
  const sedanPriceCents: number | undefined =
    raw.sedanPrice ?? raw.sedan_price ?? basePriceCents;
  const suvPriceCents: number | undefined =
    raw.suvPrice ?? raw.suv_price ?? 0;
  const truckPriceCents: number | undefined =
    raw.truckPrice ?? raw.truck_price ?? 0;
  const vanPriceCents: number | undefined =
    raw.vanPrice ?? raw.van_price ?? 0;
  const addOnPrices: any[] = raw.addOnPrices ?? raw.add_on_prices ?? [];
  const primaryLocation = raw.primaryLocation ?? raw.primary_location;
  const otherLocations: any[] = raw.otherLocations ?? raw.other_locations ?? [];
  const daysOfWeekAvailable: string[] =
    raw.daysOfWeekAvailable ?? raw.days_of_week_available ?? [];
  const isActive = job.status === "active";
  const canToggleActive = job.status === "active" || job.status === "inactive";

  const serviceConfig = ProviderServiceTypesList.services.find(
    (s) => s.type === serviceType
  );
  const serviceTitle = serviceConfig?.title ?? serviceType;
  const requirements = (serviceConfig as {
    requirements_for_provider?: {
      equipment?: string;
      experience?: string;
      license?: string;
      physical?: string;
      availability?: string;
    };
  })?.requirements_for_provider;
  const priceDollars = (priceCents).toFixed(2);
  const isDrivewayCarWash = serviceType === DRIVEWAY_CAR_WASH;
  const statusColor = statusColorMap[job.status] ?? "gray";
  const IconComponent = getServiceIcon(serviceType);
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
      {/* Hamburger menu - top right */}
      <Box position="absolute" top={3} right={3} zIndex={1}>
        <Menu isLazy placement="bottom-end" autoSelect={false}>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<MdMoreVert size={40} />}
            variant="ghost"
            size="sm"
            borderRadius="full"
            _hover={{ bg: menuButtonHover }}
            _active={{ bg: menuButtonActive }}
          />
          <MenuList
            minW="180px"
            bg={menuBg}
            borderColor={menuBorder}
            borderRadius="lg"
            py={1}
            shadow="md"
          >
            {onEdit && (
              <MenuItem
                icon={<FiEdit2 size={16} />}
                onClick={() => onEdit(job)}
                _focus={{ bg: menuItemHover }}
              >
                Edit
              </MenuItem>
            )}
            {onToggleStatus && canToggleActive && (
              <MenuItem
                icon={isActive ? <FiToggleLeft size={16} /> : <FiToggleRight size={16} />}
                onClick={() => onToggleStatus(job)}
                _focus={{ bg: menuItemHover }}
              >
                {isActive ? "Set as inactive" : "Set as active"}
              </MenuItem>
            )}
            {onDelete && (
              <MenuItem
                icon={<FiTrash2 size={16} />}
                onClick={() => onDelete(job)}
                color="red.500"
                _focus={{ bg: menuItemHover }}
              >
                Delete
              </MenuItem>
            )}
          </MenuList>
        </Menu>
      </Box>

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
          mr={50}
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
        {/* Price / vehicle pricing */}
        {isDrivewayCarWash ? (
          <Box>
            <FieldLabel>Vehicle prices</FieldLabel>
            <VStack align="start" spacing={1} mt={1}>
              <Text fontSize="sm" color={requirementsColor}>
                <Text as="span" fontWeight="bold">
                  Sedan:
                </Text>{" "}
                ${formatNumberWithCommasAndDecimals((sedanPriceCents ?? basePriceCents ?? priceCents))}
              </Text>
              {suvPriceCents != null && suvPriceCents > 0 && (
                <Text fontSize="sm" color={requirementsColor}>
                  <Text as="span" fontWeight="bold">
                    SUV:
                  </Text>{" "}
                  ${formatNumberWithCommasAndDecimals(suvPriceCents)}
                </Text>
              )}
              {truckPriceCents != null && truckPriceCents > 0 && (
                <Text fontSize="sm" color={requirementsColor}>
                  <Text as="span" fontWeight="bold">
                    Truck:
                  </Text>{" "}
                  ${formatNumberWithCommasAndDecimals(truckPriceCents)}
                </Text>
              )}
              {vanPriceCents != null && vanPriceCents > 0 && (
                <Text fontSize="sm" color={requirementsColor}>
                  <Text as="span" fontWeight="bold">
                    Van:
                  </Text>{" "}
                  ${formatNumberWithCommasAndDecimals(vanPriceCents)}
                </Text>
              )}
            </VStack>
          </Box>
        ) : (
          <Box>
            <FieldLabel>Price</FieldLabel>
            <Text fontSize="lg" fontWeight="bold" color="brand.500" mt={1}>
              ${formatNumberWithCommasAndDecimals((priceCents))}
            </Text>
            <Text fontSize="xs" color={mutedColor}>
              Base price
            </Text>
          </Box>
        )}

        {/* Add-on prices for car wash */}
        {isDrivewayCarWash && addOnPrices && addOnPrices.length > 0 && (
          <Box>
            <FieldLabel>Add-on prices</FieldLabel>
            <VStack align="start" spacing={1} mt={1}>
              {CarWashServiceAddOnPriceEntries.map((key) => {
                const entry = addOnPrices!.find((p) => p[key]);
                const cents = entry?.[key]?.price ?? 0;
                if (!cents) return null;
                return (
                  <Text key={key} fontSize="sm" color={requirementsColor}>
                    <Text as="span" fontWeight="bold">
                      {ADD_ON_LABELS[key]}:
                    </Text>{" "}
                    ${formatNumberWithCommasAndDecimals(cents)}
                  </Text>
                );
              })}
            </VStack>
          </Box>
        )}

        {/* Primary location */}
        <Box>
          <FieldLabel>Primary location</FieldLabel>
          <HStack align="start" spacing={2} mt={1}>
            <Icon as={FaMapMarkerAlt} boxSize={4} color={mutedColor} mt={0.5} />
            <Text fontSize="sm" color={requirementsColor}>
              {formatLocationDisplay(primaryLocation)}
            </Text>
          </HStack>
        </Box>

        {/* Other locations */}
        {otherLocations?.length > 0 && (
          <Box>
            <FieldLabel>Other locations</FieldLabel>
            <VStack align="stretch" spacing={1} mt={1}>
              {otherLocations.map((loc, i) => (
                <HStack key={i} align="start" spacing={2}>
                  <Icon as={FaMapMarkerAlt} boxSize={3} color={mutedColor} mt={1} />
                  <Text fontSize="sm" color={requirementsColor}>
                    {formatLocationDisplay(loc)}
                  </Text>
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
        {daysOfWeekAvailable?.length > 0 && (
          <Box>
            <FieldLabel>Availability</FieldLabel>
            <HStack align="start" spacing={2} mt={1} flexWrap="wrap">
              <Icon as={FaCalendarAlt} boxSize={4} color={mutedColor} mt={0.5} />
              <Flex wrap="wrap" gap={2}>
                {daysOfWeekAvailable.map((slot, i) => (
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
