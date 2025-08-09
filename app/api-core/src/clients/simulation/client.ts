import { ShipRequest, ShipResponse } from "./types";

const baseURL = process.env.API_SIM_BASE_URL ?? "http://localhost:3002";

export class SimulationApiClient {
  private baseURL: string;

  constructor(baseURLOverride?: string) {
    this.baseURL = baseURLOverride ?? baseURL;
  }

  async ship(body: ShipRequest, signal?: AbortSignal): Promise<ShipResponse> {
    const res = await fetch(`${this.baseURL}/ship`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal,
    });

    const data = (await res.json().catch(() => ({}))) as ShipResponse;

    if (!res.ok) {
      return {
        ok: false,
        error: (data as any)?.error ?? `HTTP_${res.status}`,
        message: (data as any)?.message ?? res.statusText,
        details: (data as any)?.details,
      };
    }

    return data;
  }
}

export const simulationClient = new SimulationApiClient();
