import { shippingClient } from "../client";
import { giftDeliveryRepository } from "../repository/gift-delivery.repository";
import { BirthdayJobData, GiftDeliveryResult, DeliveryMetadata } from "../types";

export const processGiftDelivery = async (
  jobData: BirthdayJobData
): Promise<GiftDeliveryResult> => {
  const employeeId = jobData.data.employee.id;

  if (!employeeId) {
    return {
      success: false,
      employeeId: "unknown",
      error: "Missing employeeId",
      shouldRetry: false,
    };
  }

  const alreadyExists = await giftDeliveryRepository.findExistingDelivery(employeeId);
  if (alreadyExists) {
    return { success: true, employeeId, error: "Delivery already processed today" };
  }

  const shippingResult = await shippingClient.ship(jobData as any);
  if (!shippingResult.success) {
    return {
      success: false,
      employeeId,
      error: shippingResult.error,
      shouldRetry: shippingResult.shouldRetry,
    };
  }

  const metadata: DeliveryMetadata = {
    shippingId: shippingResult.data.shippingId,
    destination: shippingResult.data.destination,
    expectedArrival: shippingResult.data.expectedArrival,
    shippingCost: shippingResult.data.shippingCost,
    processedAt: new Date().toISOString(),
  };

  await giftDeliveryRepository.createDelivery(employeeId, metadata);
  return { success: true, employeeId, shippingId: shippingResult.data.shippingId };
};

export const giftDeliveryService = {
  processGiftDelivery,
};
