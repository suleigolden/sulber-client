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
  SimpleGrid,
  Text,
  Textarea,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdAdd, MdDelete } from "react-icons/md";
import {
  api,
  CarWashServiceAddOnPriceEntries,
  ProviderServiceTypesList,
  type AddOnPriceEntry,
  type ProviderJobService,
  type UpdateProviderJobServiceRequest,
} from "@suleigolden/sulber-api-client";
import { CustomToast } from "~/hooks/CustomToast";
import { LocationSearchInput } from "~/apps/provider-onboard/components/LocationSearchInput";
import {
  DAYS_OF_WEEK,
  emptyLocation,
  locationFromSearch,
  slotsToDaysOfWeekAvailable,
  daysOfWeekAvailableToSlots,
  type AvailabilitySlot,
  type ProviderJobServiceLocation,
} from "./location-utils";

type EditProviderJobModalProps = {
  job: ProviderJobService | null;
  onClose: () => void;
  onSuccess: () => void;
};

const DRIVEWAY_CAR_WASH = "DRIVEWAY_CAR_WASH";

type FormValues = {
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

const emptyFormValues: FormValues = {
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

function formValuesFromJob(job: ProviderJobService): FormValues {
  const raw: any = job as any;

  const serviceType: string = raw.serviceType ?? raw.service_type ?? "";
  const priceCents: number = raw.price ?? raw.price_cents ?? 0;
  const sedanPriceCents: number | undefined =
    raw.sedanPrice ?? raw.sedan_price ?? undefined;
  const suvPriceCents: number | undefined =
    raw.suvPrice ?? raw.suv_price ?? undefined;
  const truckPriceCents: number | undefined =
    raw.truckPrice ?? raw.truck_price ?? undefined;
  const vanPriceCents: number | undefined =
    raw.vanPrice ?? raw.van_price ?? undefined;
  const addOnPrices: AddOnPriceEntry[] =
    raw.addOnPrices ?? raw.add_on_prices ?? [];
  const primaryLocation: ProviderJobServiceLocation | null =
    raw.primaryLocation ?? raw.primary_location ?? null;
  const otherLocations: ProviderJobServiceLocation[] =
    raw.otherLocations ?? raw.other_locations ?? [];
  const daysOfWeekAvailable: string[] =
    raw.daysOfWeekAvailable ?? raw.days_of_week_available ?? [];

  const isDriveway = serviceType === DRIVEWAY_CAR_WASH;

  const addOnPriceDollars: FormValues["addOnPriceDollars"] = {
    ...defaultAddOnPriceDollars,
  };

  (addOnPrices ?? []).forEach((entry) => {
    const [key, value] = Object.entries(entry)[0] ?? [];
    if (
      key &&
      value &&
      typeof (value as { price: number }).price === "number" &&
      (CarWashServiceAddOnPriceEntries as readonly string[]).includes(key)
    ) {
      addOnPriceDollars[
        key as (typeof CarWashServiceAddOnPriceEntries)[number]
      ] = (((value as { price: number }).price || 0) / 100).toFixed(2);
    }
  });

  return {
    priceDollars: isDriveway ? "" : (priceCents / 100).toFixed(2),
    sedanPriceDollars:
      sedanPriceCents != null ? (sedanPriceCents / 100).toFixed(2) : "",
    suvPriceDollars:
      suvPriceCents != null ? (suvPriceCents / 100).toFixed(2) : "",
    truckPriceDollars:
      truckPriceCents != null ? (truckPriceCents / 100).toFixed(2) : "",
    vanPriceDollars:
      vanPriceCents != null ? (vanPriceCents / 100).toFixed(2) : "",
    addOnPriceDollars,
    primaryLocation,
    otherLocations,
    description: raw.description ?? "",
    notes: raw.notes ?? "",
    availabilitySlots: daysOfWeekAvailableToSlots(daysOfWeekAvailable),
  };
}

export function EditProviderJobModal({
  job,
  onClose,
  onSuccess,
}: EditProviderJobModalProps) {
  const isOpen = !!job;
  const rawJob: any = job ?? {};
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
    defaultValues: emptyFormValues,
  });

  useEffect(() => {
    if (job) {
      reset(formValuesFromJob(job));
    } else {
      reset(emptyFormValues);
    }
  }, [job, reset]);

  const serviceType: string =
    rawJob.serviceType ?? rawJob.service_type ?? "";
  const selectedServiceConfig = ProviderServiceTypesList.services.find(
    (s) => s.type === serviceType
  );
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
    if (!job) return;

    if (!data.primaryLocation?.street?.trim()) {
      showToast("Error", "Select a primary location.", "error");
      return;
    }

    const slots = data.availabilitySlots ?? defaultSlots;
    const selectedSlots = slots.filter((s) => s.selected);

    if (selectedSlots.length === 0) {
      showToast(
        "Error",
        "Select at least one day and time slot for availability.",
        "error"
      );
      return;
    }

    const slotWithMissingTime = selectedSlots.find(
      (s) => !s.startTime || !s.endTime
    );
    if (slotWithMissingTime) {
      showToast(
        "Error",
        `Please set both start and end time for ${slotWithMissingTime.day}.`,
        "error"
      );
      return;
    }

    const primary = data.primaryLocation!;
    const others = data.otherLocations?.filter((l) => l?.street?.trim()) ?? [];
    const daysOfWeek = slotsToDaysOfWeekAvailable(slots);

    let priceCents: number;
    let basePriceCents: number | undefined;
    let sedanPriceCents: number | undefined;
    let suvPriceCents: number | undefined;
    let truckPriceCents: number | undefined;
    let vanPriceCents: number | undefined;
    let addOnPrice: AddOnPriceEntry[] | undefined;

    const raw: any = job as any;
    const jobServiceType: string =
      raw.serviceType ?? raw.service_type ?? "";

    if (jobServiceType === DRIVEWAY_CAR_WASH) {
      const sedanStr = String(data.sedanPriceDollars ?? "").trim();
      const suvStr = String(data.suvPriceDollars ?? "").trim();
      const truckStr = String(data.truckPriceDollars ?? "").trim();
      const vanStr = String(data.vanPriceDollars ?? "").trim();

      if (!sedanStr || !suvStr || !truckStr || !vanStr) {
        showToast(
          "Error",
          "Please fill out all vehicle prices (Sedan, SUV, Truck, Van).",
          "error"
        );
        return;
      }

      const sedan = Math.round(parseFloat(sedanStr) * 100);
      const suv = Math.round(parseFloat(suvStr) * 100);
      const truck = Math.round(parseFloat(truckStr) * 100);
      const van = Math.round(parseFloat(vanStr) * 100);
      if (sedan < 0 || suv < 0 || truck < 0 || van < 0) {
        showToast("Error", "Vehicle prices must be zero or positive.", "error");
        return;
      }

      const missingAddOn = CarWashServiceAddOnPriceEntries.find(
        (key) =>
          data.addOnPriceDollars?.[key] == null ||
          String(data.addOnPriceDollars[key]).trim() === ""
      );
      if (missingAddOn) {
        showToast(
          "Error",
          "Please fill out all add-on price fields (use 0 if not offered).",
          "error"
        );
        return;
      }

      priceCents = sedan;
      basePriceCents = sedan;
      sedanPriceCents = sedan;
      suvPriceCents = suv;
      truckPriceCents = truck;
      vanPriceCents = van;
      addOnPrice = CarWashServiceAddOnPriceEntries.map((key) => {
        const cents = Math.round(
          parseFloat(data.addOnPriceDollars?.[key] || "0") * 100
        );
        return { [key]: { price: cents } };
      });
    } else {
      priceCents = Math.round(parseFloat(data.priceDollars || "0") * 100);
      if (priceCents < 0) {
        showToast("Error", "Price must be a positive number.", "error");
        return;
      }
    }

    const payload: UpdateProviderJobServiceRequest = {
      providerId: (raw.providerId ?? raw.provider_id) as string,
      serviceType: jobServiceType as UpdateProviderJobServiceRequest["serviceType"],
      price: priceCents,
      base_price: basePriceCents,
      sedan_price: sedanPriceCents,
      suv_price: suvPriceCents,
      truck_price: truckPriceCents,
      van_price: vanPriceCents,
      add_on_prices: addOnPrice,
      primary_location: primary as ProviderJobServiceLocation,
      other_locations: others,
      description: data.description?.trim() || undefined,
      notes: data.notes?.trim() || undefined,
      status: job.status,
      days_of_week_available: daysOfWeek,
    };

    setIsSubmitting(true);
    try {
      await api.service("provider-job-service").update(job.id, payload);
      showToast(
        "Success",
        "Your service has been updated successfully.",
        "success"
      );
      onClose();
      onSuccess();
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Failed to update job. Please try again.";
      showToast("Error", message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="2xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent borderRadius="2xl" maxH="90vh" bg={bg}>
        <ModalHeader fontWeight="600" fontSize="lg">
          Edit service
          {selectedServiceConfig && (
            <Text mt={1} fontSize="sm" color={mutedColor}>
              {selectedServiceConfig.title}
            </Text>
          )}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            align="stretch"
            spacing={6}
          >
            <FormControl isReadOnly>
              <FormLabel fontWeight="600">Service type</FormLabel>
              <Input
                value={selectedServiceConfig?.title || serviceType}
                isReadOnly
                borderRadius="lg"
                borderColor="gray.200"
                _dark={{ borderColor: "whiteAlpha.300" }}
              />
            </FormControl>

            {serviceType && isDrivewayCarWash ? (
              <>
                <Box
                  p={4}
                  borderRadius="xl"
                  borderWidth="1px"
                  borderColor={sectionBorder}
                >
                  <Text fontWeight="600" mb={1} color={mutedColor}>
                    Vehicle prices (per vehicle type)
                  </Text>
                  <Text mt={0} mb={3} color={mutedColor}>
                    Set your base price for each vehicle type in dollars.
                  </Text>
                  <SimpleGrid columns={{ base: 2, sm: 4 }} spacing={4}>
                    <FormControl>
                      <FormLabel fontWeight="500">Sedan Price</FormLabel>
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
                        required
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontWeight="500">SUV Price</FormLabel>
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
                        required
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontWeight="500">Truck Price</FormLabel>
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
                        required
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontWeight="500">Van Price</FormLabel>
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
                        required
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
                  <Text fontWeight="600" mb={1} color={mutedColor}>
                    Add-on prices (optional)
                  </Text>
                  <Text mt={0} mb={3} color={mutedColor}>
                    Charge extra for add-ons; leave 0 if not offered.
                  </Text>
                  <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                    {CarWashServiceAddOnPriceEntries.map((key) => (
                      <FormControl key={key}>
                        <FormLabel fontWeight="500">
                          {key.replace(/_/g, " ")} Price
                        </FormLabel>
                        <Input
                          type="number"
                          step="0.01"
                          min={0}
                          placeholder="0.00"
                          {...register(`addOnPriceDollars.${key}` as const)}
                          size="md"
                          borderRadius="lg"
                          borderColor="gray.200"
                          _dark={{ borderColor: "whiteAlpha.300" }}
                          required
                        />
                      </FormControl>
                    ))}
                  </SimpleGrid>
                </Box>
              </>
            ) : serviceType ? (
              <FormControl isInvalid={!!errors.priceDollars} isRequired>
                <FormLabel fontWeight="600">
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
                  required
                />
                {errors.priceDollars && (
                  <FormHelperText color="red.500">
                    {errors.priceDollars.message}
                  </FormHelperText>
                )}
              </FormControl>
            ) : null}

            {serviceType && (
              <>
                <FormControl isRequired>
                  <FormLabel fontWeight="600">
                    Primary location (where you will be offering your service)
                  </FormLabel>
                  <Box mt={1}>
                    <LocationSearchInput
                      initialValue={
                        primaryLocation
                          ? [primaryLocation.street, primaryLocation.city, primaryLocation.state]
                              .filter(Boolean)
                              .join(", ")
                          : undefined
                      }
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
                  <FormLabel fontWeight="600">
                    Other locations (optional)
                  </FormLabel>
                  <VStack align="stretch" spacing={3} mt={2}>
                    {(otherLocations ?? []).map((_, index) => (
                      <HStack key={index} align="flex-start" spacing={2}>
                        <Box flex={1}>
                          <LocationSearchInput
                            initialValue={
                              otherLocations?.[index]
                                ? [
                                    otherLocations[index].street,
                                    otherLocations[index].city,
                                    otherLocations[index].state,
                                  ]
                                    .filter(Boolean)
                                    .join(", ")
                                : undefined
                            }
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
                  <FormLabel fontWeight="600">Description (optional)</FormLabel>
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
                  <FormLabel fontWeight="600">Internal notes (optional)</FormLabel>
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
              </>
            )}

            {serviceType && (
              <FormControl>
                <FormLabel fontWeight="600">Availability</FormLabel>
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
                    <SimpleGrid
                      key={slot.day}
                      columns={{ base: 1, sm: 2 }}
                      gap={0}
                      alignItems="center"
                      w="full"
                    >
                      <Checkbox
                        isChecked={slot.selected}
                        onChange={(e) => updateSlot(index, "selected", e.target.checked)}
                        colorScheme="brand"
                        fontWeight="500"
                        w="200px"
                      >
                        {slot.day}
                      </Checkbox>
                      <HStack spacing={0} flex={1} w="full" ml={{ base: 0, sm: -40 }}>
                        <Text as="span" color={mutedColor} mr={1}>
                          From:
                        </Text>
                        <Input
                          type="time"
                          size="sm"
                          borderRadius="lg"
                          isDisabled={!slot.selected}
                          {...register(`availabilitySlots.${index}.startTime` as const)}
                          onChange={(e) => updateSlot(index, "startTime", e.target.value)}
                          required
                        />
                        <Text as="span" color={mutedColor} mr={1} ml={1}>
                          To:
                        </Text>
                        <Input
                          type="time"
                          size="sm"
                          borderRadius="lg"
                          pl={0}
                          isDisabled={!slot.selected}
                          {...register(`availabilitySlots.${index}.endTime` as const)}
                          onChange={(e) => updateSlot(index, "endTime", e.target.value)}
                          required
                        />
                      </HStack>
                    </SimpleGrid>
                  ))}
                </VStack>
              </FormControl>
            )}
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
            loadingText="Saving..."
            borderRadius="lg"
          >
            Save changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
