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
  Text,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSystemColor } from "~/hooks/use-system-color";
import { CustomInputField } from "~/components/fields/CustomInputField";
import { api, type ProviderPayoutAccount, type CreateProviderPayoutAccountRequest, type UpdateProviderPayoutAccountRequest } from "@suleigolden/sulber-api-client";

const COUNTRY_OPTIONS = [
  { label: "Canada", value: "CA" },
  { label: "United States", value: "US" },
];

const PAYOUT_SCHEDULE_OPTIONS = [
  { label: "Weekly", value: "weekly" },
  { label: "Biweekly", value: "biweekly" },
  { label: "Monthly", value: "monthly" },
];

// Max lengths (digits): institution 4, transit 6, routing 10, account 17
const MAX_INSTITUTION = 4;
const MAX_TRANSIT = 6;
const MAX_ROUTING = 10;
const MAX_ACCOUNT = 17;

type BankAccountType = "chequing" | "savings";

type BankAccountFormValues = {
  country: string;
  payoutSchedule: string;
  bankName: string;
  institutionNumber: string;
  transitNumber: string;
  routingNumber: string;
  accountNumber: string;
};

function maskAccountNumber(num: string | undefined): string {
  if (!num || num.length < 4) return "****";
  return "*".repeat(Math.max(0, num.length - 4)) + num.slice(-4);
}

