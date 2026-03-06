
import { useState } from "react";
import {
  Box,
  Flex,
  Text,
  Textarea,
  Button,
  Icon,
  Avatar,
  Divider,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { FiChevronLeft } from "react-icons/fi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUser } from "~/hooks/use-user";
import { api, type UserProfile } from "@suleigolden/sulber-api-client";
import { useQuery, useMutation } from "@tanstack/react-query";

export const SendFirstMessage = () => {
  const { user } = useUser();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [message, setMessage] = useState("");

  const otherUserId = searchParams.get("with");
  const rawService = searchParams.get("service") || "";

  const cardBg = useColorModeValue("white", "gray.800");
  const headingColor = useColorModeValue("gray.900", "white");
  const subheadingColor = useColorModeValue("gray.500", "gray.400");
  const sectionHeadingColor = useColorModeValue("gray.800", "gray.100");
  const bulletColor = useColorModeValue("gray.700", "gray.200");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box
      maxW="800px"
      mx="auto"
      mt={{ base: 2, md: 4 }}
      mb={8}
      px={{ base: 4, md: 0 }}
    >
      <Button
        variant="ghost"
        size="sm"
        leftIcon={<Icon as={FiChevronLeft} />}
        mb={4}
        onClick={() => navigate(-1)}
      >
        Back
      </Button>

      <Box
        bg={cardBg}
        borderRadius="xl"
        borderWidth="1px"
        borderColor={borderColor}
        p={{ base: 5, md: 8 }}
        boxShadow="sm"
      >
        <Flex justify="space-between" align="center" mb={6}>
          <Box>
            <Text
              fontSize="2xl"
              fontWeight="semibold"
              color={headingColor}
              mb={1}
            >
              Contact{" "}
              {displayName === "your host" ? "your Sulber pro" : displayName}{" "}
              about your {serviceDisplayName}
            </Text>
            <Text fontSize="sm" color={subheadingColor}>
              Typically responds within an hour
            </Text>
          </Box>
          <Avatar
            size="lg"
            name={displayName}
            src={profile?.avatar_url ?? undefined}
          />
        </Flex>

        <Divider mb={6} />

        <Box mb={8}>
          <Text
            fontSize="md"
            fontWeight="semibold"
            color={sectionHeadingColor}
            mb={3}
          >
            Most Sulber customers ask about
          </Text>

          <Box pl={1}>
            <Text fontSize="sm" fontWeight="semibold" mb={1}>
              Service timing & location
            </Text>
            <Text fontSize="sm" color={bulletColor} mb={3}>
              Confirm when your {serviceLowerPhrase} will take place and where
              you should meet your Sulber pro (driveway, apartment parking,
              workplace, etc.).
            </Text>

            <Text fontSize="sm" fontWeight="semibold" mb={1}>
              What&apos;s included in the service
            </Text>
            <Text fontSize="sm" color={bulletColor} mb={3}>
              Ask exactly what is included in this Sulber {serviceLowerPhrase}{" "}
              (e.g. interior, exterior, add-ons) and if there are any special
              requirements or rules.
            </Text>

            <Text fontSize="sm" fontWeight="semibold" mb={1}>
              Price, availability & changes
            </Text>
            <Text fontSize="sm" color={bulletColor}>
              Check that the date and time still work, and ask about any
              additional fees or what happens if you need to reschedule your
              Sulber {serviceLowerPhrase}.
            </Text>
          </Box>
        </Box>

        <Divider mb={6} />

        <Box>
          <Text
            fontSize="md"
            fontWeight="semibold"
            color={sectionHeadingColor}
            mb={3}
          >
            Still have questions? Message your Sulber pro
          </Text>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              firstName
                ? `Hi ${firstName}! I had a few questions about this ${serviceLowerPhrase} on Sulber...`
                : `Hi! I had a few questions about this ${serviceLowerPhrase} on Sulber before I confirm.`
            }
            minH="120px"
            mb={4}
            resize="vertical"
          />
          <Button
            colorScheme="gray"
            bg="gray.900"
            color="white"
            _hover={{ bg: "gray.800" }}
            size="md"
            px={8}
            borderRadius="md"
            onClick={() => sendMutation.mutate()}
            isLoading={sendMutation.isPending}
            isDisabled={!message.trim()}
          >
            Send message
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

