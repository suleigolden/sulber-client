import { useCallback, useEffect, useState } from "react";
import type { SavedPaymentMethod } from "@suleigolden/sulber-api-client";
import { useUser } from "~/hooks/use-user";
import { paymentService } from "../apps/users/payments/payment-api";

export function cardBrandLabel(brand: string): string {
  const b = (brand ?? "").toLowerCase();
  if (b === "visa") return "Visa";
  if (b === "mastercard") return "Mastercard";
  if (b === "amex") return "American Express";
  if (b === "discover") return "Discover";
  return brand || "Card";
}

export function usePaymentMethods(isOpen: boolean) {
  const { user } = useUser();
  const [paymentMethods, setPaymentMethods] = useState<SavedPaymentMethod[]>([]);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | null>(null);
  const [isLoadingPaymentMethods, setIsLoadingPaymentMethods] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);

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
      const msg =
        e && typeof e === "object" && "message" in e
          ? String((e as { message: string }).message)
          : "Failed to load payment methods";
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

  const handleAddSuccess = useCallback(() => {
    setIsAddMode(false);
    fetchPaymentMethods();
  }, [fetchPaymentMethods]);

  const hasMethods = paymentMethods.length > 0;

  return {
    user,
    paymentMethods,
    selectedPaymentMethodId,
    setSelectedPaymentMethodId,
    isLoadingPaymentMethods,
    error,
    isAddMode,
    setIsAddMode,
    fetchPaymentMethods,
    handleAddSuccess,
    hasMethods,
  };
}
