export type UserEntity = {
  id: string;
  full_name: string;
  email: string;
  hash_password: string;
  created_at: Date;
  updated_at?: Date | null;
};
