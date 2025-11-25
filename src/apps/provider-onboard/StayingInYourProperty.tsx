import {
  Box,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useProviderOnboarding } from "~/hooks/use-provider-onboarding";
import { FormProvider } from "react-hook-form";
import { AmenitySelector } from "./AmenitySelector";



export const StayingInYourProperty = forwardRef(
  (
    props: { onNext?: () => void },
    ref: React.ForwardedRef<{ submitForm: () => Promise<void> }>,
  ) => {
    const { methods, handleSubmit, selectedAmenities, setSelectedAmenities, setValue } = useProviderOnboarding();
    
    useImperativeHandle(ref, () => ({
      submitForm: handleSubmit,
    }));

    useEffect(() => {
      setValue("amenities", selectedAmenities);
    }, [selectedAmenities, setValue]);  

    return (
      <FormProvider {...methods}>
        <VStack
          align="start"
          spacing={8}
          maxW="900px"
          w="full"
          p={8}
          bg="white"
        >
          <Box>
            <Heading size="lg">
              Show co-owners or tenants what your place has to offer
            </Heading>
            <Text fontSize="md" color="gray.600" mt={2}>
              Make your place stand out In this step
            </Text>
          </Box>

          <Box>
            
            <AmenitySelector
              selectedAmenities={selectedAmenities}
              setSelectedAmenities={setSelectedAmenities}
            />
          
          </Box>
        </VStack>
      </FormProvider>
    );
  },
);
