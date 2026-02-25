import {
  VStack,
  Box,
  Heading,
  Text,
  Button,
  HStack,
  Icon,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { forwardRef, useImperativeHandle } from "react";
import { api, DocumentType } from "@suleigolden/sulber-api-client";
import { useUser } from "~/hooks/use-user";
import { CustomToast } from "~/hooks/CustomToast";
import { FaShieldAlt, FaCheckCircle } from "react-icons/fa";
import { OnboardingStepper } from "./OnboardingStepper";

type ProviderVerificationProps = {
  onNext?: () => void;
  activeStep: number;
  steps: any;
  onVerificationStatusChange?: (isVerified: boolean) => void;
};

export const ProviderVerification = forwardRef<
  { submitForm: () => Promise<void> },
  ProviderVerificationProps
>(({ onNext, activeStep, steps, onVerificationStatusChange }, ref) => {
  const { user } = useUser();
  const showToast = CustomToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [verificationUrl, setVerificationUrl] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationSessionId, setVerificationSessionId] = useState<string | null>(null);

  // Check for verified parameter in URL (from Stripe redirect)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("verified") === "true" && verificationSessionId) {
      checkVerificationStatus(verificationSessionId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verificationSessionId]);

  // Notify parent component about verification status
  useEffect(() => {
    onVerificationStatusChange?.(isVerified);
  }, [isVerified, onVerificationStatusChange]);

  // Check existing verification status on mount
  useEffect(() => {
    const checkExistingVerification = async () => {
      if (!user?.id) return;

      try {
        const verifications = await api
          .service("identity-verification")
          .findByUserId(user.id);

        const stripeVerification = verifications.find(
          (v) => v.provider === "STRIPE_IDENTITY"
        );

        if (stripeVerification) {
          setVerificationSessionId(stripeVerification.externalSessionId || null);

          if (stripeVerification.status === "VERIFIED") {
            setIsVerified(true);
          } else if (stripeVerification.meta?.url) {
            setVerificationUrl(stripeVerification.meta.url);
          }

          // Check status if pending
          if (
            stripeVerification.status === "PENDING" &&
            stripeVerification.externalSessionId
          ) {
            checkVerificationStatus(stripeVerification.externalSessionId);
          }
        }
      } catch (error) {
        console.error("Error checking verification:", error);
      }
    };

    checkExistingVerification();
  }, [user]);

  const checkVerificationStatus = async (sessionId: string) => {
    setIsCheckingStatus(true);
    try {
      const status = await api
        .service("identity-verification")
        .getStripeVerificationStatus(sessionId);

      if (status.verified) {
        setIsVerified(true);
        showToast("Success", "Identity verified successfully!", "success");
      } else {
        showToast("Info", "Verification is still pending. Please complete the process.", "info");
      }
    } catch (error) {
      console.error("Error checking verification status:", error);
      showToast("Error", "Failed to check verification status", "error");
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const handleStartVerification = async () => {
    if (!user?.id) {
      showToast("Error", "User not found", "error");
      return;
    }
    setIsLoading(true);
    try {
      const returnUrl = `${window.location.origin}/provider/${user.id}/provider-onboarding?step=2`;

      const response = await api
        .service("identity-verification")
        .createStripeVerificationSession({
          userId: user.id,
          returnUrl,
          documentType: "driver_license" as DocumentType,
        });

      setVerificationUrl(response.verificationSession.url);
      setVerificationSessionId(response.verificationSession.id);

      // Open Stripe verification in a new window
      window.open(response.verificationSession.url, "_blank", "width=800,height=600");

      showToast(
        "Verification Started",
        "Please complete the verification in the popup window",
        "info"
      );
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Failed to start verification";
      showToast("Error", errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckStatus = async () => {
    if (!verificationSessionId) {
      showToast("Error", "No verification session found", "error");
      return;
    }

    await checkVerificationStatus(verificationSessionId);
  };

  useImperativeHandle(ref, () => ({
    submitForm: async () => {
      if (!isVerified) {
        throw new Error("Please complete identity verification first");
      }
    },
  }));

  const cardBg = useColorModeValue("white", "gray.800");
  const mutedColor = useColorModeValue("gray.600", "gray.400");
  const infoBg = useColorModeValue("blue.50", "blue.900");
  const infoBorder = useColorModeValue("blue.500", "blue.400");
  const infoTitleColor = useColorModeValue("blue.900", "blue.100");
  const infoTextColor = useColorModeValue("blue.800", "blue.200");
  const boxBg = useColorModeValue("gray.50", "gray.700");
  const boxBorder = useColorModeValue("gray.200", "whiteAlpha.300");
  const boxTextColor = useColorModeValue("gray.700", "gray.300");
  const boxMutedColor = useColorModeValue("gray.500", "gray.400");
  const boxMutedText = useColorModeValue("gray.600", "gray.400");

  return (
    <VStack spacing={8} align="center" w="full">
      <Box
        w="full"
        maxW="720px"
        bg={cardBg}
        borderRadius="2xl"
      >
        <OnboardingStepper activeStep={activeStep} steps={steps} />
        <Box
          w="full"
          bg="brand.500"
          color="white"
          borderRadius="8px 8px 0 0"
          boxShadow="lg"
          p={{ base: 6, md: 10 }}
        >
          <HStack spacing={3} mb={3}>
            <Icon as={FaShieldAlt} color="white" boxSize={6} />
            <Heading size="lg" fontWeight="700">
              Verify your identity to earn with SulBer
            </Heading>
          </HStack>
        </Box>

        <VStack spacing={6} align="start" w="full" p={{ base: 6, md: 10 }}>
          <Box>
            <Text fontSize="md" color={mutedColor}>
              We need to verify your identity to ensure you are a legitimate
              service provider. This helps us maintain trust and safety on our
              platform.
            </Text>
          </Box>

          {isVerified ? (
            <Alert status="success" borderRadius="md">
              <AlertIcon />
              <Box flex="1">
                <AlertTitle>Identity Verified!</AlertTitle>
                <AlertDescription>
                  Your identity has been successfully verified. You can now
                  proceed to start earning with SulBer.
                </AlertDescription>
              </Box>
              <Icon as={FaCheckCircle} color="green.500" boxSize={5} />
            </Alert>
          ) : (
            <>
              <Box
                bg={infoBg}
                borderLeft="4px solid"
                borderColor={infoBorder}
                p={4}
                borderRadius="md"
                w="full"
              >
                <Text fontWeight="semibold" mb={2} color={infoTitleColor}>
                  What you'll need:
                </Text>
                <VStack align="start" spacing={2} pl={4}>
                  <Text fontSize="sm" color={infoTextColor}>
                    • A valid government-issued ID (Driver's License, Passport,
                    or National ID)
                  </Text>
                  <Text fontSize="sm" color={infoTextColor}>
                    • A device with a camera for selfie verification
                  </Text>
                  <Text fontSize="sm" color={infoTextColor}>
                    • 5-10 minutes to complete the process
                  </Text>
                </VStack>
              </Box>

              <VStack spacing={4} w="full">
                <Button
                  colorScheme="brand"
                  size="lg"
                  w="full"
                  onClick={handleStartVerification}
                  isLoading={isLoading}
                  loadingText="Starting Verification..."
                  leftIcon={<Icon as={FaShieldAlt} />}
                >
                  Start Identity Verification
                </Button>

                {verificationSessionId && (
                  <Button
                    variant="outline"
                    size="md"
                    w="full"
                    onClick={handleCheckStatus}
                    isLoading={isCheckingStatus}
                    loadingText="Checking Status..."
                  >
                    Check Verification Status
                  </Button>
                )}

                {verificationUrl && !isVerified && (
                  <Box
                    bg={boxBg}
                    p={4}
                    borderRadius="md"
                    w="full"
                    border="1px solid"
                    borderColor={boxBorder}
                  >
                    <Text fontSize="sm" color={boxTextColor} mb={2}>
                      Verification window opened. If it didn't open,{" "}
                      <Button
                        variant="link"
                        size="sm"
                        colorScheme="brand"
                        onClick={() => window.open(verificationUrl, "_blank")}
                      >
                        click here
                      </Button>{" "}
                      to open it manually.
                    </Text>
                    <Text fontSize="xs" color={boxMutedColor}>
                      Complete the verification process in the popup window, then
                      click "Check Verification Status" above.
                    </Text>
                  </Box>
                )}
              </VStack>
            </>
          )}

          <Box
            bg={boxBg}
            p={4}
            borderRadius="md"
            w="full"
            border="1px solid"
            borderColor={boxBorder}
          >
            <Text fontSize="xs" color={boxMutedText} lineHeight="tall">
              Your information is securely processed by Stripe Identity, a
              trusted identity verification service. We never store your
              document images or personal details beyond what's necessary for
              verification.
            </Text>
          </Box>
        </VStack>
      </Box>
    </VStack>
  );
});
