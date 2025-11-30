import { InferType, number, object, string } from "yup";

export const VehicleSchema = object().shape({
  make: string().optional(),
  model: string().optional(),
  // year: number().nullable().optional(),
  color: string().optional(),
  licensePlate: string().optional(),
  notes: string().optional(),
});

export type VehicleSchemaType = InferType<typeof VehicleSchema>;

