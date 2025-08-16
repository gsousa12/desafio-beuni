import { FastifyReply, FastifyRequest } from "fastify";
import { apiSimulationResponseType } from "../../@types/response";
import { BirthdayJobData } from "packages/types/dist";
import {
  getRandomExpectedArrival,
  getRandomShippingCost,
  randomSuccessRate,
} from "../../_shared/utils";

type ShipGiftRequestType = BirthdayJobData;

export const shipGiftHandler = async (
  request: FastifyRequest<{ Body: ShipGiftRequestType }>,
  reply: FastifyReply
) => {
  console.log(request.body);
  const success = await randomSuccessRate();
  if (success) {
    const address = request.body.data.organization.address;
    const response: apiSimulationResponseType = {
      status: "success",
      message: "Brinde enviado com sucesso",
      meta: {
        requestId: `request-${crypto.randomUUID()}`,
        timestamp: new Date().toISOString(),
      },
      data: {
        shippingId: `shipping-${crypto.randomUUID()}`,
        destination: {
          state: address.state,
          city: address.city,
          neighborhood: address.neighborhood,
          street: address.street,
          number: address.number,
        },
        expectedArrival: getRandomExpectedArrival(),
        shippingCost: getRandomShippingCost(),
      },
    };

    return reply.status(200).send(response);
  } else {
    const response: apiSimulationResponseType = {
      status: "error",
      message: "Erro ao enviar o brinde",
      meta: {
        requestId: `request-${crypto.randomUUID()}`,
        timestamp: new Date().toISOString(),
      },
      data: [],
    };

    return reply.status(500).send(response);
  }
};
