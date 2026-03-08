import {
  Container,
  Heading,
  VStack,
  SimpleGrid,
  Box,
  Text,
  Spinner,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
} from "@chakra-ui/react";
import { useSystemAdminStats } from "~/hooks/use-system-admin-stats";
import { useSystemColor } from "~/hooks/use-system-color";

const StatCard = ({
  label,
  value,
  borderColor,
}: {
  label: string;
  value: number;
  borderColor: string;
}) => (
  <Box
    p={6}
    rounded="lg"
    borderWidth="1px"
    borderColor={borderColor}
    bg={useColorModeValue("white", "whiteAlpha.50")}
  >
    <Stat>
      <StatLabel fontSize="sm" color={useColorModeValue("gray.600", "gray.400")}>
        {label}
      </StatLabel>
      <StatNumber fontSize="2xl">{value}</StatNumber>
    </Stat>
  </Box>
);

export const SystemAdminDashboard = () => {
  const { stats, isLoading, error } = useSystemAdminStats();
  const { borderColor, mutedTextColor, headingColor } = useSystemColor();

  if (isLoading) {
    return (
      <Container maxW="1500px" px={[4, 8]} py={8}>
        <VStack align="start" spacing={8} w="full" mt={10}>
          <Spinner size="lg" color="brand.500" />
          <Text color={mutedTextColor}>Loading dashboard…</Text>
        </VStack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="1500px" px={[4, 8]} py={8}>
        <VStack align="start" spacing={8} w="full" mt={10}>
          <Heading size="md" color="red.500">
            Could not load dashboard
          </Heading>
          <Text color={mutedTextColor}>{error}</Text>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="1500px" px={[4, 8]} py={8}>
      <VStack align="start" spacing={8} w="full" mt={10}>
        <Heading size="lg" color={headingColor}>
          System admin dashboard
        </Heading>
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={6} w="full">
          <StatCard
            label="Customers"
            value={stats?.customersCount ?? 0}
            borderColor={borderColor}
          />
          <StatCard
            label="Providers"
            value={stats?.providersCount ?? 0}
            borderColor={borderColor}
          />
          <StatCard
            label="Jobs"
            value={stats?.jobsCount ?? 0}
            borderColor={borderColor}
          />
          <StatCard
            label="Payouts"
            value={stats?.payoutsCount ?? 0}
            borderColor={borderColor}
          />
        </SimpleGrid>
      </VStack>
    </Container>
  );
};