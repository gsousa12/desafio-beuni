import z from "zod";
import { departmentEntitySchema } from "../entity.schema";

export const createDepartmentRequestSchema = departmentEntitySchema.pick({
  name: true,
  description: true,
});
export type CreateDepartmentRequestSchemaType = z.infer<typeof createDepartmentRequestSchema>;
