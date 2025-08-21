import { paginationSchema } from "app/api-core/src/_shared/schemas/common.schemas";
import z from "zod";

export const getAllDepartmentRequestSchema = paginationSchema;
export type getAllDepartmentRequestSchemaType = z.infer<typeof getAllDepartmentRequestSchema>;
