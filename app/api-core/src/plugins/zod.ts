import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import {
  validatorCompiler,
  serializerCompiler,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";

export type { ZodTypeProvider } from "fastify-type-provider-zod";

export default fp(
  async function zodPlugin(app: FastifyInstance) {
    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);
  },
  { name: "zod-plugin" }
);

export { jsonSchemaTransform };
