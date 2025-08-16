import z from "zod";
import { employeeEntitySchema } from "../entity.schema";

export const deleteEmployeeRequestSchema = employeeEntitySchema.pick({
  id: true,
});
export type deleteEmployeeRequestSchemaType = z.infer<typeof deleteEmployeeRequestSchema>;
