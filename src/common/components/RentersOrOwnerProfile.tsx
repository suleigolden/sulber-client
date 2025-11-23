import { 
  Box, 
  Text, 
  VStack, 
  HStack, 
  Avatar, 
  Badge, 
  Flex, 
  Icon, 
  Divider, 
  SimpleGrid,
  useColorModeValue,
  Card,
  CardBody,
  Tooltip,
  Tag,
  TagLabel,
  TagLeftIcon,
} from "@chakra-ui/react";
import { ListingRequest, Renter } from "@suleigolden/co-renting-api-client";
import { 
  FaUser, 
  FaBriefcase, 
  FaGraduationCap, 
  FaHeart, 
  FaPaw, 
  FaSmoking, 
  FaPhone, 
  FaMapMarkerAlt,
  FaStar,
  FaLightbulb,
  FaTools,
  FaGamepad,
  FaMusic,
  FaBook,
  FaDumbbell,
  FaPlane,
  FaCamera,
  FaHandsHelping,
  FaUsers,
  FaLeaf,
  FaUtensils,
  FaCalculator,
  FaBroom,
  FaHammer,
  FaLaptop,
  FaComments,
  FaCalendarAlt,
  FaPaintBrush,
  FaCookie
} from "react-icons/fa";
import { useUser } from "~/hooks/use-user";
import { formatDateToStringWithoutTime } from "../utils/date-time";
import { AcceptOrRejectActions } from "~/apps/accept-or-reject-listing-requests/AcceptOrRejectActions";

type RentersOrOwnerProfileProps = {
  renter: Renter;
  isPerformAction?: boolean;
  listingId: string;
  listingRequestId?: string;
  listingRequests?: ListingRequest[];
};

// Icon mapping for interests and skills
const interestIcons: Record<string, React.ElementType> = {
  'cooking': FaUtensils,
  'reading': FaBook,
  'gaming': FaGamepad,
  'music': FaMusic,
  'fitness': FaDumbbell,
  'travel': FaPlane,
  'photography': FaCamera,
  'volunteering': FaHandsHelping,
  'socializing': FaUsers,
  'gardening': FaLeaf,
  'art': FaPaintBrush,
  'baking': FaCookie,
  'maintenance': FaTools,
  'cleaning': FaBroom,
  'carpentry': FaHammer,
  'technology': FaLaptop,
  'communication': FaComments,
  'organization': FaCalculator,
  'planning': FaCalendarAlt,
  'creativity': FaPaintBrush
};

const getInterestIcon = (interest: string) => {
  const normalizedInterest = interest.toLowerCase();
  return interestIcons[normalizedInterest] || FaHeart;
};

