import {
  Container,
  Flex,
  Text,
  VStack,
  Heading,
  Spinner,
  SimpleGrid,
  Card,
  CardBody,
  Image,
  Badge,
  Icon,
  Button,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  useToast,
  Box,
} from "@chakra-ui/react";
import { api, } from "@suleigolden/sulber-api-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "~/hooks/use-user";
import { FaBed, FaBath, FaMapMarkerAlt, FaUsers, FaPlus, FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";
import { formatCurrency } from "~/common/utils/helperFuntions";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useRef, useState } from "react";
import { ReserveACarService } from "../car-service/ReserveACarService";

export const ProviderDashboard = () => {
  const { user } = useUser();
  
  return (
    <Container maxW="1500px" px={[4, 8]} py={8}>
      <VStack align="start" spacing={8} w="full" mt={10}>
        <ReserveACarService />
      </VStack>
   
    </Container>
  );
};
