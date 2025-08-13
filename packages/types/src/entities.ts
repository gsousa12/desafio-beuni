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
  department_id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  position: string;
  birth_date: Date;
  created_at: Date;
  updated_at?: Date | null;
  deleted_at?: Date | null;
};
