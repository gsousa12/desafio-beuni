import { prisma } from "packages/prisma/dist";
import { UserAddressEntity, UserEntity } from "packages/types/dist";

const db = prisma;

const create = async (userData: any): Promise<UserEntity> => {
  return await db.user.create({
    data: {
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

const createAddress = async (userId: string, addressData: any): Promise<UserAddressEntity> => {
  return await db.userAddress.create({
    data: {
      user_id: userId,
      state: addressData.state,
      city: addressData.city,
      neighborhood: addressData.neighborhood,
      street: addressData.street,
      zip_code: addressData.zip_code,
      number: addressData.number,
    },
  });
};

const getAddressByUserId = async (userId: string): Promise<UserAddressEntity | null> => {
  return await db.userAddress.findFirst({
    where: {
      user_id: userId,
    },
  });
};

export const UserRepository = { create, getByEmail, getById, createAddress, getAddressByUserId };
