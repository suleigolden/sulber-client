import {
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  RadioGroup,
  Stack,
  Radio,
  Button,
  Alert,
  AlertDescription,
  Box,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSystemColor } from "~/hooks/use-system-color";
import { CustomInputField } from "~/components/fields/CustomInputField";
import { payoutAccountService } from "./payout-api";
import type { CreateProviderPayoutAccountRequest } from "@suleigolden/sulber-api-client";

const COUNTRY_OPTIONS = [
  { label: "Canada", value: "CA" },
  { label: "United States", value: "US" },
];

// Max lengths (digits): institution 4, transit 6, routing 10, account 17
const MAX_INSTITUTION = 4;
const MAX_TRANSIT = 6;
const MAX_ROUTING = 10;
const MAX_ACCOUNT = 17;

type BankAccountType = "chequing" | "savings";

type BankAccountFormValues = {
  country: string;
  institutionNumber: string;
  transitNumber: string;
  routingNumber: string;
  accountNumber: string;
};

export function AddPayoutMethodModal({
  isOpen,
  onClose,
  providerId,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  providerId: string | undefined;
  onSuccess?: () => void;
}) {
  const { headingColor, labelColor } = useSystemColor();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [accountType, setAccountType] = useState<BankAccountType | "">("");

  const methods = useForm<BankAccountFormValues>({
    defaultValues: {
      country: "CA",
      institutionNumber: "",
      transitNumber: "",
      routingNumber: "",
      accountNumber: "",
    },
    mode: "onTouched",
  });

  const {
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = methods;

  const country = watch("country");
  const institutionNumber = watch("institutionNumber");
  const transitNumber = watch("transitNumber");
  const routingNumber = watch("routingNumber");
  const accountNumber = watch("accountNumber");

  const isCanada = country === "CA";
  const isUSA = country === "US";

  const primaryButtonBg = useColorModeValue("gray.800", "whiteAlpha.200");
  const primaryButtonColor = useColorModeValue("white", "white");
  const primaryButtonHover = useColorModeValue("gray.700", "whiteAlpha.300");

  useEffect(() => {
    if (!isOpen) {
      reset({
        country: "CA",
        institutionNumber: "",
        transitNumber: "",
        routingNumber: "",
        accountNumber: "",
      });
      setAccountType("");
      setSubmitError(null);
    }
  }, [isOpen, reset]);

  const onCountryChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    const newCountry = (e.target as HTMLSelectElement).value;
    setValue("country", newCountry);
    setValue("institutionNumber", "");
    setValue("transitNumber", "");
    setValue("routingNumber", "");
    clearErrors();
  };

  const formValid =
    accountType &&
    accountNumber?.trim() &&
    (isCanada
      ? institutionNumber?.trim() && transitNumber?.trim()
      : isUSA && routingNumber?.trim());

  const onSubmit = async (data: BankAccountFormValues) => {
    setSubmitError(null);
    clearErrors();

    if (isCanada) {
      if (!data.institutionNumber?.trim()) {
        setError("institutionNumber", { message: "Institution number is required" });
      }
      if (!data.transitNumber?.trim()) {
        setError("transitNumber", { message: "Transit number is required" });
      }
    } else if (isUSA) {
      if (!data.routingNumber?.trim()) {
        setError("routingNumber", { message: "Routing number is required" });
      }
    }

    if (!data.accountNumber?.trim()) {
      setError("accountNumber", { message: "Account number is required" });
    }

    if (!formValid || !providerId) return;

    setIsSubmitting(true);

    try {
      const countryCode = data.country === "US" ? "US" : "CA";
      const defaultCurrency = data.country === "US" ? "usd" : "cad";
      const provider_bank_account =
        isCanada
          ? {
              institution_number: data.institutionNumber.trim(),
              transit_number: data.transitNumber.trim(),
              account_number: data.accountNumber.trim(),
              account_type: accountType as "chequing" | "savings",
            }
          : {
              routing_number: data.routingNumber.trim(),
              account_number: data.accountNumber.trim(),
              account_type: accountType as "chequing" | "savings",
            };

      const payload: CreateProviderPayoutAccountRequest = {
        provider_id: providerId,
        stripe_connected_account_id: `bank_${providerId}_${Date.now()}`,
        country_code: countryCode,
        default_currency: defaultCurrency,
        payout_method: "bank_account",
        payout_schedule: "biweekly",
        provider_bank_account,
      };
      await payoutAccountService.create(payload);
      onSuccess?.();
      onClose();
    } catch (e) {
      const msg =
        e && typeof e === "object" && "message" in e
          ? String((e as { message: string }).message)
          : "Failed to add bank account";
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color={headingColor} fontWeight="bold" fontSize="xl">
          Add bank account info
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {submitError && (
            <Alert status="error" mb={4} borderRadius="md">
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Box mb={4}>
                <CustomInputField
                  type="select"
                  label="Country"
                  registerName="country"
                  isRequired
                  options={COUNTRY_OPTIONS}
                  placeholder="Select country"
                  onChange={onCountryChange}
                />
              </Box>

              <FormControl mb={4} isRequired>
                <FormLabel color={labelColor}>
                  Is this a chequing or savings account?
                </FormLabel>
                <RadioGroup
                  value={accountType}
                  onChange={(v) => setAccountType(v as BankAccountType)}
                  mt={2}
                >
                  <Stack spacing={2}>
                    <Radio value="chequing">Chequing</Radio>
                    <Radio value="savings">Savings</Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>

              {isCanada && (
                <>
                  <Box mb={4}>
                    <CustomInputField
                      type="text"
                      label="Institution number"
                      registerName="institutionNumber"
                      isRequired
                      placeholder="e.g. 021"
                      description="3 digits. Identifies the bank. Found in your bank statement or account details."
                      isError={errors.institutionNumber}
                      maxLength={MAX_INSTITUTION}
                    />
                  </Box>
                  <Box mb={4}>
                    <CustomInputField
                      type="text"
                      label="Transit number"
                      registerName="transitNumber"
                      isRequired
                      placeholder="e.g. 00021"
                      description="5 digits. Identifies the branch of your bank."
                      isError={errors.transitNumber}
                      maxLength={MAX_TRANSIT}
                    />
                  </Box>
                </>
              )}

              {isUSA && (
                <Box mb={4}>
                  <CustomInputField
                    type="text"
                    label="Routing number (ABA)"
                    registerName="routingNumber"
                    isRequired
                    placeholder="e.g. 021000021"
                    description="9 digits. Identifies your bank."
                    isError={errors.routingNumber}
                    maxLength={MAX_ROUTING}
                  />
                </Box>
              )}

              <Box mb={4}>
                <CustomInputField
                  type="text"
                  label="Account number"
                  registerName="accountNumber"
                  isRequired
                  placeholder="e.g. 123456789012"
                  description="4–17 digits. Your customer account number."
                  isError={errors.accountNumber}
                  maxLength={MAX_ACCOUNT}
                />
              </Box>

              <Button
                type="submit"
                bg={primaryButtonBg}
                color={primaryButtonColor}
                _hover={{ bg: primaryButtonHover }}
                size="lg"
                w="full"
                mt={6}
                isDisabled={!formValid || isSubmitting}
                isLoading={isSubmitting}
                loadingText="Saving…"
              >
                Add bank account
              </Button>
            </form>
          </FormProvider>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
