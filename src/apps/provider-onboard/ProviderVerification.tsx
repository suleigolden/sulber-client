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
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { forwardRef, useImperativeHandle } from "react";
import { api, DocumentType } from "@suleigolden/sulber-api-client";
import { useUser } from "~/hooks/use-user";
import { CustomToast } from "~/hooks/CustomToast";
import { FaShieldAlt, FaCheckCircle } from "react-icons/fa";

type ProviderVerificationProps = {
  onNext?: () => void;
};

export const ProviderVerification = forwardRef<
  { submitForm: () => Promise<void> },
  ProviderVerificationProps
>(({ onNext }, ref) => {
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
      const returnUrl = `${window.location.origin}/provider/${user.id}/provider-onboard?step=4`;

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
      // Verification is complete, allow form submission
    },
  }));

  return (
    <VStack spacing={8} align="center" w="full">
      <Box
        w="full"
        maxW="720px"
        bg="white"
        borderRadius="2xl"
        boxShadow="lg"
        p={{ base: 6, md: 10 }}
      >
        <VStack spacing={6} align="start" w="full">
          <Box>
            <HStack spacing={3} mb={3}>
              <Icon as={FaShieldAlt} color="brand.500" boxSize={6} />
              <Heading size="lg" fontWeight="700">
                Verify your identity to earn with SulBer
              </Heading>
            </HStack>
            <Text fontSize="md" color="gray.600">
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
                bg="blue.50"
                borderLeft="4px solid"
                borderColor="blue.500"
                p={4}
                borderRadius="md"
                w="full"
              >
                <Text fontWeight="semibold" mb={2} color="blue.900">
                  What you'll need:
                </Text>
                <VStack align="start" spacing={2} pl={4}>
                  <Text fontSize="sm" color="blue.800">
                    • A valid government-issued ID (Driver's License, Passport,
                    or National ID)
                  </Text>
                  <Text fontSize="sm" color="blue.800">
                    • A device with a camera for selfie verification
                  </Text>
                  <Text fontSize="sm" color="blue.800">
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
                    bg="gray.50"
                    p={4}
                    borderRadius="md"
                    w="full"
                    border="1px solid"
                    borderColor="gray.200"
                  >
                    <Text fontSize="sm" color="gray.700" mb={2}>
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
                    <Text fontSize="xs" color="gray.500">
                      Complete the verification process in the popup window, then
                      click "Check Verification Status" above.
                    </Text>
                  </Box>
                )}
              </VStack>
            </>
          )}

          <Box
            bg="gray.50"
            p={4}
            borderRadius="md"
            w="full"
            border="1px solid"
            borderColor="gray.200"
          >
            <Text fontSize="xs" color="gray.600" lineHeight="tall">
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
