import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Text,
  Avatar,
  Divider,
  Box,
  Icon,
} from "@chakra-ui/react";
import { UserProfile, Job } from "@suleigolden/sulber-api-client";
import { FaUser, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaDollarSign } from "react-icons/fa";
import { fullAddress } from "~/common/utils/address";
import { formatDateToStringWithTime } from "~/common/utils/date-time";
import { formatNumberWithCommas } from "~/common/utils/currency-formatter";
import { useSystemColor } from "~/hooks/use-system-color";

type CustomerRequestInfoModalProps = {
  isOpen: boolean;
  onClose: () => void;
  customerProfile: UserProfile | null;
  job: Job;
};

export const CustomerRequestInfoModal = ({
  isOpen,
  onClose,
  customerProfile,
  job,
  }: CustomerRequestInfoModalProps) => {
  const {
    modalBg,
    borderColor,
    infoBoxBg,
  } = useSystemColor();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
      <ModalContent bg={modalBg} borderRadius="xl" boxShadow="2xl">
        <ModalHeader>
          <HStack spacing={3}>
            <Avatar
              size="md"
              src={customerProfile?.avatar_url || undefined}
              name={`${customerProfile?.first_name || ""} ${customerProfile?.last_name || ""}`}
              icon={<FaUser />}
            />
            <VStack align="start" spacing={0}>
              <Text fontSize="lg" fontWeight="bold">
                {customerProfile?.first_name} {customerProfile?.last_name}
              </Text>
              <Text fontSize="sm" color="gray.600">
                Customer Information
              </Text>
            </VStack>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack align="stretch" spacing={6}>
            {/* Customer Contact Information */}
            <Box>
              <Text fontSize="sm" fontWeight="bold" color="gray.700" mb={3}>
                Contact Information
              </Text>
              <VStack align="stretch" spacing={3}>
                {customerProfile?.phone_number && (
                  <HStack spacing={3} p={3} bg={infoBoxBg} borderRadius="md">
                    <Icon as={FaPhone} color="brand.500" />
                    <Text fontSize="sm" color="gray.800">
                      {customerProfile.phone_number}
                    </Text>
                  </HStack>
                )}
                {customerProfile?.date_of_birth && (
                  <HStack spacing={3} p={3} bg={infoBoxBg} borderRadius="md">
                    <Icon as={FaCalendarAlt} color="brand.500" />
                    <Text fontSize="sm" color="gray.800">
                      Date of Birth: {new Date(customerProfile.date_of_birth).toLocaleDateString()}
                    </Text>
                  </HStack>
                )}
                {customerProfile?.gender && (
                  <HStack spacing={3} p={3} bg={infoBoxBg} borderRadius="md">
                    <Icon as={FaUser} color="brand.500" />
                    <Text fontSize="sm" color="gray.800">
                      Gender: {customerProfile.gender}
                    </Text>
                  </HStack>
                )}
              </VStack>
            </Box>

            <Divider />

            {/* Service Request Details */}
            <Box>
              <Text fontSize="sm" fontWeight="bold" color="gray.700" mb={3}>
                Service Request Details
              </Text>
              <VStack align="stretch" spacing={3}>
                <HStack spacing={3} p={3} bg={infoBoxBg} borderRadius="md">
                  <Icon as={FaMapMarkerAlt} color="brand.500" />
                  <VStack align="start" spacing={0} flex={1}>
                    <Text fontSize="xs" color="gray.600" fontWeight="medium">
                      Service Location
                    </Text>
                    <Text fontSize="sm" color="gray.800" fontWeight="medium">
                      {fullAddress(job.address)}
                    </Text>
                  </VStack>
                </HStack>

                {job.scheduled_start && (
                  <HStack spacing={3} p={3} bg={infoBoxBg} borderRadius="md">
                    <Icon as={FaClock} color="brand.500" />
                    <VStack align="start" spacing={0} flex={1}>
                      <Text fontSize="xs" color="gray.600" fontWeight="medium">
                        Scheduled Time
                      </Text>
                      <Text fontSize="sm" color="gray.800" fontWeight="medium">
                        {formatDateToStringWithTime(job.scheduled_start as string)}
                      </Text>
                    </VStack>
                  </HStack>
                )}

                {job.total_price_cents && (
                  <HStack spacing={3} p={3} bg={infoBoxBg} borderRadius="md">
                    <Icon as={FaDollarSign} color="brand.500" />
                    <VStack align="start" spacing={0} flex={1}>
                      <Text fontSize="xs" color="gray.600" fontWeight="medium">
                        Service Price
                      </Text>
                      <Text fontSize="sm" color="gray.800" fontWeight="bold">
                        ${formatNumberWithCommas(Number(job.total_price_cents) / 100)}
                      </Text>
                    </VStack>
                  </HStack>
                )}

                {job.notes && (
                  <Box p={3} bg={infoBoxBg} borderRadius="md">
                    <Text fontSize="xs" color="gray.600" fontWeight="medium" mb={1}>
                      Additional Notes
                    </Text>
                    <Text fontSize="sm" color="gray.800">
                      {job.notes}
                    </Text>
                  </Box>
                )}
              </VStack>
            </Box>

            {customerProfile?.bio && (
              <>
                <Divider />
                <Box>
                  <Text fontSize="sm" fontWeight="bold" color="gray.700" mb={3}>
                    About Customer
                  </Text>
                  <Box p={3} bg={infoBoxBg} borderRadius="md">
                    <Text fontSize="sm" color="gray.800" lineHeight="tall">
                      {customerProfile.bio}
                    </Text>
                  </Box>
                </Box>
              </>
            )}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

