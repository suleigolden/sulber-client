import { useRef, useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Step,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  VStack,
  useSteps,
} from "@chakra-ui/react";
import { useSearchParams } from "react-router-dom";
import { UserInformation } from "./UserInformation";
import { ProviderServices } from "./ProviderServices";
// import { ManagingYourProperty } from "./ManagingYourProperty";
// import { StayingInYourProperty } from "./StayingInYourProperty";
import { ProviderLocation } from "./ProviderLocation";
import { ChevronLeftIcon, ChevronDownIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { CustomInputField } from "~/components/fields/CustomInputField";
import { ProviderVerification } from "./ProviderVerification";
import { ProviderPublish } from "./ProviderPublish";
// import { PropertyPhotos } from "./PropertyPhotos";



const steps = [
  { title: "Location", Component: ProviderLocation },
  { title: "Services", Component: ProviderServices },
  { title: "User Information", Component: UserInformation },
  { title: "Verification", Component: ProviderVerification },
  { title: "Publish", Component: ProviderPublish },


  // { title: "Location", Component: PropertyLocation },
  // { title: "Stand Out", Component: StayingInYourProperty },
  // { title: "Photos", Component: PropertyPhotos },
  // { title: "Manage Your Property", Component: ManagingYourProperty },
];

export const ProviderOnboarding = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  // const navigate = useNavigate();

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
  const formRef = useRef<{ submitForm: () => Promise<void> }>(null);
  const SERVICES_STEP_INDEX = steps.findIndex((step) => step.title === "Services");

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
        if (activeStep !== 4) {
          goToNext();
        } 
      } catch (error) {
        console.error("Form submission error:", error);
        // You might want to show an error toast here
      } finally {
        setIsSubmitting(false);
      }
    } else {
      goToNext(); // If no form ref, just go to next step
    }
  };

  const renderStepComponent = () => {
    if (activeStep === SERVICES_STEP_INDEX) {
      return (
        <ProviderServices
          ref={formRef}
          onServicesSelectedChange={setHasSelectedServices}
        />
      );
    }

    const StepComponent = steps[activeStep].Component;
    return <StepComponent ref={formRef} />;
  };

  return (
    <Container
      maxW="container.2xl"
      py={{ base: 4, md: 10 }}
      px={{ base: 2, md: 4 }}
      bg="white"
    >
      <VStack spacing={{ base: 4, md: 8 }} w="full">
      <Box w="full" maxW="720px" bg="brand.500" color="white" borderRadius="lg" px={6} py={4}>
          <Stepper size={{ base: "sm", md: "lg" }} index={activeStep} gap="0">
            {steps.map((step, index) => (
              <Step key={index}>
                <VStack
                  spacing={{ base: 1, md: 2 }}
                  width={{ base: "150px", md: "250px" }}
                >
                  <StepIndicator
                    style={
                      index < activeStep
                        ? { backgroundColor: "white", color: "white" }
                        : { borderColor: "white" }
                    }
                  >
                    <StepStatus
                      complete={<StepIcon />}
                      incomplete={<StepNumber />}
                      active={<StepNumber />}
                    />
                  </StepIndicator>
                  <StepTitle
                    fontSize={{ base: "xs", md: "16px" }}
                    display={{ base: "none", sm: "block" }}
                  >
                    {/* {step.title} */}
                  </StepTitle>
                </VStack>
                <StepSeparator mt={{ base: 6, md: 9 }} />
              </Step>
            ))}
          </Stepper>
        </Box>
       
        <Box
          w="full"
          p={{ base: 4, md: 8 }}
          borderRadius="lg"
        >
        
          {/* Make your place stand out */}
          {/* In this step, you'll add some of the amenities your place offers, plus 5 or more photos. Then, you'll create a title and description. */}
          {renderStepComponent()}
        </Box>

        <Flex
          w="full"
          maxW="720px" 
          justify="space-between"
          // direction={{ base: "column", sm: "row" }}
          // gap={{ base: 4, sm: 0 }}
        >
          <Button
            variant="outline"
            size={{ base: "md", md: "lg" }}
            colorScheme="brand"
            onClick={goToPrevious}
            isDisabled={activeStep === 0}
            w={{ base: "full", sm: "auto" }}
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            size={{ base: "md", md: "lg" }}
            // isDisabled={activeStep === steps.length - 1}
            colorScheme="brand"
            isLoading={isSubmitting}
            isDisabled={
              activeStep === SERVICES_STEP_INDEX ? !hasSelectedServices : false
            }
            w={{ base: "full", sm: "auto" }}
          >
            {activeStep === steps.length - 1 ? "Publish" : "Next"}
          </Button>
        </Flex>
      </VStack>
    </Container>
  );
};