export const RentersOrOwnerProfile: React.FC<RentersOrOwnerProfileProps> = ({ renter, isPerformAction = false, listingId, listingRequestId, listingRequests }) => {
  const {user} = useUser();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const textSecondaryColor = useColorModeValue('gray.600', 'gray.300');
  const accentColor = useColorModeValue('brand.500', 'brand.300');

  if (!renter) {
    return null;
  }

  if (user.id === renter.user_id) {
    return null;
  }
   const listingRequest = listingRequests
    ?.find((request) => request.listing_id === listingId && 
      request.tenant_or_owner_id === renter.user?.id);


  return (
    <Card 
      bg={bgColor} 
      borderWidth="1px" 
      borderColor={borderColor}
      borderRadius="xl" 
      boxShadow="lg" 
      overflow="hidden"
      _hover={{ transform: 'translateY(-2px)', transition: 'all 0.2s' }}
    >
      <CardBody p={6}>
        <VStack align="start" spacing={6} w="full">
          {/* Header */}
          <Flex w="full" align="center" justify="space-between">
            {/* <Heading size="lg" color={textColor} fontWeight="bold">
              Profile Information
            </Heading> */}
            <HStack spacing={2}>
                <Tooltip label="Has pets">
                  <Badge colorScheme="green" variant="subtle" px={3} py={1} borderRadius="full">
                    <Icon as={FaPaw} mr={1} />
                    Pets: {renter.has_pets ? "Yes" : "No"}
                  </Badge>
                </Tooltip>
                <Tooltip label="Smoker">
                  <Badge colorScheme="red" variant="subtle" px={3} py={1} borderRadius="full">
                    <Icon as={FaSmoking} mr={1} />
                    Smoker: {renter.smoker ? "Yes" : "No"}
                  </Badge>
                </Tooltip>
            </HStack>
          </Flex>

          {/* Main Profile Section */}
          <HStack spacing={6} w="full" align="start">
            <Avatar 
              name={`${renter.user?.first_name} ${renter.user?.last_name}`} 
              src={renter.avatar} 
              size="xl"
              border="4px solid"
              borderColor={accentColor}
            />
            
            <VStack align="start" spacing={3} flex={1}>
              <Box>
                <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                  {renter.user?.first_name} {renter.user?.last_name}
                </Text>
                <Text fontSize="sm" color={textSecondaryColor}>
                  Member since {formatDateToStringWithoutTime(renter?.created_at?.toString() || "")}
                </Text>
              </Box>

              {/* Contact Information */}
              {renter.mobile && (
                <HStack spacing={2}>
                  <Icon as={FaPhone} color={accentColor} />
                  <Text fontSize="sm" color={textSecondaryColor}>
                    {renter.mobile}
                  </Text>
                </HStack>
              )}

              {renter.address && (
                <HStack spacing={2}>
                  <Icon as={FaMapMarkerAlt} color={accentColor} />
                  <Text fontSize="sm" color={textSecondaryColor}>
                    {renter.address?.city}, {renter.address?.state} {renter.address?.country}
                  </Text>
                </HStack>
              )}
            </VStack>
          </HStack>

          <Divider />

          {/* Bio Section */}
          {renter.bio && (
            <Box w="full">
              <HStack spacing={2} mb={3}>
                <Icon as={FaUser} color={accentColor} />
                <Text fontWeight="semibold" color={textColor}>About</Text>
              </HStack>
              <Box 
                p={4} 
                bg={useColorModeValue('gray.50', 'gray.700')} 
                borderRadius="md"
                dangerouslySetInnerHTML={{ __html: renter.bio }}
                fontSize="sm"
                lineHeight="1.6"
                color={textSecondaryColor}
              />
            </Box>
          )}

          {/* Work & Education */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
            {renter.my_work && (
              <Box>
                <HStack spacing={2} mb={3}>
                  <Icon as={FaBriefcase} color={accentColor} />
                  <Text fontWeight="semibold" color={textColor}>Work: </Text>
                  <Text fontSize="sm" color={textSecondaryColor}  borderRadius="md">
                    {renter.my_work}
                  </Text>
                </HStack>
              </Box>
            )}

            {renter.my_school && (
              <Box>
                <HStack spacing={2} mb={3}>
                  <Icon as={FaGraduationCap} color={accentColor} />
                  <Text fontWeight="semibold" color={textColor}>Education: </Text>
                  <Text fontSize="sm" color={textSecondaryColor}  borderRadius="md">
                    {renter.my_school}
                  </Text>
                </HStack>
              </Box>
            )}
          </SimpleGrid>

          {/* Hobbies */}
            <Box w="full">
              <HStack spacing={2} mb={3}>
                <Icon as={FaHeart} color={accentColor} />
                <Text fontWeight="semibold" color={textColor}>Hobbies: </Text>
                <Text fontSize="sm" color={textSecondaryColor}  borderRadius="md">
                  {renter.my_hobbies}
                </Text>
              </HStack>
            </Box>

          {/* Goals */}
            <Box w="full">
              <HStack spacing={2} mb={3}>
                <Icon as={FaStar} color={accentColor} />
                <Text fontWeight="semibold" color={textColor}>Goals: </Text>
                <Text fontSize="sm" color={textSecondaryColor}  borderRadius="md">
                  {renter.my_goals}
                </Text>
              </HStack>
            </Box>

          {/* Fun Facts */}
            <Box w="full">
              <HStack spacing={2} mb={3}>
                <Icon as={FaLightbulb} color={accentColor} />
                <Text fontWeight="semibold" color={textColor}>Fun Facts: </Text>
                <Text fontSize="sm" color={textSecondaryColor}  borderRadius="md">
                  {renter.my_fun_facts}
                </Text>
              </HStack>
            </Box>

          {/* Interests */}
          {renter.my_interests && renter.my_interests.length > 0 && (
            <Box w="full">
              <HStack spacing={2} mb={3}>
                <Icon as={FaHeart} color={accentColor} />
                <Text fontWeight="semibold" color={textColor}>Interests: </Text>
              </HStack>
              <Flex wrap="wrap" gap={2}>
                {renter.my_interests.map((interest, index) => (
                  <Tag key={index} colorScheme="brand" variant="subtle" size="md">
                    <TagLeftIcon as={getInterestIcon(interest)} />
                    <TagLabel>{interest}</TagLabel>
                  </Tag>
                ))}
              </Flex>
            </Box>
          )}

          {/* Skills */}
          {renter.my_skills && renter.my_skills.length > 0 && (
            <Box w="full">
              <HStack spacing={2} mb={3}>
                <Icon as={FaTools} color={accentColor} />
                <Text fontWeight="semibold" color={textColor}>Skills: </Text>
              </HStack>
              <Flex wrap="wrap" gap={2}>
                {renter.my_skills.map((skill, index) => (
                  <Tag key={index} colorScheme="green" variant="subtle" size="md">
                    <TagLeftIcon as={getInterestIcon(skill)} />
                    <TagLabel>{skill}</TagLabel>
                  </Tag>
                ))}
              </Flex>
            </Box>
          )}
          {listingRequest?.note && (
            <Box w="full">
              <HStack spacing={2} mb={3}>
                <Icon as={FaUser} color={accentColor} />
                <Text fontWeight="semibold" color={textColor}>Message from{" "} 
                  {listingRequest.listing?.listing_type === "rent" ? "prospective renter" : "prospective owner"}: </Text>
                <Text fontSize="sm" color={textSecondaryColor}  borderRadius="md">
                  {listingRequest?.note}
                </Text>
              </HStack>
            </Box>
          )}
          <Flex justify="flex-end" w="full">
            {isPerformAction && listingRequest && <AcceptOrRejectActions listingRequest={listingRequest} userId={renter.user?.id as string} />}
          </Flex>
        </VStack>
      </CardBody>
    </Card>
  );
};