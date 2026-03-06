import {
  Avatar,
  Box,
  Button,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useSystemColor } from "~/hooks/use-system-color";
import { useUser } from "~/hooks/use-user";

type ProviderProfileLite = {
  first_name?: string | null;
  last_name?: string | null;
  avatar_url?: string | null;
  phone_number?: string | null;
};

type ProviderLite = {
  id?: string;
  email?: string;
  profile?: ProviderProfileLite | null;
};

type ProviderInfoCardProps = {
  provider: ProviderLite | null | undefined;
};

export const ProviderInfoCard = ({ provider }: ProviderInfoCardProps) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { bgButton, borderColor, headingColor, bodyColor } = useSystemColor();

  if (!provider) return null;

  const profile = provider.profile ?? {};
  const fullName =
    [profile.first_name, profile.last_name].filter(Boolean).join(" ") ||
    provider.email ||
    "Provider";

  const email = provider.email;

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
          size="xl"
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
          {profile.phone_number && (
            <Text fontSize="sm" color={bodyColor}>
              {profile.phone_number}
            </Text>
          )}
          <Button
            size="sm"
            variant="brand"
            mt={2}
            isDisabled={!provider.id || !user?.id}
            onClick={() => {
              if (provider.id && user?.id) {
                navigate(`/customer/${user.id}/send-message?with=${provider.id}`);
              }
            }}
          >
            Send message
          </Button>
        </VStack>
      </HStack>
    </Box>
  );
};

