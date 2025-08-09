import { prisma } from "packages/prisma/dist";
import { UserEntity } from "packages/types/dist";

const db = prisma;

const create = async (userData: any) => {
  return await db.user.create({
    data: {
      email: userData.email,
      full_name: userData.full_name,
      hash_password: userData.password,
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

export const UserRepository = { create, getByEmail };
