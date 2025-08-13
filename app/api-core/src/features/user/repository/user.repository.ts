import { prisma } from "packages/prisma/dist";
import { OrganizationAddressEntity, UserEntity } from "packages/types/dist";

const db = prisma;

const create = async (userData: any): Promise<UserEntity> => {
  return await db.user.create({
    data: {
      organization_id: userData.organization_id,
      email: userData.email,
      full_name: userData.full_name,
      hash_password: userData.hashedPassword,
    },
  });
};

const getByEmail = async (email: string): Promise<UserEntity | null> => {
  return await db.user.findUnique({
    where: {
      email,
    },
  });
};

const getById = async (id: string): Promise<UserEntity | null> => {
  return await db.user.findUnique({
    where: {
      id,
    },
  });
};

export const UserRepository = { create, getByEmail, getById };
