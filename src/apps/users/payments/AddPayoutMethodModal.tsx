import {
    useColorModeValue,
    Text,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    FormControl,
    FormLabel,
    Select,
    RadioGroup,
    Stack,
    Box,
    Flex,
    VStack,
    Radio,
    Button,
    Link,
    Alert,
    AlertDescription,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useSystemColor } from "~/hooks/use-system-color";
import { payoutAccountService } from "./payout-api";
import type { ProviderPayoutAccount } from "@suleigolden/sulber-api-client";
import type { PayoutMethodType } from "@suleigolden/sulber-api-client";

const PAYOUT_OPTIONS = [
    { value: "bank_cad", label: "Bank account in CAD", details: ["3-5 business days", "No fees"], payoutMethod: "bank_account" as PayoutMethodType, currency: "cad" },
    { value: "paypal_cad", label: "PayPal in CAD", details: ["1 business day", "PayPal fees may apply"], payoutMethod: "paypal" as PayoutMethodType, currency: "cad" },
    { value: "paypal_usd", label: "PayPal in USD", details: ["1 business day", "PayPal fees may apply"], payoutMethod: "paypal" as PayoutMethodType, currency: "usd" },
    { value: "payoneer_usd", label: "Payoneer in USD", details: ["Prepaid debit Mastercard", "24 hours or less", "Payoneer fees may apply"], payoutMethod: "payoneer" as PayoutMethodType, currency: "usd" },
];

function optionValueFromAccount(account: ProviderPayoutAccount): string {
    const currency = (account.default_currency || "cad").toLowerCase();
    const method = account.payout_method || "bank_account";
    const found = PAYOUT_OPTIONS.find((o) => o.payoutMethod === method && o.currency === currency);
    return found ? found.value : "";
}

export function AddPayoutMethodModal({
    isOpen,
    onClose,
    account,
    onSuccess,
}: {
    isOpen: boolean;
    onClose: () => void;
    account?: ProviderPayoutAccount | null;
    onSuccess?: () => void;
}) {
    const { headingColor, bodyColor, labelColor, borderColor, linkColor } = useSystemColor();
    const [country, setCountry] = useState("CA");
    const [method, setMethod] = useState("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const primaryButtonBg = useColorModeValue("gray.800", "whiteAlpha.200");
    const primaryButtonColor = useColorModeValue("white", "white");
    const primaryButtonHover = useColorModeValue("gray.700", "whiteAlpha.300");

    useEffect(() => {
        if (!isOpen) return;
        setError(null);
        if (account) {
            setCountry(account.country_code || "CA");
            setMethod(optionValueFromAccount(account));
        } else {
            setCountry("CA");
            setMethod("");
        }
    }, [isOpen, account]);

    const handleContinue = async () => {
        if (!method) return;
        setError(null);
        const option = PAYOUT_OPTIONS.find((o) => o.value === method);
        if (!option) return;

        const countryCode = country === "US" ? "US" : "CA";
        const defaultCurrency = option.currency;

        if (account) {
            setIsSubmitting(true);
            try {
                await payoutAccountService.update(account.id, {
                    country_code: countryCode,
                    default_currency: defaultCurrency,
                    payout_method: option.payoutMethod,
                    payout_schedule: "biweekly",
                });
                onSuccess?.();
                onClose();
            } catch (e) {
                const msg = e && typeof e === "object" && "message" in e ? String((e as { message: string }).message) : "Failed to update payout account";
                setError(msg);
            } finally {
                setIsSubmitting(false);
            }
        } else {
            setError("To receive payouts, you need to connect your Stripe account first. This step is coming soon.");
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader color={headingColor}>{account ? "Update payout method" : "Let's add a payout method"}</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <Text color={bodyColor} mb={6} fontSize="sm">
                        {account ? "Update where you'd like to receive your money." : "To start, let us know where you'd like us to send your money."}
                    </Text>

                    {error && (
                        <Alert status="error" mb={4} borderRadius="md">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

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
                        isDisabled={!method || isSubmitting}
                        isLoading={isSubmitting}
                        loadingText="Saving…"
                        onClick={handleContinue}
                    >
                        {account ? "Save changes" : "Continue"}
                    </Button>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}