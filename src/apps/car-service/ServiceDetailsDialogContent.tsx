import {
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  Box,
  Button,
  List,
  ListItem,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

type ServiceDetailsDialogContentProps = {
  included: string[];
  requirements: string[];
  onCancel: () => void;
  onSendRequest: () => void;
  isSending: boolean;
  cancelRef: React.RefObject<HTMLButtonElement | null>;
  providerName: string;
};

export const ServiceDetailsDialogContent = ({
  included,
  requirements,
  onCancel,
  onSendRequest,
  isSending,
  cancelRef,
  providerName,
}: ServiceDetailsDialogContentProps) => {
  const cardBg = useColorModeValue("white", "#0b1437");
  const valueColor = useColorModeValue("gray.800", "white");
  const labelColor = useColorModeValue("gray.600", "gray.300");

  return (
    <AlertDialogContent bg={cardBg}>
      <AlertDialogHeader fontSize="lg" fontWeight="bold" color={valueColor}>
        What's Included and Customer Requirements
      </AlertDialogHeader>
      <AlertDialogBody>
        <VStack align="stretch" spacing={4}>
          {included.length > 0 && (
            <Box>
              <Text fontSize="sm" fontWeight="semibold" color={valueColor} mb={2}>
                What's Included
              </Text>
              <List spacing={1}>
                {included.map((item, i) => (
                  <ListItem key={i} fontSize="sm" color={labelColor} display="flex" alignItems="flex-start" gap={2}>
                    <Text as="span" color="brand.500">•</Text>
                    {item}
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
          {requirements.length > 0 && (
            <Box>
              <Text fontSize="sm" fontWeight="semibold" color={valueColor} mb={2}>
                Customer Requirements
              </Text>
              <List spacing={1}>
                {requirements.map((item, i) => (
                  <ListItem key={i} fontSize="sm" color={labelColor} display="flex" alignItems="flex-start" gap={2}>
                    <Text as="span" color="brand.500">•</Text>
                    {item}
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
          {included.length === 0 && requirements.length === 0 && (
            <Text fontSize="sm" color={labelColor}>No details available for this service.</Text>
          )}
          <Text fontSize="sm" color={labelColor}>Send request to: {providerName} now to get started</Text>
        </VStack>
      </AlertDialogBody>
      <AlertDialogFooter>
        <Button ref={cancelRef} onClick={onCancel}>
          Cancel
        </Button>
        <Button
           ml={4}
          colorScheme="brand"
          onClick={onSendRequest}
          isLoading={isSending}
          loadingText="Sending..."
        >
          Send request
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};
