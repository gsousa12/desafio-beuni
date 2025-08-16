import z from "zod";
import { employeeEntitySchema } from "../entity.schema";

export const getEmployeeRequestSchema = employeeEntitySchema.pick({
  id: true,
});
export type getEmployeeRequestSchemaType = z.infer<typeof getEmployeeRequestSchema>;
