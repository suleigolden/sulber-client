import { InferType, number, object, string } from "yup";

export const VehicleSchema = object().shape({
  vehicleType: string().required("Vehicle type is required"),
  make: string().optional(),
  model: string().optional(),
  color: string().optional(),
  licensePlate: string().optional(),
  notes: string().optional(),
});

export type VehicleSchemaType = InferType<typeof VehicleSchema>;

