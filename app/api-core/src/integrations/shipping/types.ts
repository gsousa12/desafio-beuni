import { BirthdayJobData } from "./types";

export type { BirthdayJobData } from "packages/types/dist";

export type ApiSimulationDestination = {
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
};

export type ApiSimulationResponseData = {
  shippingId: string;
  destination: ApiSimulationDestination;
  expectedArrival: string;
  shippingCost: number;
};

export type ApiSimulationResponse = {
  status: "success" | "error";
  message: string;
  data: ApiSimulationResponseData | [];
  meta: {
    requestId: string;
    timestamp: string;
  };
};

export type GiftDeliveryResult = {
  success: boolean;
  employeeId: string;
  shippingId?: string;
  error?: string;
  shouldRetry?: boolean;
};

export type DeliveryMetadata = {
  shippingId: string;
  destination: ApiSimulationDestination;
  expectedArrival: string;
  shippingCost: number;
  processedAt: string;
  attempts?: number;
};

export type ShippingRequest = BirthdayJobData;

export type ShippingApiResponse = {
  status: "success" | "error";
  message: string;
  data:
    | {
        shippingId: string;
        destination: {
          state: string;
          city: string;
          neighborhood: string;
          street: string;
          number: string;
        };
        expectedArrival: string;
        shippingCost: number;
      }
    | [];
  meta: {
    requestId: string;
    timestamp: string;
  };
};

export type ShippingResult =
  | {
      success: true;
      data: {
        shippingId: string;
        destination: {
          state: string;
          city: string;
          neighborhood: string;
          street: string;
          number: string;
        };
        expectedArrival: string;
        shippingCost: number;
        requestId: string;
        timestamp: string;
      };
    }
  | {
      success: false;
      error: string;
      message?: string;
      shouldRetry: boolean;
    };
