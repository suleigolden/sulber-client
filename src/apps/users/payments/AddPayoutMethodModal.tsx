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
    Link
} from "@chakra-ui/react";
import { useState } from "react";
import { useSystemColor } from "~/hooks/use-system-color";

const PAYOUT_OPTIONS = [
    { value: "bank_cad", label: "Bank account in CAD", details: ["3-5 business days", "No fees"], icon: "bank" },
    { value: "paypal_cad", label: "PayPal in CAD", details: ["1 business day", "PayPal fees may apply"], icon: "paypal" },
    { value: "paypal_usd", label: "PayPal in USD", details: ["1 business day", "PayPal fees may apply"], icon: "paypal" },
    { value: "payoneer_usd", label: "Payoneer in USD", details: ["Prepaid debit Mastercard", "24 hours or less", "Payoneer fees may apply"], icon: "payoneer" },
];



export function AddPayoutMethodModal({
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