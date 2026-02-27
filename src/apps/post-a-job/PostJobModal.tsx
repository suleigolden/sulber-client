import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  SimpleGrid,
  Text,
  Textarea,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { MdAdd, MdDelete } from "react-icons/md";
import {
  api,
  CarWashServiceAddOnPriceEntries,
  ProviderServiceTypesList,
  type AddOnPriceEntry,
  type CreateProviderJobServiceRequest,
} from "@suleigolden/sulber-api-client";
import { CustomToast } from "~/hooks/CustomToast";
import { LocationSearchInput } from "~/apps/provider-onboard/components/LocationSearchInput";
import {
  DAYS_OF_WEEK,
  emptyLocation,
  locationFromSearch,
  slotsToDaysOfWeekAvailable,
  type AvailabilitySlot,
  type ProviderJobServiceLocation,
} from "./location-utils";

const DRIVEWAY_CAR_WASH = "DRIVEWAY_CAR_WASH";

const ADD_ON_LABELS: Record<(typeof CarWashServiceAddOnPriceEntries)[number], string> = {
  interior_deep_cleaning: "Interior deep cleaning",
  wax_polish: "Wax & polish",
  engine_bay_cleaning: "Engine bay cleaning",
  odor_removal: "Odor removal",
  multiple_vehicles_discount: "Multiple vehicles discount",
};

type FormValues = {
  serviceType: string;
  priceDollars: string;
  sedanPriceDollars: string;
  suvPriceDollars: string;
  truckPriceDollars: string;
  vanPriceDollars: string;
  addOnPriceDollars: Record<(typeof CarWashServiceAddOnPriceEntries)[number], string>;
  primaryLocation: ProviderJobServiceLocation | null;
  otherLocations: ProviderJobServiceLocation[];
  description: string;
  notes: string;
  availabilitySlots: AvailabilitySlot[];
};

const defaultSlots: AvailabilitySlot[] = DAYS_OF_WEEK.map((day) => ({
  day,
  selected: false,
  startTime: "",
  endTime: "",
}));

const defaultAddOnPriceDollars = Object.fromEntries(
  CarWashServiceAddOnPriceEntries.map((key) => [key, ""])
) as FormValues["addOnPriceDollars"];

const defaultValues: FormValues = {
  serviceType: "",
  priceDollars: "",
  sedanPriceDollars: "",
  suvPriceDollars: "",
  truckPriceDollars: "",
  vanPriceDollars: "",
  addOnPriceDollars: defaultAddOnPriceDollars,
  primaryLocation: null,
  otherLocations: [],
  description: "",
  notes: "",
  availabilitySlots: defaultSlots,
};

type PostJobModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  providerId: string;
};

