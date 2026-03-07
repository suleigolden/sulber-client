import { api } from "@suleigolden/sulber-api-client";
import type {
  ProviderPayoutAccount,
  CreateProviderPayoutAccountRequest,
  UpdateProviderPayoutAccountRequest,
} from "@suleigolden/sulber-api-client";

export type PayoutAccountService = {
  create: (data: CreateProviderPayoutAccountRequest) => Promise<ProviderPayoutAccount>;
  list: (providerId?: string) => Promise<ProviderPayoutAccount[]>;
  get: (id: string) => Promise<ProviderPayoutAccount>;
  findByProviderId: (providerId: string) => Promise<ProviderPayoutAccount | null>;
  update: (id: string, data: UpdateProviderPayoutAccountRequest) => Promise<ProviderPayoutAccount>;
  delete: (id: string) => Promise<void>;
};

export const payoutAccountService = api.service(
  "provider-payout-account"
) as unknown as PayoutAccountService;
