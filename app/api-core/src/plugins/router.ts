import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import { userRoutes } from "../features/user/routes/user.routes";
import healthRoutes from "../routes/health";

const apiRoutePrefix: string = "/api";

const routerPlugin = async (application: FastifyInstance) => {
  application.register(userRoutes, { prefix: `${apiRoutePrefix}/users` });

  application.register(healthRoutes, { prefix: "/health" });
};

export default fp(routerPlugin);
