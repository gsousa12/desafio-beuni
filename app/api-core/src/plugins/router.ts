import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import { userRoutes } from "../features/user/routes/user.routes";
import healthRoutes from "../routes/health";
import { authRoutes } from "../features/auth/routes/auth.routes";
import { departmentRoutes } from "../features/department/routes/department.routes";
import { employeeRoutes } from "../features/employee/routes/employee.routes";
import { organizationRoutes } from "../features/organization/routes/organization.routes";

const apiRoutePrefix: string = "/api";

const routerPlugin = async (application: FastifyInstance) => {
  application.register(organizationRoutes, { prefix: `${apiRoutePrefix}/organization` });
  application.register(userRoutes, { prefix: `${apiRoutePrefix}/users` });
  application.register(authRoutes, { prefix: `${apiRoutePrefix}/auth` });
  application.register(departmentRoutes, { prefix: `${apiRoutePrefix}/department` });
  application.register(employeeRoutes, { prefix: `${apiRoutePrefix}/employee` });

  application.register(healthRoutes, { prefix: "/health" });
};

export default fp(routerPlugin);
