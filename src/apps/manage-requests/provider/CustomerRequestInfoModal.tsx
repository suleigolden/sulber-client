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
  Badge,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import { UserProfile, Job } from "@suleigolden/sulber-api-client";
import { FaUser, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaDollarSign } from "react-icons/fa";
import { fullAddress } from "~/common/utils/address";
import { formatDateToStringWithTime } from "~/common/utils/date-time";
import { formatNumberWithCommas } from "~/common/utils/currency-formatter";

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
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const infoBg = useColorModeValue("gray.50", "gray.700");

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
      <ModalContent bg={bg} borderRadius="xl" boxShadow="2xl">
        <ModalHeader>
          <HStack spacing={3}>
            <Avatar
              size="md"
              src={customerProfile?.avatarUrl || undefined}
              name={`${customerProfile?.firstName || ""} ${customerProfile?.lastName || ""}`}
              icon={<FaUser />}
            />
            <VStack align="start" spacing={0}>
              <Text fontSize="lg" fontWeight="bold">
                {customerProfile?.firstName} {customerProfile?.lastName}
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
                {customerProfile?.phoneNumber && (
                  <HStack spacing={3} p={3} bg={infoBg} borderRadius="md">
                    <Icon as={FaPhone} color="brand.500" />
                    <Text fontSize="sm" color="gray.800">
                      {customerProfile.phoneNumber}
                    </Text>
                  </HStack>
                )}
                {customerProfile?.dateOfBirth && (
                  <HStack spacing={3} p={3} bg={infoBg} borderRadius="md">
                    <Icon as={FaCalendarAlt} color="brand.500" />
                    <Text fontSize="sm" color="gray.800">
                      Date of Birth: {new Date(customerProfile.dateOfBirth).toLocaleDateString()}
                    </Text>
                  </HStack>
                )}
                {customerProfile?.gender && (
                  <HStack spacing={3} p={3} bg={infoBg} borderRadius="md">
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
                <HStack spacing={3} p={3} bg={infoBg} borderRadius="md">
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

                {job.scheduledStart && (
                  <HStack spacing={3} p={3} bg={infoBg} borderRadius="md">
                    <Icon as={FaClock} color="brand.500" />
                    <VStack align="start" spacing={0} flex={1}>
                      <Text fontSize="xs" color="gray.600" fontWeight="medium">
                        Scheduled Time
                      </Text>
                      <Text fontSize="sm" color="gray.800" fontWeight="medium">
                        {formatDateToStringWithTime(job.scheduledStart as string)}
                      </Text>
                    </VStack>
                  </HStack>
                )}

                {job.totalPriceCents && (
                  <HStack spacing={3} p={3} bg={infoBg} borderRadius="md">
                    <Icon as={FaDollarSign} color="brand.500" />
                    <VStack align="start" spacing={0} flex={1}>
                      <Text fontSize="xs" color="gray.600" fontWeight="medium">
                        Service Price
                      </Text>
                      <Text fontSize="sm" color="gray.800" fontWeight="bold">
                        ${formatNumberWithCommas(Number(job.totalPriceCents) / 100)}
                      </Text>
                    </VStack>
                  </HStack>
                )}

                {job.notes && (
                  <Box p={3} bg={infoBg} borderRadius="md">
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
                  <Box p={3} bg={infoBg} borderRadius="md">
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

