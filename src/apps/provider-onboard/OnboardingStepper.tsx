import { 
    Stepper, 
    Step, 
    VStack, 
    StepIndicator, 
    StepStatus, 
    StepIcon, 
    StepNumber, 
    StepTitle, 
    StepSeparator,
    Box } from "@chakra-ui/react";

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
  return (
    <Box w="full" mt={{ base: 5, sm: 2, md: 5 }} px={{ base: 4, sm: 4, md: 4 }}>
    <Stepper size="sm" index={activeStep} gap="0" colorScheme="whiteAlpha" mb={4} mt="-9px">
    {steps.map((step: Step, index: number) => (
      <Step key={index}>
        <VStack spacing={1} width="auto" minW="60px" maxW="100px">
          <StepIndicator
            style={
              index < activeStep
                ? { backgroundColor: "#6868f7", color: "white", borderColor: "white" }
                : index === activeStep
                ? { backgroundColor: "transparent", borderColor: "#000" }
                : { backgroundColor: "transparent", color: "white", borderColor: "#6868f7" }
            }
          >
            <StepStatus
              complete={<StepIcon color="white" />}
              incomplete={<StepNumber color="brand.500" />}
              active={<StepNumber color="brand.500" />}
            />
          </StepIndicator>
          <StepTitle
            fontSize="xs"
            color="brand.500"
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
            style={{ 
              borderColor: index < activeStep ? "#6868f7" : "rgba(73, 72, 80, 0.3)",
              borderWidth: "1px",
              ...marginLeftStyle(index),
              marginTop: "-24px",
              marginBottom: "0",
              width: "100%",
              minWidth: "32px",
              flex: "1",
              position: "relative",
              zIndex: 0,
            }} 
          />
        )}
      </Step>
    ))}
    </Stepper>
    </Box>
  );
};