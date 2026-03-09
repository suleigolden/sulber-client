import {
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  Alert,
  AlertDescription,
  Box,
  Text,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSystemColor } from "~/hooks/use-system-color";
import { CustomInputField } from "~/components/fields/CustomInputField";
import {
  api,
  type ProviderPayoutAccount,
} from "@suleigolden/sulber-api-client";

const PAYOUT_SCHEDULE_OPTIONS = [
  { label: "Weekly", value: "weekly" },
  { label: "Biweekly", value: "biweekly" },
  { label: "Monthly", value: "monthly" },
];

type PayoutFormValues = {
  payoutSchedule: "weekly" | "biweekly" | "monthly";
};

function formatBankSummary(
  account: ProviderPayoutAccount | null | undefined,
): string | null {
  if (!account?.provider_bank_account) return null;
  const bank = account.provider_bank_account as any;
  const pieces: string[] = [];
  if (bank.bank_name) pieces.push(bank.bank_name);
  if (bank.last4) pieces.push(`•••• ${bank.last4}`);
  if (bank.country) pieces.push(bank.country);
  if (bank.currency) pieces.push(bank.currency.toUpperCase());
  return pieces.length ? pieces.join(" · ") : null;
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
  const { headingColor, labelColor, bodyColor, mutedTextColor, modalBg } = useSystemColor();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isEditMode = Boolean(existingAccount?.id);
  const bankSummary = useMemo(
    () => formatBankSummary(existingAccount ?? null),
    [existingAccount],
  );

  const methods = useForm<PayoutFormValues>({
    defaultValues: {
      payoutSchedule: "biweekly",
    },
    mode: "onTouched",
  });

  const {
    handleSubmit,
    reset,
    watch,
  } = methods;

  const payoutSchedule = watch("payoutSchedule");

  const primaryButtonBg = useColorModeValue("gray.800", "whiteAlpha.200");
  const primaryButtonColor = useColorModeValue("white", "white");
  const primaryButtonHover = useColorModeValue("gray.700", "whiteAlpha.300");
  const summaryBoxBg = useColorModeValue("gray.50", "whiteAlpha.100");
  const summaryBoxBorder = useColorModeValue("gray.200", "whiteAlpha.200");

  useEffect(() => {
    if (!isOpen) {
      setSubmitError(null);
      return;
    }
    if (existingAccount?.id) {
      const values = {
        payoutSchedule: existingAccount.payout_schedule ?? "biweekly",
      };
      reset(values, { keepDefaultValues: false });
    } else {
      reset({
        payoutSchedule: "biweekly",
      }, { keepDefaultValues: false });
    }
  }, [
    isOpen,
    existingAccount?.id,
    existingAccount?.payout_schedule,
    reset,
  ]);

  const hasStripeAccount = Boolean(existingAccount?.stripe_connected_account_id);
  const payoutsEnabled = Boolean(existingAccount?.payouts_enabled);
  const onboardingCompleted = Boolean(existingAccount?.onboarding_completed);
  const hasRequirementsDue =
    (((existingAccount as any)?.requirements_currently_due as string[] | undefined) ?? []).length >
    0;

  const stripeCtaLabel = useMemo(() => {
    if (!hasStripeAccount || !onboardingCompleted) {
      return "Continue with Stripe";
    }
    if (hasRequirementsDue) {
      return "Complete payout setup in Stripe";
    }
    return "Manage payout account in Stripe";
  }, [hasStripeAccount, onboardingCompleted, hasRequirementsDue]);

  const onSaveSchedule = async (data: PayoutFormValues) => {
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      if (!providerId || !existingAccount?.id) {
        return;
      }
      await (api.service("provider-payout-account") as unknown as {
        updatePayoutSchedule: (data: {
          payout_schedule: PayoutFormValues["payoutSchedule"];
        }) => Promise<ProviderPayoutAccount>;
      }).updatePayoutSchedule({
        payout_schedule: data.payoutSchedule,
      });
      onSuccess?.(true);
      onClose();
    } catch (e) {
      const msg =
        e && typeof e === "object" && "message" in e
          ? String((e as { message: string }).message)
          : "Failed to update payout schedule";
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onStripeCta = async () => {
    setSubmitError(null);
    if (!providerId) return;
    setIsSubmitting(true);
    try {
      const service = api.service("provider-payout-account") as unknown as {
        createStripeOnboardingLink: (data: {
          payout_schedule?: "weekly" | "biweekly" | "monthly";
          country_code?: string;
        }) => Promise<{ url: string }>;
      };
      const res = await service.createStripeOnboardingLink({
        payout_schedule: payoutSchedule || "biweekly",
      });
      if (res.url) {
        window.location.href = res.url;
      }
    } catch (e) {
      const msg =
        e && typeof e === "object" && "message" in e
          ? String((e as { message: string }).message)
          : "Failed to start Stripe onboarding";
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
                Current payout settings
              </Text>
              <Text fontSize="sm" color={bodyColor}>
                Country: {existingAccount.country_code} · {existingAccount.payout_method.replace("_", " ")} · {existingAccount.default_currency.toUpperCase()}
              </Text>
              <Text fontSize="xs" color={mutedTextColor} mt={1}>
                Schedule: {existingAccount.payout_schedule}
                {existingAccount.status && ` · Status: ${existingAccount.status}`}
              </Text>
              {bankSummary && (
                <Text fontSize="xs" color={mutedTextColor} mt={1}>
                  Bank: {bankSummary}
                </Text>
              )}
              {!payoutsEnabled && (
                <Text fontSize="xs" color={mutedTextColor} mt={1}>
                  Payouts are not yet enabled. You may need to finish setup in Stripe.
                </Text>
              )}
              {hasRequirementsDue && (
                <Text fontSize="xs" color={mutedTextColor} mt={1}>
                  Stripe requires additional information to enable payouts.
                </Text>
              )}
            </Box>
          )}

          <FormProvider {...methods}>
            <form noValidate onSubmit={handleSubmit(onSaveSchedule)}>
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

              <FormControl mb={4}>
                <FormLabel color={labelColor}>
                  Connect or manage your payout account with Stripe
                </FormLabel>
                <Text fontSize="sm" color={mutedTextColor}>
                  You&apos;ll be redirected to Stripe&apos;s secure onboarding flow to add or update your payout bank account.
                </Text>
              </FormControl>

              <Button
                type="submit"
                bg={primaryButtonBg}
                color={primaryButtonColor}
                _hover={{ bg: primaryButtonHover }}
                size="lg"
                w="full"
                mt={6}
                isDisabled={isSubmitting}
                isLoading={isSubmitting}
                loadingText={isEditMode ? "Saving…" : "Saving…"}
              >
                {isEditMode ? "Save schedule" : "Save schedule"}
              </Button>

              <Button
                type="button"
                variant="outline"
                borderColor={primaryButtonBg}
                color={primaryButtonBg}
                _hover={{ bg: "transparent", borderColor: primaryButtonHover, color: primaryButtonHover }}
                size="lg"
                w="full"
                mt={4}
                onClick={onStripeCta}
                isDisabled={!providerId || isSubmitting}
                isLoading={isSubmitting && !isEditMode}
              >
                {stripeCtaLabel}
              </Button>
            </form>
          </FormProvider>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
