import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import { userRoutes } from "../features/user/routes/user.routes";
import healthRoutes from "../routes/health";
import { authRoutes } from "../features/auth/routes/auth.routes";

const apiRoutePrefix: string = "/api";

const routerPlugin = async (application: FastifyInstance) => {
  application.register(userRoutes, { prefix: `${apiRoutePrefix}/users` });
  application.register(authRoutes, { prefix: `${apiRoutePrefix}/auth` });
  application.register(healthRoutes, { prefix: "/health" });
};

export default fp(routerPlugin);
