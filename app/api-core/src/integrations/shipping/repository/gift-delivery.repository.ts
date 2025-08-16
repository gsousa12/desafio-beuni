import { prisma } from "packages/prisma/dist";
import { DeliveryMetadata } from "../types";

const db = prisma;

export class GiftDeliveryRepository {
  async createDelivery(employeeId: string, metadata: DeliveryMetadata): Promise<{ id: string }> {
    const delivery = await db.employeeGiftDeliveries.create({
      data: {
        employee_id: employeeId,
        metadata: metadata as any,
      },
      select: { id: true },
    });
    return delivery;
  }

  async findExistingDelivery(employeeId: string): Promise<boolean> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const existing = await db.employeeGiftDeliveries.findFirst({
      where: {
        employee_id: employeeId,
        created_at: { gte: startOfDay, lt: endOfDay },
      },
      select: { id: true },
    });

    return !!existing;
  }
}

export const giftDeliveryRepository = new GiftDeliveryRepository();
