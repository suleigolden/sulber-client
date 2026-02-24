import {
  Badge,
  Box,
  Heading,
  HStack,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import type { ProviderJobService } from "@suleigolden/sulber-api-client";
import { ProviderServiceTypesList } from "@suleigolden/sulber-api-client";
import { FaMapMarkerAlt } from "react-icons/fa";

type ProviderJobServiceCardProps = {
  job: ProviderJobService;
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

export function ProviderJobServiceCard({ job }: ProviderJobServiceCardProps) {
  const cardBg = useColorModeValue("white", "whiteAlpha.100");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");
  const mutedColor = useColorModeValue("gray.600", "gray.400");

  const serviceTitle =
    ProviderServiceTypesList.services.find((s) => s.type === job.serviceType)
      ?.title ?? job.serviceType;
  const priceDollars = (job.priceCents / 100).toFixed(2);
  const statusColor = statusColorMap[job.status] ?? "gray";

  return (
    <Box
      bg={cardBg}
      borderRadius="xl"
      borderWidth="1px"
      borderColor={borderColor}
      p={{ base: 4, md: 5 }}
      shadow="sm"
      _hover={{ shadow: "md", borderColor: "brand.100" }}
      transition="all 0.2s"
    >
      <VStack align="stretch" spacing={3}>
        <HStack justify="space-between" align="start" flexWrap="wrap" gap={2}>
          <Heading size="md" fontWeight="bold" noOfLines={2}>
            {serviceTitle}
          </Heading>
          <Badge
            colorScheme={statusColor}
            px={3}
            py={1}
            borderRadius="full"
            fontSize="xs"
            fontWeight="semibold"
            textTransform="capitalize"
          >
            {job.status}
          </Badge>
        </HStack>

        <HStack fontSize="lg" fontWeight="semibold" color="brand.500">
          <Text>${priceDollars}</Text>
          <Text fontSize="sm" fontWeight="normal" color={mutedColor}>
            base price
          </Text>
        </HStack>

        <HStack align="start" spacing={2}>
          <FaMapMarkerAlt size={14} style={{ marginTop: 4, flexShrink: 0 }} />
          <Text fontSize="sm" color={mutedColor} noOfLines={2}>
            {job.primaryLocation}
          </Text>
        </HStack>

        {job.description && (
          <Text fontSize="sm" color={mutedColor} noOfLines={2}>
            {job.description}
          </Text>
        )}

        {job.daysOfWeekAvailable?.length > 0 && (
          <HStack flexWrap="wrap" gap={1}>
            {job.daysOfWeekAvailable.slice(0, 3).map((slot, i) => (
              <Badge key={i} variant="subtle" fontSize="xs" px={2} py={0.5}>
                {slot}
              </Badge>
            ))}
            {job.daysOfWeekAvailable.length > 3 && (
              <Text as="span" fontSize="xs" color={mutedColor}>
                +{job.daysOfWeekAvailable.length - 3} more
              </Text>
            )}
          </HStack>
        )}
      </VStack>
    </Box>
  );
}
