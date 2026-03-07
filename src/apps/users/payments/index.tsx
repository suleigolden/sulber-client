import React, { useState, useRef } from "react";
import {
  Container,
  Heading,
  Box,
  VStack,
  Text,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
  IconButton,
  Divider,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Select,
  Link,
  Radio,
  RadioGroup,
  Stack,
  Spinner,
  useBreakpointValue,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { Elements } from "@stripe/react-stripe-js";
import { FiBell, FiMoreVertical } from "react-icons/fi";
import { useSystemColor } from "~/hooks/use-system-color";
import { CustomToast } from "~/hooks/CustomToast";
import { usePaymentMethods, cardBrandLabel } from "~/hooks/usePaymentMethods";
import { AddPaymentMethodForm } from "./AddPaymentMethodForm";
import { paymentService } from "./payment-api";
import { stripePromise } from "./stripe";

const PAYOUT_OPTIONS = [
  { value: "bank_cad", label: "Bank account in CAD", details: ["3-5 business days", "No fees"], icon: "bank" },
  { value: "paypal_cad", label: "PayPal in CAD", details: ["1 business day", "PayPal fees may apply"], icon: "paypal" },
  { value: "paypal_usd", label: "PayPal in USD", details: ["1 business day", "PayPal fees may apply"], icon: "paypal" },
  { value: "payoneer_usd", label: "Payoneer in USD", details: ["Prepaid debit Mastercard", "24 hours or less", "Payoneer fees may apply"], icon: "payoneer" },
];

function PaymentMethodRow({
  brand,
  last4,
  expMonth,
  expYear,
  onSetDefault,
  onRemove,
  isRemoving,
  isSettingDefault,
}: {
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  onSetDefault?: () => void;
  onRemove?: () => void;
  isRemoving?: boolean;
  isSettingDefault?: boolean;
}) {
  const { headingColor, mutedTextColor, borderColor, linkColor } = useSystemColor();
  const exp = `${String(expMonth).padStart(2, "0")}/${expYear}`;
  return (
    <Flex
      align="center"
      justify="space-between"
      py={4}
      borderBottomWidth="1px"
      borderColor={borderColor}
      _last={{ borderBottomWidth: 0 }}
    >
      <Flex align="center" gap={4}>
        <Flex
          align="center"
          justify="center"
          w="48px"
          h="32px"
          bg="blue.600"
          color="white"
          borderRadius="md"
          fontSize="xs"
          fontWeight="bold"
        >
          {brand.toUpperCase()}
        </Flex>
        <Box>
          <Text fontWeight="600" color={headingColor} fontSize="md">
            {cardBrandLabel(brand)} •••• {last4}
          </Text>
          <Text fontSize="sm" color={mutedTextColor}>
            Expiration: {exp}
          </Text>
        </Box>
      </Flex>
      <Menu placement="bottom-end">
        <MenuButton
          as={IconButton}
          aria-label="Options"
          variant="outline"
          size="sm"
          icon={<FiMoreVertical />}
          borderColor="blue.500"
          borderRadius="md"
          isDisabled={isRemoving || isSettingDefault}
        />
        <MenuList minW="140px" py={1}>
          <MenuItem
            onClick={onSetDefault}
            textDecoration="underline"
            color={linkColor}
            fontSize="sm"
            isDisabled={isSettingDefault}
            closeOnSelect
          >
            {isSettingDefault ? "Setting default…" : "Set as default"}
          </MenuItem>
          <MenuItem
            onClick={onRemove}
            textDecoration="underline"
            color={linkColor}
            fontSize="sm"
            isDisabled={isRemoving}
            closeOnSelect
          >
            {isRemoving ? "Removing…" : "Remove"}
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
}

function AddPayoutMethodModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { headingColor, bodyColor, labelColor, borderColor, linkColor } = useSystemColor();
  const [country, setCountry] = useState("CA");
  const [method, setMethod] = useState("");
  const primaryButtonBg = useColorModeValue("gray.800", "whiteAlpha.200");
  const primaryButtonColor = useColorModeValue("white", "white");
  const primaryButtonHover = useColorModeValue("gray.700", "whiteAlpha.300");

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color={headingColor}>Let's add a payout method</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Text color={bodyColor} mb={6} fontSize="sm">
            To start, let us know where you'd like us to send your money.
          </Text>

          <FormControl mb={6}>
            <FormLabel color={labelColor}>Billing country/region</FormLabel>
            <Select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Billing country/region"
              borderColor={borderColor}
            >
              <option value="CA">Canada</option>
              <option value="US">United States</option>
            </Select>
            <Text fontSize="sm" color={bodyColor} mt={2}>
              This is where you opened your financial account.{" "}
              <Link href="#" color={linkColor}>
                More info
              </Link>
            </Text>
          </FormControl>

          <FormControl>
            <FormLabel color={labelColor}>How would you like to get paid?</FormLabel>
            <RadioGroup value={method} onChange={setMethod} mt={2}>
              <Stack spacing={0} borderWidth="1px" borderColor={borderColor} borderRadius="lg" overflow="hidden">
                {PAYOUT_OPTIONS.map((opt) => (
                  <Box
                    key={opt.value}
                    p={4}
                    borderBottomWidth="1px"
                    borderColor={borderColor}
                    _last={{ borderBottomWidth: 0 }}
                  >
                    <Flex align="flex-start" gap={4}>
                      <Box flexShrink={0} w="40px" h="40px" bg="gray.100" borderRadius="md" />
                      <Box flex={1}>
                        <Text fontWeight="600" color={headingColor} fontSize="md">
                          {opt.label}
                        </Text>
                        <VStack align="stretch" spacing={0} mt={1}>
                          {opt.details.map((d) => (
                            <Text key={d} fontSize="sm" color={bodyColor}>
                              • {d}
                            </Text>
                          ))}
                        </VStack>
                      </Box>
                      <Radio value={opt.value} mt={1} />
                    </Flex>
                  </Box>
                ))}
              </Stack>
            </RadioGroup>
          </FormControl>

          <Button
            bg={primaryButtonBg}
            color={primaryButtonColor}
            _hover={{ bg: primaryButtonHover }}
            size="lg"
            w="full"
            mt={6}
            isDisabled={!method}
            onClick={onClose}
          >
            Continue
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export const PaymentsSettings = () => {
  const {
    headingColor,
    bodyColor,
    labelColor,
    borderColor,
    linkColor,
    mutedTextColor,
    modalBg,
  } = useSystemColor();
  const { isOpen: isPayoutModalOpen, onOpen: onPayoutModalOpen, onClose: onPayoutModalClose } = useDisclosure();
  const { isOpen: isAddPaymentOpen, onOpen: onAddPaymentOpen, onClose: onAddPaymentClose } = useDisclosure();

  const showToast = CustomToast();
  const {
    user,
    paymentMethods,
    isLoadingPaymentMethods,
    error: paymentMethodsError,
    handleAddSuccess,
    fetchPaymentMethods,
  } = usePaymentMethods(true);

  const [removingId, setRemovingId] = useState<string | null>(null);
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);
  const [paymentMethodToRemove, setPaymentMethodToRemove] = useState<string | null>(null);
  const { isOpen: isRemoveConfirmOpen, onOpen: onRemoveConfirmOpen, onClose: onRemoveConfirmClose } = useDisclosure();
  const removeConfirmCancelRef = useRef<HTMLButtonElement>(null);

  const handleSetDefault = async (paymentMethodId: string) => {
    if (!user?.id || !user?.email) return;
    setSettingDefaultId(paymentMethodId);
    try {
      await paymentService.setDefaultPaymentMethod({
        user: { id: user.id, email: user.email },
        paymentMethodId,
      });
      showToast("Success", "Default payment method updated", "success");
      fetchPaymentMethods();
    } catch (e) {
      const msg =
        e && typeof e === "object" && "message" in e
          ? String((e as { message: string }).message)
          : "Failed to set default payment method";
      showToast("Error", msg, "error");
    } finally {
      setSettingDefaultId(null);
    }
  };

  const handleRemoveClick = (paymentMethodId: string) => {
    setPaymentMethodToRemove(paymentMethodId);
    onRemoveConfirmOpen();
  };

  const handleRemoveCard = async () => {
    if (!paymentMethodToRemove || !user?.id || !user?.email) return;
    setRemovingId(paymentMethodToRemove);
    onRemoveConfirmClose();
    try {
      await paymentService.removePaymentMethod({
        user: { id: user.id, email: user.email },
        paymentMethodId: paymentMethodToRemove,
      });
      showToast("Success", "Payment method removed", "success");
      fetchPaymentMethods();
    } catch (e) {
      const msg =
        e && typeof e === "object" && "message" in e
          ? String((e as { message: string }).message)
          : "Failed to remove payment method";
      showToast("Error", msg, "error");
    } finally {
      setRemovingId(null);
      setPaymentMethodToRemove(null);
    }
  };

  const tabSize = useBreakpointValue({ base: "sm", md: "md" });
  const activeTabBorderColor = useColorModeValue("gray.900", "white");
  const primaryButtonBg = useColorModeValue("gray.800", "whiteAlpha.200");
  const primaryButtonColor = useColorModeValue("white", "white");
  const primaryButtonHover = useColorModeValue("gray.700", "whiteAlpha.300");

  return (
    <Container maxW="1200px" px={{ base: 4, sm: 6, md: 8 }} py={{ base: 4, sm: 5, md: 8 }}>
      <VStack align="stretch" spacing={{ base: 4, md: 6 }} w="full">
        <Heading size={{ base: "md", md: "lg" }} fontWeight="bold" color={headingColor}>
          Payments
        </Heading>

        <Tabs variant="line" colorScheme="gray" w="full">
          <TabList borderBottomWidth="2px" borderColor={borderColor} gap={6}>
            <Tab
              _selected={{
                color: headingColor,
                fontWeight: "bold",
                borderColor: activeTabBorderColor,
                borderBottomWidth: "2px",
              }}
              color={mutedTextColor}
              borderBottomWidth="2px"
              borderColor="transparent"
              mb="-2px"
              fontSize={tabSize}
            >
              Payments
            </Tab>
            <Tab
              _selected={{
                color: headingColor,
                fontWeight: "bold",
                borderColor: activeTabBorderColor,
                borderBottomWidth: "2px",
              }}
              color={mutedTextColor}
              borderBottomWidth="2px"
              borderColor="transparent"
              mb="-2px"
              fontSize={tabSize}
            >
              Payouts
            </Tab>
          </TabList>

          <TabPanels pt={6}>
            {/* Payments tab */}
            <TabPanel px={0}>
              <VStack align="stretch" spacing={8}>
                <Box>
                  <Heading size="sm" fontWeight="bold" color={headingColor} mb={1}>
                    Your payments
                  </Heading>
                  <Text color={bodyColor} fontSize="sm" mb={4}>
                    Keep track of all your payments and refunds.
                  </Text>
                  <Button
                    bg={primaryButtonBg}
                    color={primaryButtonColor}
                    _hover={{ bg: primaryButtonHover }}
                    size="md"
                    borderRadius="md"
                  >
                    Manage payments
                  </Button>
                </Box>

                <Divider borderColor={borderColor} />

                <Box>
                  <Heading size="sm" fontWeight="bold" color={headingColor} mb={1}>
                    Payment methods
                  </Heading>
                  <Text color={bodyColor} fontSize="sm" mb={4}>
                    Add and manage your payment methods using our secure payment system.
                  </Text>
                  {paymentMethodsError && (
                    <Text color="red.500" fontSize="sm" mb={3}>
                      {paymentMethodsError}
                    </Text>
                  )}
                  <Box
                    borderWidth="1px"
                    borderColor={borderColor}
                    borderRadius="lg"
                    overflow="hidden"
                    bg={modalBg}
                    p={4}
                  >
                    {isLoadingPaymentMethods ? (
                      <Flex py={8} justify="center">
                        <Spinner />
                      </Flex>
                    ) : paymentMethods.length === 0 ? (
                      <Text py={6} px={4} color={mutedTextColor} fontSize="sm">
                        No payment methods yet. Add one below.
                      </Text>
                    ) : (
                      paymentMethods.map((pm) => (
                        <PaymentMethodRow
                          key={pm.id}
                          brand={pm.brand}
                          last4={pm.last4}
                          expMonth={pm.exp_month}
                          expYear={pm.exp_year}
                          onSetDefault={() => handleSetDefault(pm.id)}
                          onRemove={() => handleRemoveClick(pm.id)}
                          isRemoving={removingId === pm.id}
                          isSettingDefault={settingDefaultId === pm.id}
                        />
                      ))
                    )}
                  </Box>
                  {stripePromise && user ? (
                    <Button
                      bg={primaryButtonBg}
                      color={primaryButtonColor}
                      _hover={{ bg: primaryButtonHover }}
                      size="md"
                      borderRadius="md"
                      mt={4}
                      onClick={onAddPaymentOpen}
                    >
                      Add payment method
                    </Button>
                  ) : (
                    <Text fontSize="xs" color={mutedTextColor} mt={2}>
                      Add payment method is not configured. Please contact support.
                    </Text>
                  )}
                </Box>
              </VStack>
            </TabPanel>

            {/* Payouts tab */}
            <TabPanel px={0}>
              <VStack align="stretch" spacing={8}>
                <Box
                  borderWidth="1px"
                  borderColor={borderColor}
                  borderRadius="lg"
                  p={5}
                  bg={modalBg}
                >
                  <Flex gap={4} align="flex-start">
                    <Flex
                      flexShrink={0}
                      w="48px"
                      h="48px"
                      bg="blue.500"
                      color="white"
                      borderRadius="full"
                      align="center"
                      justify="center"
                    >
                      <FiBell size={24} />
                    </Flex>
                    <Box>
                      <Text fontWeight="bold" color={headingColor} fontSize="md" mb={1}>
                        Add payout and account info
                      </Text>
                      <Text color={bodyColor} fontSize="sm" mb={3}>
                        In order to get paid, you'll need to provide a few more details.
                      </Text>
                      <Link
                        href="#"
                        color={linkColor}
                        textDecoration="underline"
                        fontWeight="600"
                        fontSize="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          onPayoutModalOpen();
                        }}
                      >
                        Get started
                      </Link>
                    </Box>
                  </Flex>
                </Box>

                <Box>
                  <Heading size="sm" fontWeight="bold" color={headingColor} mb={1}>
                    How you'll get paid
                  </Heading>
                  <Text color={bodyColor} fontSize="sm" mb={4}>
                    Add at least one payout method so we know where to send your money.
                  </Text>
                  <Button
                    bg={primaryButtonBg}
                    color={primaryButtonColor}
                    _hover={{ bg: primaryButtonHover }}
                    size="md"
                    borderRadius="md"
                    onClick={onPayoutModalOpen}
                  >
                    Set up payouts
                  </Button>
                </Box>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>

      <AddPayoutMethodModal isOpen={isPayoutModalOpen} onClose={onPayoutModalClose} />

      <Modal isOpen={isAddPaymentOpen} onClose={onAddPaymentClose} size="md" isCentered>
        <ModalOverlay />
        <ModalContent bg={modalBg}>
          <ModalHeader color={headingColor}>Add payment method</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {user && stripePromise && (
              <Elements stripe={stripePromise}>
                <AddPaymentMethodForm
                  user={{ id: user.id, email: user.email }}
                  onSuccess={() => {
                    handleAddSuccess();
                    onAddPaymentClose();
                  }}
                  onCancel={onAddPaymentClose}
                  labelColor={labelColor}
                  textColor={bodyColor}
                />
              </Elements>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      <AlertDialog
        isOpen={isRemoveConfirmOpen}
        leastDestructiveRef={removeConfirmCancelRef}
        onClose={() => {
          onRemoveConfirmClose();
          setPaymentMethodToRemove(null);
        }}
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader color={headingColor}>Remove payment method</AlertDialogHeader>
          <AlertDialogBody color={bodyColor}>
            Are you sure you want to remove this card? You can add it again later.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={removeConfirmCancelRef} onClick={onRemoveConfirmClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleRemoveCard} ml={3} isLoading={!!removingId}>
              Remove
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Container>
  );
};
