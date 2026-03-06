import {
  Avatar,
  Box,
  Button,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Job, UserProfile } from "@suleigolden/sulber-api-client";
import { useSystemColor } from "~/hooks/use-system-color";
import { useUser } from "~/hooks/use-user";

type CustomerProfileLite = {
  first_name?: string | null;
  last_name?: string | null;
  avatar_url?: string | null;
  phone_number?: string | null;
};

type CustomerLite = {
  id?: string;
  email?: string | null;
  profile?: CustomerProfileLite | null;
};

type CustomerInfoCardProps = {
  job: Job;
  customerProfile?: UserProfile | null;
  isSendMessageButtonVisible?: boolean;
};

export const CustomerInfoCard = ({ job, customerProfile, isSendMessageButtonVisible = true }: CustomerInfoCardProps) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { bgButton, borderColor, headingColor, bodyColor } = useSystemColor();

  // Prefer explicit customer relation from the job if present
  const customer = ((job as unknown) as { customer?: CustomerLite | null }).customer ?? null;

  const profileFromRelation = customer?.profile ?? null;

  // Normalise profile-like information (from either the relation or the fetched profile)
  const profile: CustomerProfileLite = {
    first_name: customerProfile?.first_name ?? profileFromRelation?.first_name ?? null,
    last_name: customerProfile?.last_name ?? profileFromRelation?.last_name ?? null,
    avatar_url: customerProfile?.avatar_url ?? profileFromRelation?.avatar_url ?? null,
    phone_number: customerProfile?.phone_number ?? profileFromRelation?.phone_number ?? null,
  };

  if (!customer && !customerProfile) {
    return null;
  }

  const fullName =
    [profile.first_name, profile.last_name].filter(Boolean).join(" ") ||
    customer?.email ||
    "Customer";

  const email = customer?.email ?? null;
  const phoneNumber = profile.phone_number ?? null;

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      borderColor={borderColor}
      bg={bgButton}
      p={3}
    >
      <HStack align="flex-start" spacing={3}>
        <Avatar
          size="md"
          name={fullName}
          src={profile.avatar_url ?? undefined}
        />
        <VStack align="flex-start" spacing={1} flex={1}>
          <Text fontSize="sm" fontWeight="semibold" color={headingColor}>
            {fullName}
          </Text>
          {email && (
            <Text fontSize="sm" color={bodyColor}>
              {email}
            </Text>
          )}
          {phoneNumber && (
            <Text fontSize="sm" color={bodyColor}>
              {phoneNumber}
            </Text>
          )}
          {isSendMessageButtonVisible && (
            <Button
              size="xs"
              variant="brand"
              mt={2}
              isDisabled={!job.customer_id || !user?.id}
              onClick={() => {
                if (job.customer_id && user?.id) {
                  // navigate(`/provider/${user.id}/messages?with=${job.customer_id}`);
                  window.location.href = `/provider/${user.id}/messages?with=${job.customer_id}`;
                }
              }}
            >
              Send message
            </Button>
          )}
        </VStack>
      </HStack>
    </Box>
  );
};

