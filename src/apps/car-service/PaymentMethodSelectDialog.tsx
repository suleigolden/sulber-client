import {
  Box,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { api } from "@suleigolden/sulber-api-client";
import type { SavedPaymentMethod } from "@suleigolden/sulber-api-client";
import { useSystemColor } from "~/hooks/use-system-color";
import { useUser } from "~/hooks/use-user";

/** Payment API with user passed in payloads (matches backend DTOs). */
type PaymentServiceWithUser = {
  listPaymentMethods: (data: { user: { id: string; email: string } }) => Promise<SavedPaymentMethod[]>;
  createSetupIntent: (data: { user: { id: string; email: string } }) => Promise<{ clientSecret: string }>;
  setStripeCustomerId: (data: { user: { id: string; email: string }; stripeCustomerId: string }) => Promise<{ ok: boolean }>;
};
const paymentService = api.service("payment") as unknown as PaymentServiceWithUser;

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? "";
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

function cardBrandLabel(brand: string): string {
  const b = (brand ?? "").toLowerCase();
  if (b === "visa") return "Visa";
  if (b === "mastercard") return "Mastercard";
  if (b === "amex") return "American Express";
  if (b === "discover") return "Discover";
  return brand || "Card";
}

type PaymentMethodSelectDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (paymentMethodId: string) => void;
  isSubmitting?: boolean;
};

