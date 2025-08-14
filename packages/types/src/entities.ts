export type OrganizationEntity = {
  id: String;
  name: String;
  cnpj: String;
  created_at: Date;
  updated_at?: Date | null;
};

export type UserEntity = {
  id: string;
  organization_id: string;
  full_name: string;
  email: string;
  hash_password: string;
  created_at: Date;
  updated_at?: Date | null;
};

export type OrganizationAddressEntity = {
  id: string;
  organization_id: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  zip_code: string;
  number: string;
  created_at: Date;
  updated_at?: Date | null;
  deleted_at?: Date | null;
};

export type DepartmentEntity = {
  id: string;
  organization_id: string;
  name: string;
  description?: string | null;
  created_at: Date;
  updated_at?: Date | null;
  deleted_at?: Date | null;
};

export type EmployeeEntity = {
  id: string;
  organization_id: string;
  department_id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  position: string;
  birth_date: Date;
  birth_date_month: String;
  birth_date_day: String;
  birth_date_year: String;
  created_at: Date;
  updated_at?: Date | null;
  deleted_at?: Date | null;
};

export type BirthdayEmployee = {
  employee: Pick<EmployeeEntity, "id" | "name" | "email" | "position"> & {
    birth_date?: string;
  };
  organization: {
    id: string;
    name: string;
    address: Pick<
      OrganizationAddressEntity,
      "state" | "city" | "neighborhood" | "street" | "zip_code" | "number"
    >;
  };
};
