import z from "zod";
import { departmentBaseSchema } from "./department.base.schema";

export const createDepartmentRequestSchema = departmentBaseSchema;
export type CreateDepartmentRequestSchemaType = z.infer<typeof createDepartmentRequestSchema>;
