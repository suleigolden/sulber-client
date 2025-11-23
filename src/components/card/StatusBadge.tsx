import { FC } from 'react';
import { Flex, Badge, Text } from '@chakra-ui/react';
import { PatientCaseStatus } from '@suleigolden/cosmetic-api-client';

type StatusBadgeProp = {
    status: PatientCaseStatus;
}
export const StatusBadge: FC<StatusBadgeProp> = ({ status }) => {

  const getStatusProperties = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return 'green.500';
      case 'CLOSE':
        return 'red.500';
      case 'ERROR':
        return 'orange.500';
      default:
        return 'gray.500';
    }
  };

  const  color  = getStatusProperties(status);

  return (
    <Flex align="center">
      <Badge bg={color} me="5px" borderRadius={4}>
        <Text color="#FFF" fontSize="sm" fontWeight="700">
            {status}
        </Text>
      </Badge>
    </Flex>
  );
};
