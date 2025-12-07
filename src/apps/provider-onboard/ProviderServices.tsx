import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Flex,
  Spacer,
  SimpleGrid,
} from "@chakra-ui/react";
import { forwardRef, useEffect, useImperativeHandle, useMemo } from "react";
import { FormProvider } from "react-hook-form";
import { useProviderOnboarding } from "~/hooks/use-provider-onboarding";
import { api, ProviderProfile, ProviderServiceType, ProviderServiceTypesList } from "@suleigolden/sulber-api-client";
import { FaCar, FaParking, FaSnowflake, FaHome, FaTree, FaLeaf } from "react-icons/fa";
import { OnboardingStepper } from "./OnboardingStepper";
import { useUser } from "~/hooks/use-user";
import { CustomToast } from "~/hooks/CustomToast";
import { useProviderProfile } from "~/hooks/use-provider-profile";

type ServiceConfig = {
  type: ProviderServiceType;
  title: string;
  icon: React.ElementType;
  requirements: {
    equipment?: string;
    physical?: string;
    availability?: string;
    experience?: string;
    license?: string;
  };
};

// Map service types to icons
const getServiceIcon = (serviceType: ProviderServiceType): React.ElementType => {
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
  return iconMap[serviceType] || FaCar;
};

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
  shouldDisplayStepper?: boolean;
  isProviderProfileSettings?: boolean;
};
export const ProviderServices = forwardRef(
  (
    props: ProviderServicesProps,
    ref: React.ForwardedRef<{ submitForm: () => Promise<void> }>,
  ) => {
    const { providerProfile } = useProviderProfile();
    const showToast = CustomToast();
    const { methods, handleSubmit, setValue } = useProviderOnboarding();
    const {
      watch,
      formState: { errors },
    } = methods;

    const selectedServices = (watch("services") || []) as ProviderServiceType[];
    const { onServicesSelectedChange, isProviderProfileSettings } = props;
    

    // Map ProviderServiceTypesList to ServiceConfig format
    const SERVICE_CONFIGS: ServiceConfig[] = useMemo(() => {
      return ProviderServiceTypesList.services.map((service) => ({
        type: service.type as ProviderServiceType,
        title: service.title,
        icon: getServiceIcon(service.type as ProviderServiceType),
        requirements: {
          equipment: service.requirements_for_provider?.equipment,
          experience: service.requirements_for_provider?.experience,
          license: service.requirements_for_provider?.license,
          physical: service.requirements_for_provider?.physical,
          availability: service.requirements_for_provider?.availability,
        },
      }));
    }, []);

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

    // Update services from form to provider profile settings page
    const updateServices = async (services: ProviderServiceType[]) => {
      try {
        if (!services || services.length === 0) {
          showToast('Error', 'Please select at least one service', 'error');
          return;
        }
        if (providerProfile?.id && services) {
          // Only send the services field for update - userId is a foreign key and shouldn't be updated
          await api.service('provider-profile').update(providerProfile.id as string, {
            services: services,
          });
          showToast('Success', 'Services updated successfully', 'success');
        }
      } catch (error) {
        console.error(error);
        showToast('Error', 'Failed to update services', 'error');
      }
    };

    // Custom submit function that conditionally uses updateServices or handleSubmit
    const submitForm = async () => {
      if (isProviderProfileSettings) {
        await updateServices(selectedServices);
      } else {
        await handleSubmit();
      }
    };

    useEffect(() => {
      onServicesSelectedChange?.(selectedServices.length > 0);
    }, [selectedServices, onServicesSelectedChange]);

    useImperativeHandle(ref, () => ({
      submitForm,
    }));

    return (
      <FormProvider {...methods}>
        <VStack spacing={{ base: 4, sm: 6, md: 8 }} align="center" w="full">
          <Box
            w="full"
            // maxW={{ base: "100%", sm: "720px" }}
            bg="white"
            borderRadius={{ base: "xl", md: "2xl" }}
            overflow="hidden"
          >
            {props.shouldDisplayStepper && <OnboardingStepper activeStep={props.activeStep} steps={props.steps} />}
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
              {/* Services List */}
              <SimpleGrid
                columns={{ base: 1, md: 2 }}
                spacing={{ base: 3, sm: 4, md: 5 }}
                w="full"
                p={{ base: 0, sm: 2, md: 4, lg: 6 }}
              >
                {SERVICE_CONFIGS.map((service) => (
                  <ServiceCard
                    key={service.type}
                    service={service}
                    isSelected={selectedServices.includes(service.type)}
                    onToggle={() => toggleService(service.type)}
                  />
                ))}
              </SimpleGrid>
            </VStack>
          </Box>
        </VStack>
      </FormProvider>
    );
  },
);