export function PostJobModal({
  isOpen,
  onClose,
  onSuccess,
  providerId,
}: PostJobModalProps) {
  const showToast = CustomToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mutedColor = useColorModeValue("gray.600", "gray.400");
  const sectionBorder = useColorModeValue("gray.200", "whiteAlpha.300");
  const bg = useColorModeValue("white", "#0b1437");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
  });

  const serviceType = watch("serviceType");
  const primaryLocation = watch("primaryLocation");
  const otherLocations = watch("otherLocations");
  const availabilitySlots = watch("availabilitySlots") ?? defaultSlots;
  const isDrivewayCarWash = serviceType === DRIVEWAY_CAR_WASH;

  const addOtherLocation = useCallback(() => {
    setValue("otherLocations", [...(otherLocations ?? []), emptyLocation()]);
  }, [otherLocations, setValue]);

  const removeOtherLocation = useCallback(
    (index: number) => {
      const next = [...(otherLocations ?? [])];
      next.splice(index, 1);
      setValue("otherLocations", next);
    },
    [otherLocations, setValue]
  );

  const updateSlot = useCallback(
    (index: number, field: "startTime" | "endTime" | "selected", value: string | boolean) => {
      const next = [...(availabilitySlots ?? defaultSlots)];
      if (!next[index]) return;
      next[index] = { ...next[index], [field]: value };
      setValue("availabilitySlots", next);
    },
    [availabilitySlots, setValue]
  );

  const selectAllDays = useCallback(
    (checked: boolean) => {
      const next = (availabilitySlots ?? defaultSlots).map((s) => ({ ...s, selected: checked }));
      setValue("availabilitySlots", next);
    },
    [availabilitySlots, setValue]
  );

  const allSelected =
    (availabilitySlots ?? defaultSlots).length > 0 &&
    (availabilitySlots ?? defaultSlots).every((s) => s.selected);
  const someSelected = (availabilitySlots ?? defaultSlots).some((s) => s.selected);

  const onSubmit = async (data: FormValues) => {
    if (!data.primaryLocation?.street?.trim()) {
      showToast("Error", "Select a primary location.", "error");
      return;
    }

    const primary = data.primaryLocation!;
    const others = data.otherLocations?.filter((l) => l?.street?.trim()) ?? [];
    const daysOfWeek = slotsToDaysOfWeekAvailable(data.availabilitySlots ?? defaultSlots);

    let priceCents: number;
    let basePriceCents: number | undefined;
    let sedanPriceCents: number | undefined;
    let suvPriceCents: number | undefined;
    let truckPriceCents: number | undefined;
    let vanPriceCents: number | undefined;
    let addOnPrice: AddOnPriceEntry[] | undefined;

    if (data.serviceType === DRIVEWAY_CAR_WASH) {
      const sedan = Math.round(parseFloat(data.sedanPriceDollars || "0") * 100);
      const suv = Math.round(parseFloat(data.suvPriceDollars || "0") * 100);
      const truck = Math.round(parseFloat(data.truckPriceDollars || "0") * 100);
      const van = Math.round(parseFloat(data.vanPriceDollars || "0") * 100);
      if (sedan < 0 || suv < 0 || truck < 0 || van < 0) {
        showToast("Error", "Vehicle prices must be zero or positive.", "error");
        return;
      }
      priceCents = sedan;
      basePriceCents = sedan;
      sedanPriceCents = sedan;
      suvPriceCents = suv;
      truckPriceCents = truck;
      vanPriceCents = van;
      addOnPrice = CarWashServiceAddOnPriceEntries.map((key) => {
        const cents = Math.round(parseFloat(data.addOnPriceDollars?.[key] || "0") * 100);
        return { [key]: { price: cents } };
      });
    } else {
      priceCents = Math.round(parseFloat(data.priceDollars || "0") * 100);
      if (priceCents < 0) {
        showToast("Error", "Price must be a positive number.", "error");
        return;
      }
    }

    const payload: CreateProviderJobServiceRequest = {
      providerId,
      serviceType: data.serviceType as CreateProviderJobServiceRequest["serviceType"],
      price:priceCents,
      basePrice:basePriceCents,
      sedanPrice:sedanPriceCents,
      suvPrice:suvPriceCents,
      truckPrice:truckPriceCents,
      vanPrice:vanPriceCents,
      addOnPrices:addOnPrice,
      primaryLocation: primary as ProviderJobServiceLocation,
      otherLocations: others,
      description: data.description?.trim() || undefined,
      notes: data.notes?.trim() || undefined,
      status: "active",
      daysOfWeekAvailable: daysOfWeek,
    };

    setIsSubmitting(true);
    try {
      await api.service("provider-job-service").createProviderJob(payload);
      showToast("Success", "Your service has been posted successfully.", "success");
      reset(defaultValues);
      onClose();
      onSuccess();
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Failed to post job. Please try again.";
      showToast("Error", message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="2xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent borderRadius="2xl" maxH="90vh" bg={bg}>
        <ModalHeader fontWeight="600" fontSize="lg">
          Post a service
          <Text fontSize="sm" mt={2} borderWidth="1px" borderColor="gray.200" borderRadius="md" p={2}>
            Important: The currency type is based on your current country location.
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            align="stretch"
            spacing={6}
          >
            <FormControl isInvalid={!!errors.serviceType} isRequired>
              <FormLabel fontWeight="600" fontSize="sm">
                Service type
              </FormLabel>
              <Select
                placeholder="Select service type"
                {...register("serviceType", { required: "Select a service type" })}
                size="md"
                borderRadius="lg"
                borderColor="gray.200"
                _dark={{ borderColor: "whiteAlpha.300" }}
              >
                {ProviderServiceTypesList.services.map((s) => (
                  <option key={s.type} value={s.type}>
                    {s.title}
                  </option>
                ))}
              </Select>
              {errors.serviceType && (
                <FormHelperText color="red.500">
                  {errors.serviceType.message}
                </FormHelperText>
              )}
            </FormControl>

            {isDrivewayCarWash ? (
              <>
                <Box
                  p={4}
                  borderRadius="xl"
                  borderWidth="1px"
                  borderColor={sectionBorder}
                >
                  <Text fontWeight="600" fontSize="sm" mb={1} color={mutedColor}>
                    Vehicle prices (per vehicle type)
                  </Text>
                  <Text mt={0} mb={3} color={mutedColor} fontSize="sm">
                    Set your base price for each vehicle type in dollars.
                  </Text>
                  <SimpleGrid columns={{ base: 2, sm: 4 }} spacing={4}>
                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="500">
                        Sedan Price
                      </FormLabel>
                      <Input
                        type="number"
                        step="0.01"
                        min={0}
                        placeholder="0.00"
                        {...register("sedanPriceDollars")}
                        size="md"
                        borderRadius="lg"
                        borderColor="gray.200"
                        _dark={{ borderColor: "whiteAlpha.300" }}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="500">
                        SUV Price
                      </FormLabel>
                      <Input
                        type="number"
                        step="0.01"
                        min={0}
                        placeholder="0.00"
                        {...register("suvPriceDollars")}
                        size="md"
                        borderRadius="lg"
                        borderColor="gray.200"
                        _dark={{ borderColor: "whiteAlpha.300" }}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="500">
                        Truck Price
                      </FormLabel>
                      <Input
                        type="number"
                        step="0.01"
                        min={0}
                        placeholder="0.00"
                        {...register("truckPriceDollars")}
                        size="md"
                        borderRadius="lg"
                        borderColor="gray.200"
                        _dark={{ borderColor: "whiteAlpha.300" }}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="500">
                        Van Price
                      </FormLabel>
                      <Input
                        type="number"
                        step="0.01"
                        min={0}
                        placeholder="0.00"
                        {...register("vanPriceDollars")}
                        size="md"
                        borderRadius="lg"
                        borderColor="gray.200"
                        _dark={{ borderColor: "whiteAlpha.300" }}
                      />
                    </FormControl>
                  </SimpleGrid>
                </Box>
                <Box
                  p={4}
                  borderRadius="xl"
                  borderWidth="1px"
                  borderColor={sectionBorder}
                >
                  <Text fontWeight="600" fontSize="sm" mb={1} color={mutedColor}>
                    Add-on prices (optional)
                  </Text>
                  <Text mt={0} mb={3} color={mutedColor} fontSize="sm">
                    Charge extra for add-ons; leave 0 if not offered.
                  </Text>
                  <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                    {CarWashServiceAddOnPriceEntries.map((key) => (
                      <FormControl key={key}>
                        <FormLabel fontSize="sm" fontWeight="500">
                          {ADD_ON_LABELS[key]} Price
                        </FormLabel>
                        <Input
                          type="number"
                          step="0.01"
                          min={0}
                          placeholder="0.00"
                          {...register(`addOnPriceDollars.${key}`)}
                          size="md"
                          borderRadius="lg"
                          borderColor="gray.200"
                          _dark={{ borderColor: "whiteAlpha.300" }}
                        />
                      </FormControl>
                    ))}
                  </SimpleGrid>
                </Box>
              </>
            ) : (
              <FormControl isInvalid={!!errors.priceDollars} isRequired>
                <FormLabel fontWeight="600" fontSize="sm">
                  Price (How much do you charge for this service?)
                </FormLabel>
                <Input
                  type="number"
                  step="0.01"
                  min={0}
                  placeholder="e.g. 25.00"
                  {...register("priceDollars", {
                    required: isDrivewayCarWash ? false : "Enter a price",
                    min: { value: 0, message: "Price must be positive" },
                  })}
                  size="md"
                  borderRadius="lg"
                  borderColor="gray.200"
                  _dark={{ borderColor: "whiteAlpha.300" }}
                />
                {errors.priceDollars && (
                  <FormHelperText color="red.500">
                    {errors.priceDollars.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}

            <FormControl isRequired>
              <FormLabel fontWeight="600" fontSize="sm">
                Primary location (where you will be offering your service)
              </FormLabel>
              <Box mt={1}>
                <LocationSearchInput
                  initialValue={primaryLocation ? [primaryLocation.street, primaryLocation.city, primaryLocation.state].filter(Boolean).join(", ") : undefined}
                  onLocationSelect={(result) => {
                    if (result) setValue("primaryLocation", locationFromSearch(result));
                    else setValue("primaryLocation", null);
                  }}
                />
              </Box>
              {!primaryLocation?.street?.trim() && (
                <FormHelperText color={mutedColor}>
                  Search and select your main service address.
                </FormHelperText>
              )}
            </FormControl>

            <FormControl>
              <FormLabel fontWeight="600" fontSize="sm">
                Other locations (optional)
              </FormLabel>
              <VStack align="stretch" spacing={3} mt={2}>
                {(otherLocations ?? []).map((_, index) => (
                  <HStack key={index} align="flex-start" spacing={2}>
                    <Box flex={1}>
                      <LocationSearchInput
                        initialValue={otherLocations?.[index] ? [otherLocations[index].street, otherLocations[index].city, otherLocations[index].state].filter(Boolean).join(", ") : undefined}
                        onLocationSelect={(result) => {
                          if (result) {
                            const next = [...(otherLocations ?? [])];
                            next[index] = locationFromSearch(result);
                            setValue("otherLocations", next);
                          }
                        }}
                      />
                    </Box>
                    <IconButton
                      aria-label="Remove location"
                      icon={<MdDelete />}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => removeOtherLocation(index)}
                      mt={1}
                    />
                  </HStack>
                ))}
                <Button
                  type="button"
                  leftIcon={<MdAdd />}
                  variant="outline"
                  size="sm"
                  onClick={addOtherLocation}
                  borderRadius="lg"
                >
                  Add location
                </Button>
              </VStack>
            </FormControl>

            <FormControl>
              <FormLabel fontWeight="600" fontSize="sm">
                Description (optional)
              </FormLabel>
              <Textarea
                placeholder="Describe what's included."
                {...register("description")}
                rows={3}
                borderRadius="lg"
                resize="vertical"
                borderColor="gray.200"
                _dark={{ borderColor: "whiteAlpha.300" }}
              />
            </FormControl>

            <FormControl>
              <FormLabel fontWeight="600" fontSize="sm">
                Internal notes (optional)
              </FormLabel>
              <Textarea
                placeholder="Notes for yourself (not shown to customers)."
                {...register("notes")}
                rows={2}
                borderRadius="lg"
                resize="vertical"
                borderColor="gray.200"
                _dark={{ borderColor: "whiteAlpha.300" }}
              />
            </FormControl>

            <FormControl>
              <FormLabel fontWeight="600" fontSize="sm">
                Availability
              </FormLabel>
              <FormHelperText color={mutedColor} mb={3}>
                Select days and set your available time slots for each.
              </FormHelperText>
              <Checkbox
                isChecked={allSelected}
                isIndeterminate={someSelected && !allSelected}
                onChange={(e) => selectAllDays(e.target.checked)}
                colorScheme="brand"
                mb={3}
                fontWeight="500"
              >
                Select all days
              </Checkbox>
              <VStack align="stretch" spacing={3}>
                {(availabilitySlots ?? defaultSlots).map((slot, index) => (
                  <SimpleGrid key={slot.day} columns={{ base: 1, sm: 2 }} gap={0} alignItems="center" w="full">
                    <Checkbox
                      isChecked={slot.selected}
                      onChange={(e) => updateSlot(index, "selected", e.target.checked)}
                      colorScheme="brand"
                      fontWeight="500"
                      fontSize="sm"
                      w="200px"
                    >
                      {slot.day}
                    </Checkbox>
                    <HStack spacing={0} flex={1} w="full" ml={{base: 0, sm: -40}}>
                    <Text as="span" fontSize="sm" color={mutedColor} mr={1}>
                        From:
                      </Text>
                      <Input
                        type="time"
                        size="sm"
                        borderRadius="lg"
                        isDisabled={!slot.selected}
                        {...register(`availabilitySlots.${index}.startTime`)}
                        onChange={(e) => updateSlot(index, "startTime", e.target.value)}
                      />
                      <Text as="span" fontSize="sm" color={mutedColor} mr={1} ml={1}>
                        To:
                      </Text>
                      <Input
                        type="time"
                        size="sm"
                        borderRadius="lg"
                        pl={0}
                        isDisabled={!slot.selected}
                        {...register(`availabilitySlots.${index}.endTime`)}
                        onChange={(e) => updateSlot(index, "endTime", e.target.value)}
                      />
                    </HStack>
                  </SimpleGrid>
                ))}
              </VStack>
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter gap={2}>
          <Button variant="ghost" onClick={handleClose} borderRadius="lg">
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            colorScheme="brand"
            bg="brand.500"
            color="white"
            _hover={{ bg: "brand.600" }}
            isLoading={isSubmitting}
            loadingText="Posting..."
            borderRadius="lg"
          >
            Post service
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
