import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  IconButton,
  Badge,
  Flex,
} from "@chakra-ui/react";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { FormProvider } from "react-hook-form";
import { useProviderOnboarding } from "~/hooks/use-provider-onboarding";
import { ProviderServiceType } from "@suleigolden/sulber-api-client";
import { FaCar, FaParking, FaSnowflake } from "react-icons/fa";
import { CloseIcon } from "@chakra-ui/icons";

type ServiceConfig = {
  type: ProviderServiceType;
  title: string;
  description: string;
  icon: React.ElementType;
  requirements: {
    equipment?: string;
    physical?: string;
    availability?: string;
    experience?: string;
    license?: string;
  };
};
const SERVICE_CONFIGS: ServiceConfig[] = [
  {
    type: "DRIVEWAY_CAR_WASH",
    title: "Driveway Car Wash",
    description: "Professional car washing services at customer locations",
    icon: FaCar,
    requirements: {
      equipment: "Portable pressure washer, microfiber towels, eco-friendly soap, water supply hose, vacuum cleaner for interiors.",
      experience: "Prior experience in car detailing or mobile washing preferred; must know safe cleaning techniques for different vehicle finishes.",
      license: "Valid driver’s license or Government ID",
    },
  },
  {
    type: "SNOW_SHOVELING",
    title: "Snow Shoveling",
    description: "Clear driveways and walkways during winter months",
    icon: FaSnowflake,
    requirements: {
      equipment: "Shovel, snow blower (optional), ice scraper, salt or eco-safe ice melt, and protective clothing.",
      physical: "Must be physically fit to handle heavy snow and work in cold conditions for extended periods.",
      availability: "Must be available on short notice during snowstorms, early mornings, or overnight snow events.",
      license: "Valid driver’s license or Government ID",
    },
  },
  {
    type: "PARKING_LOT_CLEANING",
    title: "Parking Lot Car Cleaning",
    description: "Commercial parking lot car maintenance and cleaning",
    icon: FaParking,
    requirements: {
      equipment: "Pressure washer, industrial vacuum, garbage collection tools, surface cleaner, cleaning agents, and safety cones.",
      experience: "Prior experience in outdoor vehicle cleaning or facility maintenance; knowledge of surface cleaning safety standards.",
      license: "Valid driver’s license, Government ID or business license",
    },
  },
];

type ServiceCardProps = {
  service: ServiceConfig;
  isSelected: boolean;
  onToggle: () => void;
};

const ServiceCard = ({ service, isSelected, onToggle }: ServiceCardProps) => {
  const Icon = service.icon;
  
  return (
    <Box
      onClick={onToggle}
      cursor="pointer"
      borderWidth={isSelected ? "2px" : "1px"}
      borderColor={isSelected ? "brand.500" : "gray.200"}
      borderRadius="lg"
      bg="white"
      p={5}
      transition="all 0.2s"
      _hover={{
        borderColor: isSelected ? "brand.500" : "gray.400",
        transform: "translateY(-2px)",
        boxShadow: "md",
      }}
      position="relative"
    >
      <Flex justify="space-between" align="start">
        <VStack align="start" spacing={3} flex={1}>
          <HStack spacing={2}>
            <Badge
              colorScheme="blue"
              borderRadius="full"
              px={3}
              py={1}
              fontSize="xs"
              fontWeight="medium"
            >
              Service
            </Badge>
          </HStack>
          
          <Heading size="md" fontWeight="600">
            {service.title}
          </Heading>
          
          <VStack align="start" spacing={1}>
            {service.requirements.equipment && (
              <Text fontSize="sm" color="gray.700">
                <Text as="span" fontSize="sm" fontWeight="bold"> Equipment:</Text> {service.requirements.equipment}
              </Text>
            )}
            {service.requirements.experience && (
              <Text fontSize="sm" color="gray.700">
                <Text as="span" fontSize="sm" fontWeight="bold"> Experience:</Text> {service.requirements.experience}
              </Text>
            )}
            {service.requirements.license && (
              <Text fontSize="sm" color="gray.700">
                <Text as="span" fontSize="sm" fontWeight="bold"> License:</Text> {service.requirements.license}
              </Text>
            )}
            {service.requirements.physical && (
              <Text fontSize="sm" color="gray.700">
                <Text as="span" fontSize="sm" fontWeight="bold"> Physical:</Text> {service.requirements.physical}
              </Text>
            )}
            {service.requirements.availability && (
              <Text fontSize="sm" color="gray.700">
                <Text as="span" fontSize="sm" fontWeight="bold"> Availability:</Text> {service.requirements.availability}
              </Text>
            )}
          </VStack>
        </VStack>
        
        <Box ml={4}>
          <Icon size={32} color={isSelected ? "#6868f7" : "#999"} />
        </Box>
      </Flex>
    </Box>
  );
};

export const ProviderServices = forwardRef(
  (
    props: {
      onNext?: () => void;
      onServicesSelectedChange?: (hasSelection: boolean) => void;
    },
    ref: React.ForwardedRef<{ submitForm: () => Promise<void> }>,
  ) => {
    const { methods, handleSubmit } = useProviderOnboarding();
    const {
      watch,
      setValue,
      formState: { errors },
    } = methods;

    const selectedServices = (watch("services") || []) as ProviderServiceType[];
    const { onServicesSelectedChange } = props;
    
    const toggleService = (serviceType: ProviderServiceType) => {
      const currentServices = selectedServices || [];
      if (currentServices.includes(serviceType)) {
        setValue(
          "services",
          currentServices.filter((s) => s !== serviceType)
        );
      } else {
        setValue("services", [...currentServices, serviceType]);
      }
    };

    useEffect(() => {
      onServicesSelectedChange?.(selectedServices.length > 0);
    }, [selectedServices, onServicesSelectedChange]);

    useImperativeHandle(ref, () => ({
      submitForm: handleSubmit,
    }));

    return (
      <FormProvider {...methods}>
        <VStack spacing={8} align="center" w="full">
        <Box
          w="full"
          maxW="720px"
          bg="white"
          borderRadius="2xl"
          boxShadow="lg"
          p={{ base: 6, md: 10 }}
        >
          <IconButton
            aria-label="Close"
            icon={<CloseIcon />}
            variant="ghost"
            position="absolute"
            top={4}
            right={4}
            size="sm"
            onClick={() => window.history.back()}
          />

          <VStack align="start" spacing={6} w="full">
            <Box>
              <Heading size="lg" mb={2} fontWeight="700">
                Now, choose how you want to earn with SulBer?
              </Heading>
              <Text fontSize="lg">You can choose multiple services to offer.</Text>
            </Box>

            <VStack spacing={4} w="full">
              {SERVICE_CONFIGS.map((service) => (
                <ServiceCard
                  key={service.type}
                  service={service}
                  isSelected={selectedServices.includes(service.type)}
                  onToggle={() => toggleService(service.type)}
                />
              ))}
            </VStack>
          </VStack>
        </Box>
        </VStack>
      </FormProvider>
    );
  },
);
