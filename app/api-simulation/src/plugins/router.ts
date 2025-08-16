import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import { shipRoutes } from "../features/ship/ship.routes";

const apiRoutePrefix: string = "/api";

const routerPlugin = async (application: FastifyInstance) => {
  application.register(shipRoutes, { prefix: `${apiRoutePrefix}/ship` });
};

export default fp(routerPlugin);
