import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogHeader,
  Box,
  Button,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import type { CustomerVehicle } from "@suleigolden/sulber-api-client";
import { useRef } from "react";

function formatVehicleLabel(vehicle: CustomerVehicle): string {
  const parts: string[] = [];
  if (vehicle.year) parts.push(String(vehicle.year));
  if (vehicle.make) parts.push(vehicle.make);
  if (vehicle.model) parts.push(vehicle.model);
  if (vehicle.color) parts.push(vehicle.color);
  if (vehicle.license_plate) parts.push(`(${vehicle.license_plate})`);
  return parts.length > 0 ? parts.join(" ") : "Unnamed vehicle";
}

type SelectAdditionalCarDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  vehicles: CustomerVehicle[];
  excludeVehicleIds?: string[];
  onSelect: (vehicleId: string) => void;
  isLoading?: boolean;
};

export const SelectAdditionalCarDialog = ({
  isOpen,
  onClose,
  vehicles,
  excludeVehicleIds = [],
  onSelect,
  isLoading = false,
}: SelectAdditionalCarDialogProps) => {
  const modalBg = useColorModeValue("white", "#0b1437");
  const headerColor = useColorModeValue("gray.800", "white");
  const labelColor = useColorModeValue("gray.600", "gray.300");
  const cancelRef = useRef<HTMLButtonElement | null>(null);

  const available = vehicles.filter((v) => !excludeVehicleIds.includes(v.id));

  return (
    <AlertDialog isOpen={isOpen} onClose={onClose} leastDestructiveRef={cancelRef}>
      <AlertDialogContent bg={modalBg}>
        <AlertDialogHeader fontSize="lg" fontWeight="bold" color={headerColor}>
          Add another car
        </AlertDialogHeader>
        <AlertDialogBody>
          <Text fontSize="sm" color={labelColor} mb={3}>
            Select a vehicle to add another car wash request.
          </Text>
          {isLoading ? (
            <Text fontSize="sm" color={labelColor}>
              Loading vehicles...
            </Text>
          ) : available.length === 0 ? (
            <Text fontSize="sm" color={labelColor}>
              No more vehicles to add. Add vehicles in your profile first.
            </Text>
          ) : (
            <VStack align="stretch" spacing={2}>
              {available.map((vehicle) => (
                <Button
                  key={vehicle.id}
                  size="sm"
                  variant="outline"
                  colorScheme="brand"
                  justifyContent="flex-start"
                  onClick={() => {
                    onSelect(vehicle.id);
                    onClose();
                  }}
                >
                  {formatVehicleLabel(vehicle)}
                </Button>
              ))}
            </VStack>
          )}
          <Button
            ref={cancelRef}
            size="sm"
            variant="ghost"
            mt={4}
            w="full"
            onClick={onClose}
          >
            Cancel
          </Button>
        </AlertDialogBody>
      </AlertDialogContent>
    </AlertDialog>
  );
};
