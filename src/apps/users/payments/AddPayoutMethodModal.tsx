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
  { label: "USA", value: "US" },
];

type BankAccountType = "chequing" | "savings";

type BankAccountFormValues = {
  country: string;
  institutionNumber: string;
  transitNumber: string;
  accountNumber: string;
  confirmAccountNumber: string;
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
      accountNumber: "",
      confirmAccountNumber: "",
    },
    mode: "onTouched",
  });

  const {
    handleSubmit,
    reset,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = methods;

  const country = watch("country");
  const institutionNumber = watch("institutionNumber");
  const transitNumber = watch("transitNumber");
  const accountNumber = watch("accountNumber");
  const confirmAccountNumber = watch("confirmAccountNumber");

  const primaryButtonBg = useColorModeValue("gray.800", "whiteAlpha.200");
  const primaryButtonColor = useColorModeValue("white", "white");
  const primaryButtonHover = useColorModeValue("gray.700", "whiteAlpha.300");

  useEffect(() => {
    if (!isOpen) {
      reset({
        country: "CA",
        institutionNumber: "",
        transitNumber: "",
        accountNumber: "",
        confirmAccountNumber: "",
      });
      setAccountType("");
      setSubmitError(null);
    }
  }, [isOpen, reset]);

  const formValid =
    accountType &&
    institutionNumber?.trim() &&
    transitNumber?.trim() &&
    accountNumber?.trim() &&
    confirmAccountNumber?.trim() === accountNumber?.trim();

  const onSubmit = async (data: BankAccountFormValues) => {
    setSubmitError(null);
    clearErrors();

    if (!data.institutionNumber?.trim()) {
      setError("institutionNumber", { message: "Institution number is required" });
    }
    if (!data.transitNumber?.trim()) {
      setError("transitNumber", { message: "Transit number is required" });
    }
    if (!data.accountNumber?.trim()) {
      setError("accountNumber", { message: "Account number is required" });
    }
    if (!data.confirmAccountNumber?.trim()) {
      setError("confirmAccountNumber", { message: "Account number is required" });
    } else if (data.confirmAccountNumber.trim() !== data.accountNumber.trim()) {
      setError("confirmAccountNumber", { message: "Account numbers must match" });
    }

    if (!formValid || !providerId) return;

    setIsSubmitting(true);

    try {
      const countryCode = data.country === "US" ? "US" : "CA";
      const defaultCurrency = data.country === "US" ? "usd" : "cad";
      const payload: CreateProviderPayoutAccountRequest = {
        provider_id: providerId,
        stripe_connected_account_id: `bank_${providerId}_${Date.now()}`,
        country_code: countryCode,
        default_currency: defaultCurrency,
        payout_method: "bank_account",
        payout_schedule: "biweekly",
        provider_bank_account: {
          institution_number: data.institutionNumber.trim(),
          transit_number: data.transitNumber.trim(),
          account_number: data.accountNumber.trim(),
          account_type: accountType as "chequing" | "savings",
        },
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

              <Box mb={4}>
                <CustomInputField
                  type="text"
                  label="Institution number"
                  registerName="institutionNumber"
                isRequired
                placeholder="Institution number"
                description="The bank code or the financial institution number identifies your bank and should be located in your bank statement or account details."
                isError={errors.institutionNumber}
                />
              </Box>

              <Box mb={4}>
                <CustomInputField
                  type="text"
                  label="Transit number"
                  registerName="transitNumber"
                isRequired
                placeholder="Transit number"
                description="The branch or transit number identifies a specific branch of your bank."
                isError={errors.transitNumber}
                />
              </Box>

              <Box mb={4}>
                <CustomInputField
                  type="text"
                  label="Account number"
                  registerName="accountNumber"
                isRequired
                placeholder="Account number"
                isError={errors.accountNumber}
                />
              </Box>

              <Box mb={4}>
                <CustomInputField
                  type="text"
                  label="Confirm account number"
                  registerName="confirmAccountNumber"
                isRequired
                placeholder="Confirm account number"
                description="Enter the account number. This can usually be found within the account details."
                isError={errors.confirmAccountNumber}
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
