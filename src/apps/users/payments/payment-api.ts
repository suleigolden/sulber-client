import { api } from "@suleigolden/sulber-api-client";
import type { SavedPaymentMethod } from "@suleigolden/sulber-api-client";

export type PaymentUser = { id: string; email: string };

export type PaymentServiceWithUser = {
  listPaymentMethods: (data: { user: PaymentUser }) => Promise<SavedPaymentMethod[]>;
  createSetupIntent: (data: { user: PaymentUser }) => Promise<{ clientSecret: string }>;
  setStripeCustomerId: (data: { user: PaymentUser; stripeCustomerId: string }) => Promise<{ ok: boolean }>;
  setDefaultPaymentMethod: (data: { user: PaymentUser; paymentMethodId: string }) => Promise<{ ok: boolean }>;
  removePaymentMethod: (data: { user: PaymentUser; paymentMethodId: string }) => Promise<{ ok: boolean }>;
};

export const paymentService = api.service("payment") as unknown as PaymentServiceWithUser;
