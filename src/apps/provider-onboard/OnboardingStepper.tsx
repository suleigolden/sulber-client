import {
  Box,
  Stepper,
  Step,
  VStack,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepSeparator,
  useColorModeValue,
} from "@chakra-ui/react";

type Step = {
  title: string;
  Component: React.ComponentType<any>;
};

type OnboardingStepperProps = {
  activeStep: number;
  steps: Step[];
};
const marginLeftStyle = (steps: number) => ({
  marginLeft: steps === 0 ? "-24px" : steps === 1 ? "-24px" : "-24px",
  marginRight: steps === 0 ? "-16px" : steps === 1 ? "-17px" : "-19px",
});

export const OnboardingStepper = ({ activeStep, steps }: OnboardingStepperProps) => {
  const completedBg = useColorModeValue("brand.500", "brand.400");
  const completedBorder = useColorModeValue("white", "gray.800");
  const activeBorder = useColorModeValue("gray.800", "white");
  const inactiveBorder = useColorModeValue("brand.500", "brand.400");
  const inactiveText = useColorModeValue("gray.600", "gray.400");
  const separatorInactive = useColorModeValue("rgba(73, 72, 80, 0.3)", "rgba(255, 255, 255, 0.2)");

  return (
    <Box w="full" mt={{ base: 5, sm: 2, md: 5 }} px={{ base: 4, sm: 4, md: 4 }}>
      <Stepper size="sm" index={activeStep} gap="0" colorScheme="brand" mb={4} mt="-9px">
        {steps.map((step: Step, index: number) => (
          <Step key={index}>
            <VStack spacing={1} width="auto" minW="60px" maxW="100px">
              <StepIndicator
                bg={index < activeStep ? completedBg : "transparent"}
                borderColor={
                  index < activeStep ? completedBorder : index === activeStep ? activeBorder : inactiveBorder
                }
                color={index < activeStep ? "white" : index === activeStep ? undefined : inactiveText}
              >
                <StepStatus
                  complete={<StepIcon color="white" />}
                  incomplete={<StepNumber color="brand.500" />}
                  active={<StepNumber color="brand.500" />}
                />
              </StepIndicator>
              <StepTitle
                fontSize="xs"
                color={index === activeStep || index < activeStep ? "brand.500" : inactiveText}
                fontWeight={index === activeStep || index < activeStep ? "bold" : "normal"}
                textAlign="center"
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
                maxW="100px"
              >
                {step.title}
              </StepTitle>
            </VStack>
            {index < steps.length - 1 && (
              <StepSeparator
                borderColor={index < activeStep ? completedBg : separatorInactive}
                borderWidth="1px"
                marginLeft={marginLeftStyle(index).marginLeft}
                marginRight={marginLeftStyle(index).marginRight}
                marginTop="-24px"
                marginBottom="0"
                width="100%"
                minWidth="32px"
                flex={1}
                position="relative"
                zIndex={0}
              />
            )}
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};