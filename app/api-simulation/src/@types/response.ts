export type apiSimulationDestinationType = {
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
};

export type apiSimulationResponseDataType = {
  shippingId: string;
  destination: apiSimulationDestinationType;
  expectedArrival: string;
  shippingCost: number;
};

export type apiSimulationResponseType = {
  status: "success" | "error";
  message: string;
  data: apiSimulationResponseDataType | [];
  meta: {
    requestId: string;
    timestamp: string;
  };
};