export function AddPayoutMethodModal({
  isOpen,
  onClose,
  providerId,
  account: existingAccount,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  providerId: string | undefined;
  account?: ProviderPayoutAccount | null;
  onSuccess?: (isUpdate: boolean) => void;
}) {
  console.log("existingAccount", existingAccount);
  const { headingColor, labelColor, bodyColor, mutedTextColor, modalBg } = useSystemColor();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [accountType, setAccountType] = useState<BankAccountType | "">("");

  const isEditMode = Boolean(existingAccount?.id);
  const bank = existingAccount?.provider_bank_account;

  const methods = useForm<BankAccountFormValues>({
    defaultValues: {
      country: "CA",
      payoutSchedule: "biweekly",
      bankName: "",
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
  const payoutSchedule = watch("payoutSchedule");
  const bankName = watch("bankName");
  const institutionNumber = watch("institutionNumber");
  const transitNumber = watch("transitNumber");
  const routingNumber = watch("routingNumber");
  const accountNumber = watch("accountNumber");

  const isCanada = country === "CA";
  const isUSA = country === "US";

  const primaryButtonBg = useColorModeValue("gray.800", "whiteAlpha.200");
  const primaryButtonColor = useColorModeValue("white", "white");
  const primaryButtonHover = useColorModeValue("gray.700", "whiteAlpha.300");
  const summaryBoxBg = useColorModeValue("gray.50", "whiteAlpha.100");
  const summaryBoxBorder = useColorModeValue("gray.200", "whiteAlpha.200");

  // Populate form when modal opens or when existing account data (e.g. after refetch) is available
  useEffect(() => {
    if (!isOpen) {
      setSubmitError(null);
      return;
    }
    if (existingAccount?.id) {
      const c = existingAccount.country_code === "US" ? "US" : "CA";
      const bank = existingAccount.provider_bank_account;
      const values = {
        country: c,
        payoutSchedule: existingAccount.payout_schedule ?? "biweekly",
        bankName: bank?.bank_name ?? "",
        institutionNumber: bank?.institution_number ?? "",
        transitNumber: bank?.transit_number ?? "",
        routingNumber: bank?.routing_number ?? "",
        accountNumber: bank?.account_number ?? "",
      };
      reset(values, { keepDefaultValues: false });
      setAccountType((bank?.account_type as BankAccountType) ?? "");
    } else {
      reset({
        country: "CA",
        payoutSchedule: "biweekly",
        bankName: "",
        institutionNumber: "",
        transitNumber: "",
        routingNumber: "",
        accountNumber: "",
      }, { keepDefaultValues: false });
      setAccountType("");
    }
  }, [
    isOpen,
    existingAccount?.id,
    existingAccount?.country_code,
    existingAccount?.payout_schedule,
    // Re-run when bank data is available/updated (e.g. after refetch)
    existingAccount?.provider_bank_account
      ? JSON.stringify(existingAccount.provider_bank_account)
      : null,
    reset,
  ]);

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

    if (!formValid) return;

    if (isEditMode && existingAccount) {
      if (!existingAccount.id) return;
      setIsSubmitting(true);
      try {
        const provider_bank_account =
          isCanada
            ? {
                bank_name: data.bankName.trim() || undefined,
                institution_number: data.institutionNumber.trim(),
                transit_number: data.transitNumber.trim(),
                account_number: data.accountNumber.trim(),
                account_type: accountType as "chequing" | "savings",
              }
            : {
                bank_name: data.bankName.trim() || undefined,
                routing_number: data.routingNumber.trim(),
                account_number: data.accountNumber.trim(),
                account_type: accountType as "chequing" | "savings",
              };
        const payload: UpdateProviderPayoutAccountRequest = {
          payout_schedule: data.payoutSchedule as "weekly" | "biweekly" | "monthly",
          provider_bank_account,
        };
        await (api.service("provider-payout-account") as { update: (id: string, data: UpdateProviderPayoutAccountRequest) => Promise<ProviderPayoutAccount> }).update(existingAccount.id, payload);
        onSuccess?.(true);
        onClose();
      } catch (e) {
        const msg =
          e && typeof e === "object" && "message" in e
            ? String((e as { message: string }).message)
            : "Failed to update payout account";
        setSubmitError(msg);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (!providerId) return;
    setIsSubmitting(true);

    try {
      const countryCode = data.country === "US" ? "US" : "CA";
      const defaultCurrency = data.country === "US" ? "usd" : "cad";
      const provider_bank_account =
        isCanada
          ? {
              bank_name: data.bankName.trim() || undefined,
              institution_number: data.institutionNumber.trim(),
              transit_number: data.transitNumber.trim(),
              account_number: data.accountNumber.trim(),
              account_type: accountType as "chequing" | "savings",
            }
          : {
              bank_name: data.bankName.trim() || undefined,
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
        payout_schedule: (data.payoutSchedule as "weekly" | "biweekly" | "monthly") || "biweekly",
        provider_bank_account,
      };
      await (api.service("provider-payout-account") as { create: (data: CreateProviderPayoutAccountRequest) => Promise<ProviderPayoutAccount> }).create(payload);
      onSuccess?.(false);
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
      <ModalContent bg={modalBg}>
        <ModalHeader color={headingColor} fontWeight="bold" fontSize="xl">
          {isEditMode ? "Manage payout account" : "Add bank account info"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {submitError && (
            <Alert status="error" mb={4} borderRadius="md">
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

          {isEditMode && existingAccount && (
            <Box mb={4} p={3} borderRadius="md" bg={summaryBoxBg} borderWidth="1px" borderColor={summaryBoxBorder}>
              <Text fontSize="sm" fontWeight="600" color={headingColor} mb={2}>
                Current account details
              </Text>
              <Text fontSize="sm" color={bodyColor}>
                Country: {existingAccount.country_code} · {existingAccount.payout_method.replace("_", " ")} · {existingAccount.default_currency.toUpperCase()}
              </Text>
              <Text fontSize="xs" color={mutedTextColor} mt={1}>
                Schedule: {existingAccount.payout_schedule}
                {bank?.bank_name && ` · Bank: ${bank.bank_name}`}
                {bank?.institution_number && ` · Institution: ${bank.institution_number}`}
                {bank?.transit_number && ` · Transit: ${bank.transit_number}`}
                {bank?.routing_number && ` · Routing: ${bank.routing_number}`}
                {bank?.account_number && ` · Account: ${maskAccountNumber(bank.account_number)}`}
              </Text>
            </Box>
          )}

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              {isEditMode && (
                <>
                  <Box mb={4}>
                    <CustomInputField
                      type="select"
                      label="Payout schedule"
                      registerName="payoutSchedule"
                      isRequired
                      options={PAYOUT_SCHEDULE_OPTIONS}
                      placeholder="Select schedule"
                    />
                  </Box>
                  <Box mb={4}>
                    <CustomInputField
                      type="text"
                      label="Bank name"
                      registerName="bankName"
                      placeholder="e.g. TD Canada Trust"
                      description="Name of your bank or financial institution."
                      isError={errors.bankName}
                    />
                  </Box>
                </>
              )}

              {!isEditMode && (
                <Box mb={4}>
                  <CustomInputField
                    type="select"
                    label="Payout schedule"
                    registerName="payoutSchedule"
                    isRequired
                    options={PAYOUT_SCHEDULE_OPTIONS}
                    placeholder="Select schedule"
                  />
                </Box>
              )}

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

              {!isEditMode && (
                <Box mb={4}>
                  <CustomInputField
                    type="text"
                    label="Bank name"
                    registerName="bankName"
                    placeholder="e.g. TD Canada Trust"
                    description="Name of your bank or financial institution."
                    isError={errors.bankName}
                  />
                </Box>
              )}

              {isCanada && (
                <>
                  <Box mb={4}>
                    <CustomInputField
                      type="text"
                      label="Institution number"
                      registerName="institutionNumber"
                      isRequired
                      placeholder="e.g. 021"
                      description="3 digits. Identifies the bank."
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
                      description="5 digits. Identifies the branch."
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
                loadingText={isEditMode ? "Saving…" : "Adding…"}
              >
                {isEditMode ? "Save changes" : "Add bank account"}
              </Button>
            </form>
          </FormProvider>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
