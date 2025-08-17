import { ShippingRequest, ShippingResult, ShippingApiResponse } from "./types";

const BASE_URL = process.env.API_SIM_BASE_URL ?? "http://localhost:3002";
const TIMEOUT_MS = 30_000;

const shouldRetryError = (statusCode: number): boolean => {
  return statusCode >= 500 || statusCode === 408 || statusCode === 429;
};

const createShippingClient = (baseURLOverride?: string) => {
  const baseURL = baseURLOverride ?? BASE_URL;

  const ship = async (request: ShippingRequest): Promise<ShippingResult> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const res = await fetch(`${baseURL}/api/ship/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = (await res.json().catch(() => ({}))) as ShippingApiResponse;

      if (!res.ok) {
        return {
          success: false,
          error: data?.message || `HTTP_${res.status}`,
          message: data?.message,
          shouldRetry: shouldRetryError(res.status),
        };
      }

      if (data.status === "success" && Array.isArray(data.data) === false) {
        return {
          success: true,
          data: {
            shippingId: data.data.shippingId,
            destination: data.data.destination,
            expectedArrival: data.data.expectedArrival,
            shippingCost: data.data.shippingCost,
            requestId: data.meta.requestId,
            timestamp: data.meta.timestamp,
          },
        };
      }

      return {
        success: false,
        error: data.message || "Unknown API error",
        shouldRetry: true,
      };
    } catch (err: any) {
      clearTimeout(timeoutId);

      if (err?.name === "AbortError") {
        return { success: false, error: "Request timeout", shouldRetry: true };
      }
      return { success: false, error: err?.message ?? "Network error", shouldRetry: true };
    }
  };

  return {
    ship,
  };
};

export const shippingClient = createShippingClient();
export const createShippingApiClient = createShippingClient;