export function PaymentMethodSelectDialog({
  isOpen,
  onClose,
  onContinue,
  isSubmitting = false,
}: PaymentMethodSelectDialogProps) {
  const { user } = useUser();
  const [paymentMethods, setPaymentMethods] = useState<SavedPaymentMethod[]>([]);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | null>(null);
  const [isLoadingPaymentMethods, setIsLoadingPaymentMethods] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const { textColor, labelColor, modalBg, borderColor } = useSystemColor();

  const fetchPaymentMethods = useCallback(async () => {
    if (!user?.id || !user?.email) return;
    setIsLoadingPaymentMethods(true);
    setError(null);
    try {
      const list = await paymentService.listPaymentMethods({
        user: { id: user.id, email: user.email },
      });
      setPaymentMethods(list);
      setSelectedPaymentMethodId(null);
    } catch (e) {
      const msg = e && typeof e === "object" && "message" in e ? String((e as { message: string }).message) : "Failed to load payment methods";
      setError(msg);
      setPaymentMethods([]);
    } finally {
      setIsLoadingPaymentMethods(false);
    }
  }, [user?.id, user?.email]);

  useEffect(() => {
    if (isOpen && user?.id && user?.email) {
      setIsAddMode(false);
      fetchPaymentMethods();
    }
  }, [isOpen, user?.id, user?.email, fetchPaymentMethods]);

  const handleContinue = () => {
    if (selectedPaymentMethodId && !isSubmitting) {
      onContinue(selectedPaymentMethodId);
    }
  };

  const handleAddSuccess = () => {
    setIsAddMode(false);
    fetchPaymentMethods();
  };

  const canContinue = !!selectedPaymentMethodId && !isSubmitting;
  const hasMethods = paymentMethods.length > 0;
  const showAddForm = stripePromise && isAddMode;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
      <ModalOverlay />
      <ModalContent bg={modalBg}>
        <ModalHeader color={textColor}>Select payment method</ModalHeader>
        <ModalBody>
          {isLoadingPaymentMethods ? (
            <VStack py={6}>
              <Spinner />
              <Text color={labelColor}>Loading payment methods...</Text>
            </VStack>
          ) : error ? (
            <Text color="red.500" fontSize="sm">
              {error}
            </Text>
          ) : showAddForm && user ? (
            stripePromise && (
              <Elements stripe={stripePromise}>
                <AddPaymentMethodForm
                  user={{ id: user.id, email: user.email }}
                  onSuccess={handleAddSuccess}
                  onCancel={() => setIsAddMode(false)}
                  labelColor={labelColor}
                  textColor={textColor}
                />
              </Elements>
            )
          ) : hasMethods ? (
            <VStack align="stretch" spacing={3}>
              <Text fontSize="sm" color={labelColor}>
                Choose a payment method to use for this request.
              </Text>
              <RadioGroup
                value={selectedPaymentMethodId ?? ""}
                onChange={(v) => setSelectedPaymentMethodId(v || null)}
              >
                <VStack align="stretch" spacing={2}>
                  {paymentMethods.map((pm) => (
                    <Box
                      key={pm.id}
                      p={3}
                      borderRadius="lg"
                      borderWidth="2px"
                      borderColor={selectedPaymentMethodId === pm.id ? "brand.500" : borderColor}
                      bg={selectedPaymentMethodId === pm.id ? "brand.50" : "transparent"}
                      cursor="pointer"
                      onClick={() => setSelectedPaymentMethodId(pm.id)}
                    >
                      <Radio value={pm.id} colorScheme="brand" size="md">
                        <Text as="span" color={textColor} fontWeight="medium">
                          {cardBrandLabel(pm.brand)} •••• {pm.last4}
                        </Text>
                        <Text as="span" fontSize="xs" color={labelColor} ml={2}>
                          Expires {String(pm.exp_month).padStart(2, "0")}/{pm.exp_year}
                        </Text>
                      </Radio>
                    </Box>
                  ))}
                </VStack>
              </RadioGroup>
              {stripePromise && (
                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="brand"
                  onClick={() => setIsAddMode(true)}
                >
                  Add payment method
                </Button>
              )}
            </VStack>
          ) : (
            <VStack align="stretch" spacing={4}>
              <Text fontSize="sm" color={labelColor}>
                No payment method found. Please add a payment method first.
              </Text>
              {stripePromise && user ? (
                <Elements stripe={stripePromise}>
                  <AddPaymentMethodForm
                    user={{ id: user.id, email: user.email }}
                    onSuccess={handleAddSuccess}
                    onCancel={onClose}
                    labelColor={labelColor}
                    textColor={textColor}
                  />
                </Elements>
              ) : (
                <>
                  <Text fontSize="xs" color={labelColor}>
                    Add payment method is not configured. Please contact support.
                  </Text>
                  <Button size="sm" variant="outline" onClick={onClose}>
                    Close
                  </Button>
                </>
              )}
            </VStack>
          )}
        </ModalBody>
        {!showAddForm && (
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            {hasMethods && (
              <Button
                colorScheme="brand"
                onClick={handleContinue}
                isDisabled={!canContinue}
                isLoading={isSubmitting}
                loadingText="Sending..."
              >
                Continue
              </Button>
            )}
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
}

type PaymentUser = { id: string; email: string };

/** Add card form; must be rendered inside <Elements stripe={stripePromise}>. */
function AddPaymentMethodForm({
  user,
  onSuccess,
  onCancel,
  labelColor,
  textColor,
}: {
  user: PaymentUser;
  onSuccess: () => void;
  onCancel: () => void;
  labelColor: string;
  textColor: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { clientSecret: secret } = await paymentService.createSetupIntent({
          user: { id: user.id, email: user.email },
        });
        if (!cancelled) setClientSecret(secret);
      } catch (e) {
        if (!cancelled) {
          setAddError(e && typeof e === "object" && "message" in e ? String((e as { message: string }).message) : "Failed to start add card");
        }
      }
    })();
    return () => { cancelled = true; };
  }, [user.id, user.email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;
    const cardEl = elements.getElement(CardElement);
    if (!cardEl) return;
    setIsAdding(true);
    setAddError(null);
    try {
      const result = await stripe.confirmCardSetup(clientSecret, {
        payment_method: { card: cardEl },
      });
      if (result.error) {
        setAddError(result.error.message ?? "Card setup failed");
        return;
      }
      const si = result.setupIntent as { customer?: string | { id?: string } } | null | undefined;
      const customerId = typeof si?.customer === "string" ? si.customer : si?.customer?.id;
      if (customerId) {
        await paymentService.setStripeCustomerId({
          user: { id: user.id, email: user.email },
          stripeCustomerId: customerId,
        });
      }
      onSuccess();
    } catch (err) {
      setAddError(err && typeof err === "object" && "message" in err ? String((err as { message: string }).message) : "Failed to add card");
    } finally {
      setIsAdding(false);
    }
  };

  if (addError && !clientSecret) {
    return (
      <VStack align="stretch" spacing={3}>
        <Text fontSize="sm" color="red.500">{addError}</Text>
        <Button size="sm" variant="outline" onClick={onCancel}>Back</Button>
      </VStack>
    );
  }

  if (!clientSecret) {
    return (
      <VStack py={4}>
        <Spinner size="sm" />
        <Text fontSize="sm" color={labelColor}>Preparing form...</Text>
      </VStack>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <VStack align="stretch" spacing={4}>
        <Box
          p={3}
          borderRadius="md"
          borderWidth="1px"
          borderColor="gray.200"
          bg="white"
          _dark={{ bg: "gray.800", borderColor: "gray.600" }}
        >
          <CardElement
            options={{
              style: {
                base: { fontSize: "16px", color: textColor },
                invalid: { color: "#fa755a" },
              },
            }}
          />
        </Box>
        {addError && (
          <Text fontSize="sm" color="red.500">{addError}</Text>
        )}
        <HStack spacing={2}>
          <Button type="button" size="sm" variant="outline" onClick={onCancel} isDisabled={isAdding}>
            Cancel
          </Button>
          <Button type="submit" size="sm" colorScheme="brand" isLoading={isAdding} loadingText="Saving...">
            Save card
          </Button>
        </HStack>
      </VStack>
    </form>
  );
}