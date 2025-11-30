import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  FormControl,
} from "@chakra-ui/react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { VehicleSchema, VehicleSchemaType } from "./schema";
import { CustomInputField } from "~/components/fields/CustomInputField";
import { api } from "@suleigolden/sulber-api-client";
import { useUser } from "~/hooks/use-user";
import { CustomToast } from "~/hooks/CustomToast";
import { useEffect } from "react";

type AddVehicleProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  vehicleToEdit?: {
    id: string;
    make?: string | null;
    model?: string | null;
    year?: number | null;
    color?: string | null;
    licensePlate?: string | null;
    notes?: string | null;
  } | null;
};

export const AddVehicle = ({
  isOpen,
  onClose,
  onSuccess,
  vehicleToEdit,
}: AddVehicleProps) => {
  const { user } = useUser();
  const showToast = CustomToast();
  const isEditing = !!vehicleToEdit;

  const methods = useForm<VehicleSchemaType>({
    resolver: yupResolver<VehicleSchemaType, any, any>(VehicleSchema),
    defaultValues: {
      make: "",
      model: "",
      // year: undefined,
      color: "",
      licensePlate: "",
      notes: "",
    },
  });

  const {
    setValue,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = methods;

  // Watch required fields to determine if form is valid
  const make = watch("make");
  const model = watch("model");
  const color = watch("color");
  const licensePlate = watch("licensePlate");

  const isFormValid = !!(make && model && color && licensePlate);

  // Initialize form with vehicle data when editing
  useEffect(() => {
    if (vehicleToEdit && isOpen) {
      setValue("make", vehicleToEdit.make || "");
      setValue("model", vehicleToEdit.model || "");
      // setValue("year", vehicleToEdit.year || undefined);
      setValue("color", vehicleToEdit.color || "");
      setValue("licensePlate", vehicleToEdit.licensePlate || "");
      setValue("notes", vehicleToEdit.notes || "");
    } else if (!vehicleToEdit && isOpen) {
      reset();
    }
  }, [vehicleToEdit, isOpen, setValue, reset]);

  const onSubmit = async (data: VehicleSchemaType) => {
    if (!user?.id) {
      showToast("Error", "User not found", "error");
      return;
    }

    try {
      if (isEditing && vehicleToEdit) {
        await api.service("customer-vehicle").update(vehicleToEdit.id, {
          make: data.make || null,
          model: data.model || null,
          // year: data.year || undefined,
          color: data.color || null,
          licensePlate: data.licensePlate || null,
          notes: data.notes || null,
        });
        showToast("Success", "Vehicle updated successfully", "success");
      } else {
        await api.service("customer-vehicle").create({
          userId: user.id,
          make: data.make || null,
          model: data.model || null,
          // year: data.year || null,
          color: data.color || null,
          licensePlate: data.licensePlate || null,
          notes: data.notes || null,
        });
        showToast("Success", "Vehicle added successfully", "success");
      }
      onSuccess();
      onClose();
      reset();
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "An unexpected error occurred. Please try again.";
      showToast("Error", errorMessage, "error");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: "full", md: "xl" }} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isEditing ? "Edit Vehicle" : "Add Vehicle"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormProvider {...methods}>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <CustomInputField
                  type="text"
                  label="Make"
                  registerName="make"
                  placeholder="e.g., Toyota, Honda, Ford"
                  isError={methods.formState.errors?.make}
                  isRequired
                />
              </FormControl>

              <FormControl>
                <CustomInputField
                  type="text"
                  label="Model"
                  registerName="model"
                  placeholder="e.g., Camry, Civic, F-150"
                  isError={methods.formState.errors?.model}
                  isRequired
                />
              </FormControl>

              {/* <FormControl>
                <CustomInputField
                  type="number"
                  label="Year"
                  registerName="year"
                  placeholder="e.g., 2020"
                  isError={methods.formState.errors?.year}
                  isRequired
                />
              </FormControl> */}

              <FormControl>
                <CustomInputField
                  type="text"
                  label="Color"
                  registerName="color"
                  placeholder="e.g., Red, Blue, Black"
                  isError={methods.formState.errors?.color}
                  isRequired
                />
              </FormControl>

              <FormControl>
                <CustomInputField
                  type="text"
                  label="License Plate"
                  registerName="licensePlate"
                  placeholder="e.g., ABC-1234"
                  isError={methods.formState.errors?.licensePlate}
                  isRequired
                />
              </FormControl>

              <FormControl>
                <CustomInputField
                  type="textarea"
                  label="Notes (Optional) Max 255 characters"
                  registerName="notes"
                  placeholder="Any additional notes about this vehicle..."
                  isError={methods.formState.errors?.notes}
                />
              </FormControl>

              <Button
                colorScheme="brand"
                onClick={handleSubmit(onSubmit)}
                isLoading={isSubmitting}
                isDisabled={!isFormValid}
                size={{ base: "md", sm: "lg" }}
                w="full"
                mt={4}
              >
                {isEditing ? "Update Vehicle" : "Add Vehicle"}
              </Button>
            </VStack>
          </FormProvider>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

