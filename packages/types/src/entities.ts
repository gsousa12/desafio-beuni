export type UserEntity = {
  id: string;
  full_name: string;
  email: string;
  hash_password: string;
  created_at: Date;
  updated_at?: Date | null;
};

export type UserAddressEntity = {
  id: string;
  user_id: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  zip_code: string;
  number: string;
  created_at: Date;
  updated_at?: Date | null;
};
