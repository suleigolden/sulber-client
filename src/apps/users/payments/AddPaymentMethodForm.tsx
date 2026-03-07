import {
  Box,
  Button,
  HStack,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { paymentService, type PaymentUser } from "~/apps/users/payments/payment-api";

type AddPaymentMethodFormProps = {
  user: PaymentUser;
  onSuccess: () => void;
  onCancel: () => void;
  labelColor: string;
  textColor: string;
};

/** Add card form; must be rendered inside <Elements stripe={stripePromise}>. */
export function AddPaymentMethodForm({
  user,
  onSuccess,
  onCancel,
  labelColor,
  textColor,
}: AddPaymentMethodFormProps) {
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
          setAddError(
            e && typeof e === "object" && "message" in e
              ? String((e as { message: string }).message)
              : "Failed to start add card"
          );
        }
      }
    })();
    return () => {
      cancelled = true;
    };
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
      const si = result.setupIntent as
        | { customer?: string | { id?: string } }
        | null
        | undefined;
      const customerId =
        typeof si?.customer === "string" ? si.customer : si?.customer?.id;
      if (customerId) {
        await paymentService.setStripeCustomerId({
          user: { id: user.id, email: user.email },
          stripeCustomerId: customerId,
        });
      }
      onSuccess();
    } catch (err) {
      setAddError(
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Failed to add card"
      );
    } finally {
      setIsAdding(false);
    }
  };

  if (addError && !clientSecret) {
    return (
      <VStack align="stretch" spacing={3}>
        <Text fontSize="sm" color="red.500">
          {addError}
        </Text>
        <Button size="sm" variant="outline" onClick={onCancel}>
          Back
        </Button>
      </VStack>
    );
  }

  if (!clientSecret) {
    return (
      <VStack py={4}>
        <Spinner size="sm" />
        <Text fontSize="sm" color={labelColor}>
          Preparing form...
        </Text>
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
          <Text fontSize="sm" color="red.500">
            {addError}
          </Text>
        )}
        <HStack spacing={2}>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onCancel}
            isDisabled={isAdding}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            colorScheme="brand"
            isLoading={isAdding}
            loadingText="Saving..."
          >
            Save card
          </Button>
        </HStack>
      </VStack>
    </form>
  );
}
