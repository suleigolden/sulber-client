import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { FormProvider } from "react-hook-form";
import { useProviderOnboarding } from "~/hooks/use-provider-onboarding";
import { ProviderServiceType } from "@suleigolden/sulber-api-client";
import { FaCar, FaParking, FaSnowflake } from "react-icons/fa";
import { OnboardingStepper } from "./OnboardingStepper";

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
      borderRadius={{ base: "md", md: "lg" }}
      bg="white"
      p={{ base: 3, sm: 4, md: 5 }}
      transition="all 0.2s"
      _hover={{
        borderColor: isSelected ? "brand.500" : "gray.400",
        transform: { base: "none", md: "translateY(-2px)" },
        boxShadow: { base: "sm", md: "md" },
      }}
      position="relative"
      w="full"
    >
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
            </HStack>
            <Spacer />
            <Box
              ml={"90px"}
              alignSelf={{ base: "flex-start", sm: "flex-start" }}
              flexShrink={0}
              display={{ base: "block", sm: "none" }}
            >
              <Icon size={24} color={isSelected ? "#6868f7" : "#999"} />
            </Box>
          </Flex>

          <Heading size={{ base: "sm", sm: "md" }} fontWeight="600">
            {service.title}
          </Heading>

          <VStack align="start" spacing={{ base: 0.5, sm: 1 }} w="full">
            {service.requirements.equipment && (
              <Text fontSize={{ base: "xs", sm: "sm" }} color="gray.700" lineHeight="tall">
                <Text as="span" fontSize={{ base: "xs", sm: "sm" }} fontWeight="bold"> Equipment:</Text> {service.requirements.equipment}
              </Text>
            )}
            {service.requirements.experience && (
              <Text fontSize={{ base: "xs", sm: "sm" }} color="gray.700" lineHeight="tall">
                <Text as="span" fontSize={{ base: "xs", sm: "sm" }} fontWeight="bold"> Experience:</Text> {service.requirements.experience}
              </Text>
            )}
            {service.requirements.license && (
              <Text fontSize={{ base: "xs", sm: "sm" }} color="gray.700" lineHeight="tall">
                <Text as="span" fontSize={{ base: "xs", sm: "sm" }} fontWeight="bold"> License:</Text> {service.requirements.license}
              </Text>
            )}
            {service.requirements.physical && (
              <Text fontSize={{ base: "xs", sm: "sm" }} color="gray.700" lineHeight="tall">
                <Text as="span" fontSize={{ base: "xs", sm: "sm" }} fontWeight="bold"> Physical:</Text> {service.requirements.physical}
              </Text>
            )}
            {service.requirements.availability && (
              <Text fontSize={{ base: "xs", sm: "sm" }} color="gray.700" lineHeight="tall">
                <Text as="span" fontSize={{ base: "xs", sm: "sm" }} fontWeight="bold"> Availability:</Text> {service.requirements.availability}
              </Text>
            )}
          </VStack>
        </VStack>

        <Box
          ml={{ base: 0, sm: 4 }}
          alignSelf={{ base: "flex-start", sm: "flex-start" }}
          flexShrink={0}
          display={{ base: "none", sm: "block" }}
        >
          <Icon size={24} color={isSelected ? "#6868f7" : "#999"} />
        </Box>
      </Flex>
    </Box>
  );
};

type ProviderServicesProps = {
  onNext?: () => void;
  onServicesSelectedChange?: (hasSelection: boolean) => void;
  activeStep: number;
  steps: any;
};
export const ProviderServices = forwardRef(
  (
    props: ProviderServicesProps,
    ref: React.ForwardedRef<{ submitForm: () => Promise<void> }>
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
        <VStack spacing={{ base: 4, sm: 6, md: 8 }} align="center" w="full">
          <Box
            w="full"
            maxW={{ base: "100%", sm: "720px" }}
            bg="white"
            borderRadius={{ base: "xl", md: "2xl" }}
            overflow="hidden"
          >
            <OnboardingStepper activeStep={props.activeStep} steps={props.steps} />
            <Box
              w="full"
              bg="brand.500"
              color="white"
              borderRadius={{ base: "0", md: "8px 8px 0 0" }}
              boxShadow="lg"
              p={{ base: 4, sm: 5, md: 6, lg: 10 }}
            >
              <Heading size={{ base: "sm", sm: "md" }} mb={{ base: 1, md: 2 }} fontWeight="700">
                Now, choose how you want to earn with SulBer?
              </Heading>
              <Text fontSize={{ base: "sm", sm: "md", md: "lg" }}>
                You can choose multiple services to offer.
              </Text>
            </Box>

            <VStack
              align="start"
              spacing={{ base: 4, sm: 5, md: 6 }}
              w="full"
              p={{ base: 3, sm: 4, md: 6, lg: 10 }}
              boxShadow="lg"
            >
              <VStack spacing={{ base: 3, sm: 4 }} w="full" p={{ base: 0, sm: 2, md: 4, lg: 6 }}>
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
