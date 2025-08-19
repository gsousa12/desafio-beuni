import {
  citySchema,
  cnpjSchema,
  createdAtSchema,
  deletedAtSchema,
  idSchema,
  nameSchema,
  neighborhoodSchema,
  residentialNumberSchema,
  stateSchema,
  streetSchema,
  updatedAtSchema,
  zipCodeSchema,
} from "app/api-core/src/_shared/schemas/common.schemas";
import { entitySchemaFromType } from "app/api-core/src/_shared/utils/utils";
import { OrganizationAddressEntity, OrganizationEntity } from "packages/types/dist";
import z from "zod";

export const organizationEntitySchema = entitySchemaFromType<OrganizationEntity>()(
  z.object({
    id: idSchema,
    cnpj: cnpjSchema,
    legal_name: nameSchema,
    trading_name: nameSchema,
    created_at: createdAtSchema,
    updated_at: updatedAtSchema,
  })
);

export const organizationAddressEntitySchema = entitySchemaFromType<OrganizationAddressEntity>()(
  z.object({
    id: idSchema,
    organization_id: idSchema,
    state: stateSchema,
    city: citySchema,
    neighborhood: neighborhoodSchema,
    street: streetSchema,
    zip_code: zipCodeSchema,
    number: residentialNumberSchema,
    created_at: createdAtSchema,
    updated_at: updatedAtSchema,
    deleted_at: deletedAtSchema,
  })
);
