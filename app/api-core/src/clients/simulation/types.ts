export type ShipRequest = {
  orderId: string;
  recipientName: string;
  address: string;
  postalCode: string;
  city: string;
  state: string;
  country: string;
  scheduledDate?: string;
  simulateError?: boolean;
};

export type ShipSuccess = {
  ok: true;
  status: "shipped";
  trackingId: string;
  provider: "simulation";
  scheduledDate: string | null;
};

export type ShipError = {
  ok: false;
  error: string;
  message?: string;
  details?: unknown;
};

export type ShipResponse = ShipSuccess | ShipError;
