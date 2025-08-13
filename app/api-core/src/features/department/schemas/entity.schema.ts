import {
  createdAtSchema,
  deletedAtSchema,
  descriptionSchema,
  idSchema,
  nameSchema,
  updatedAtSchema,
} from "app/api-core/src/_shared/schemas/common.schemas";
import { entitySchemaFromType } from "app/api-core/src/_shared/utils/utils";
import { DepartmentEntity } from "packages/types/dist";
import z from "zod";

export const departmentEntitySchema = entitySchemaFromType<DepartmentEntity>()(
  z.object({
    id: idSchema,
    organization_id: idSchema,
    name: nameSchema,
    description: descriptionSchema,
    created_at: createdAtSchema,
    updated_at: updatedAtSchema,
    deleted_at: deletedAtSchema,
  })
);
