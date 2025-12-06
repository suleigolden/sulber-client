import { useRef, useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  VStack,
  useSteps,
} from "@chakra-ui/react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { UserInformation } from "./UserInformation";
import { ProviderServices } from "./ProviderServices";
import { ProviderLocation } from "./ProviderLocation";
import { ProviderVerification } from "./ProviderVerification";
import { useUser } from "~/hooks/use-user";



const steps = [
  { title: "Location", Component: ProviderLocation },
  { title: "Services", Component: ProviderServices },
  { title: "User", Component: UserInformation },
  { title: "Verification", Component: ProviderVerification },
];

export const ProviderOnboarding = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useUser();

  // Get initial step from URL or default to 0
  const initialStep = parseInt(searchParams.get("step") || "0");

  const {
    activeStep,
    goToNext: baseGoToNext,
    goToPrevious: baseGoToPrevious,
    setActiveStep,
  } = useSteps({
    index: initialStep,
    count: steps.length,
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasSelectedServices, setHasSelectedServices] = useState<boolean>(false);
  const [isLocationValid, setIsLocationValid] = useState<boolean>(false);
  const [isUserInfoValid, setIsUserInfoValid] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const formRef = useRef<{ submitForm: () => Promise<void> }>(null);
  const SERVICES_STEP_INDEX = steps.findIndex((step) => step.title === "Services");
  const LOCATION_STEP_INDEX = steps.findIndex((step) => step.title === "Location");
  const USER_INFO_STEP_INDEX = steps.findIndex((step) => step.title === "User");
  const VERIFICATION_STEP_INDEX = steps.findIndex((step) => step.title === "Verification");

  // Update URL when step changes
  const goToNext = () => {
    baseGoToNext();
    setSearchParams({ step: (activeStep + 1).toString() });
  };

  const goToPrevious = () => {
    baseGoToPrevious();
    setSearchParams({ step: (activeStep - 1).toString() });
  };

  // Validate and correct step on page load
  useEffect(() => {
    const currentStep = parseInt(searchParams.get("step") || "0");

    // If step is invalid, reset to 0
    if (isNaN(currentStep) || currentStep < 0 || currentStep >= steps.length) {
      setSearchParams({ step: "0" });
      setActiveStep(0);
      return;
    }

    // Ensure activeStep matches URL
    if (currentStep !== activeStep) {
      setActiveStep(currentStep);
    }
  }, [searchParams, setSearchParams, setActiveStep, activeStep]);

  const handleNext = async () => {
    if (formRef.current) {
      try {
        setIsSubmitting(true);
        await formRef.current.submitForm();
        
        // If it's the last step (Publish button), redirect to dashboard
        if (activeStep === steps.length - 1) {
          if (user?.id) {
            navigate(`/provider/${user.id}/dashboard`);
          } else {
            console.error("User ID not found, cannot redirect to dashboard");
          }
        } else {
          goToNext();
        }
      } catch (error) {
        console.error("Form submission error:", error);
        // You might want to show an error toast here
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // If no form ref, just go to next step (shouldn't happen on last step)
      if (activeStep === steps.length - 1) {
        if (user?.id) {
          navigate(`/provider/${user.id}/dashboard`);
        }
      } else {
        goToNext();
      }
    }
  };

  const renderStepComponent = () => {
    if (activeStep === SERVICES_STEP_INDEX) {
      return (
        <ProviderServices
          ref={formRef}
          onServicesSelectedChange={setHasSelectedServices}
          activeStep={activeStep}
          steps={steps}
        />
      );
    }

    const StepComponent = steps[activeStep].Component;
    return (
      <StepComponent
        ref={formRef}
        activeStep={activeStep}
        steps={steps}
        onLocationValidChange={activeStep === LOCATION_STEP_INDEX ? setIsLocationValid : undefined}
        onUserInfoValidChange={activeStep === USER_INFO_STEP_INDEX ? setIsUserInfoValid : undefined}
        onVerificationStatusChange={activeStep === VERIFICATION_STEP_INDEX ? setIsVerified : undefined}
        shouldDisplayStepper={true}
      />
    );
  };

  return (
    <Container
      maxW="container.2xl"
      py={{ base: 2, sm: 4, md: 10 }}
      px={{ base: 2, sm: 3, md: 4 }}
      bg="white"
      minH="100vh"
    >
      <VStack spacing={{ base: 3, sm: 4, md: 8 }} w="full" align="stretch">
        <Box
          w="full"
          p={{ base: 2, sm: 3, md: 4, lg: 8 }}
          borderRadius="lg"
          overflow="hidden"
        >
          {renderStepComponent()}
        </Box>
        <VStack spacing={8} align="center" w="full">
        <Box
          w="full"
          maxW="720px"
          bg="white"
          borderRadius="2xl"
        >

        <Flex
          w="full"
          maxW={{ base: "100%", sm: "720px" }}
          justify="space-between"
          direction={{ base: "column", sm: "row" }}
          gap={{ base: 3, sm: 4 }}
          align="stretch"
          px={{ base: 2, sm: 0 }}
        >
          <Button
            variant="outline"
            size={{ base: "md", sm: "md", md: "lg" }}
            colorScheme="brand"
            onClick={goToPrevious}
            isDisabled={activeStep === 0}
            w={{ base: "full", sm: "auto" }}
            minW={{ base: "full", sm: "120px" }}
            order={{ base: 2, sm: 1 }}
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            size={{ base: "md", sm: "md", md: "lg" }}
            colorScheme="brand"
            isLoading={isSubmitting}
            isDisabled={
              activeStep === SERVICES_STEP_INDEX
                ? !hasSelectedServices
                : activeStep === LOCATION_STEP_INDEX
                ? !isLocationValid
                : activeStep === USER_INFO_STEP_INDEX
                ? !isUserInfoValid
                : activeStep === VERIFICATION_STEP_INDEX
                ? !isVerified
                : false
            }
            w={{ base: "full", sm: "auto" }}
            minW={{ base: "full", sm: "120px" }}
            order={{ base: 1, sm: 2 }}
          >
            {activeStep === steps.length - 1 ? "Publish" : "Next"}
          </Button>
        </Flex>
        </Box>
        </VStack>
      </VStack>
    </Container>
  );
};
