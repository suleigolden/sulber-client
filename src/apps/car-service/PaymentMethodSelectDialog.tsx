import {
  Box,
  Button,
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
import { Elements } from "@stripe/react-stripe-js";
import { useSystemColor } from "~/hooks/use-system-color";
import { AddPaymentMethodForm } from "~/apps/users/payments/AddPaymentMethodForm";
import { usePaymentMethods, cardBrandLabel } from "~/hooks/usePaymentMethods";
import { stripePromise } from "~/apps/users/payments/stripe";

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
  const {
    user,
    paymentMethods,
    selectedPaymentMethodId,
    setSelectedPaymentMethodId,
    isLoadingPaymentMethods,
    error,
    isAddMode,
    setIsAddMode,
    handleAddSuccess,
    hasMethods,
  } = usePaymentMethods(isOpen);

  const { textColor, labelColor, modalBg, borderColor } = useSystemColor();

  const handleContinue = () => {
    if (selectedPaymentMethodId && !isSubmitting) {
      onContinue(selectedPaymentMethodId);
    }
  };

  const canContinue = !!selectedPaymentMethodId && !isSubmitting;
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
