import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { z } from "zod";

const shipBodySchema = z.object({
  orderId: z.string().min(1),
  recipientName: z.string().min(1),
  address: z.string().min(1),
  postalCode: z.string().min(3),
  city: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
  scheduledDate: z.string().datetime().optional(),
  simulateError: z.boolean().optional(),
});

export default async function routes(app: FastifyInstance, _opts: FastifyPluginOptions) {
  app.post("/", async (request, reply) => {
    const parseResult = shipBodySchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        ok: false,
        error: "INVALID_BODY",
        details: parseResult.error.issues,
      });
    }
    const data = parseResult.data;

    if (data.simulateError) {
      app.log.error({ orderId: data.orderId }, "Shipping simulation failed (forced)");
      return reply.status(500).send({
        ok: false,
        error: "SHIP_FAILED",
        message: "Simulated failure from shipping provider",
      });
    }

    const trackingId = `SIM-${Date.now().toString(36).toUpperCase()}`;

    app.log.info({ orderId: data.orderId, trackingId }, "Shipping simulation success");

    return reply.status(200).send({
      ok: true,
      status: "shipped",
      trackingId,
      provider: "simulation",
      scheduledDate: data.scheduledDate ?? null,
    });
  });
}
