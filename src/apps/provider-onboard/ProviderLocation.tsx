import {
  Box,
  VStack,
  Heading,
  Text,
  HStack,
  Circle,
} from "@chakra-ui/react";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { FormProvider } from "react-hook-form";
import { CustomInputField } from "~/components/fields/CustomInputField";
import { useProviderOnboarding } from "~/hooks/use-provider-onboarding";
import { LocationSearchInput } from "./components/LocationSearchInput";

type ProviderLocationProps = {
  onNext?: () => void;
};

export const ProviderLocation = forwardRef(
  (
    _props: ProviderLocationProps,
    ref: React.ForwardedRef<{ submitForm: () => Promise<void> }>
  ) => {
    const {
      methods,
      handleSubmit: submitOnboarding,
      isSubmitting,
      setValue,
    } = useProviderOnboarding();
    const [selectedLocation, setSelectedLocation] = useState<{
      lat: number;
      lng: number;
      address: string;
      city?: string;
      state?: string;
      country?: string;
      postalCode?: string;
    } | null>(null);
    const {
      formState: { errors },
    } = methods;

    useImperativeHandle(ref, () => ({
      submitForm: submitOnboarding,
    }));

    // Update form values when location is selected
    React.useEffect(() => {
      if (selectedLocation) {
        if (selectedLocation.city) {
          setValue('address.city', selectedLocation.city);
        }
        if (selectedLocation.state) {
          setValue('address.state', selectedLocation.state);
        }
        if (selectedLocation.country) {
          setValue('address.country', selectedLocation.country);
        }
        if (selectedLocation.postalCode) {
          setValue('address.postal_code', selectedLocation.postalCode);
        }
      }
    }, [selectedLocation, setValue]);

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
              <VStack align="start" spacing={6} w="full">
                <HStack spacing={4} align="center">
                  <Circle size="60px" bg="green.100" color="green.600">
                    <FaRegMoneyBillAlt size="28px" />
                  </Circle>
                  <Heading size="lg">Earn with SulBer</Heading>
                </HStack>
                <Text fontSize="md" color="gray.600">
                  Decide where and how you want to offer driveway car washes, snow shoveling, and parking lot cleaning.
                </Text>

                <VStack spacing={4} w="full">
                  {/* <CustomInputField
                    type="text"
                    label="Where would you like to earn?"
                    registerName="address.city"
                    isRequired={true}
                    placeholder="e.g., London, ON"
                    isError={errors?.address?.city}
                  /> */}
                   <LocationSearchInput
                        onLocationSelect={(location) => setSelectedLocation(location)}
                      />
                  <CustomInputField
                    type="text"
                    label="Referral code (optional)"
                    registerName="referral_code"
                    placeholder="Enter your SulBer referral code"
                    isError={errors?.referral_code}
                  />
                </VStack>

                <Text fontSize="sm" color="gray.600" lineHeight="tall">
                  By proceeding, I agree that SulBer, its customers, and its representatives may contact me by
                  email, phone, or SMS for service requests at this location.
                </Text>
              </VStack>
            </Box>
          </VStack>
      </FormProvider>
    );
  }
);
