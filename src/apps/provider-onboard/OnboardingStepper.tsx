import {
  Box,
  Flex,
  Progress,
  Text,
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

export const OnboardingStepper = ({ activeStep, steps }: OnboardingStepperProps) => {
  const trackBg = useColorModeValue("gray.200", "whiteAlpha.300");
  const labelColor = useColorModeValue("gray.700", "gray.300");
  const stepCountColor = useColorModeValue("gray.600", "gray.400");

  const currentStepTitle = steps[activeStep]?.title ?? "";
  const stepLabel = `Step ${activeStep + 1} of ${steps.length}`;
  const progressValue = steps.length > 0 ? ((activeStep + 1) / steps.length) * 100 : 0;

  return (
    <Box w="full" mt={{ base: 5, sm: 2, md: 5 }} mb={4} px={{ base: 4, sm: 4, md: 4 }}>
      <Flex justify="space-between" align="center" mb={3}>
        <Text
          fontSize={{ base: "sm", md: "md" }}
          fontWeight="600"
          color={labelColor}
        >
          {currentStepTitle}
        </Text>
        <Text
          fontSize={{ base: "xs", md: "sm" }}
          color={stepCountColor}
        >
          {stepLabel}
        </Text>
      </Flex>
      <Progress
        value={progressValue}
        size="sm"
        colorScheme="brand"
        borderRadius="full"
        bg={trackBg}
        sx={{
          "& > div": {
            borderRadius: "full",
          },
        }}
      />
    </Box>
  );
};
