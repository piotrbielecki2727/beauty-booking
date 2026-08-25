import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "@/config/env";
import { isAllowedCorsOrigin } from "@/config/cors";
import { errorMiddleware } from "@/middlewares/error.middleware";
import { notFoundMiddleware } from "@/middlewares/notFound.middleware";
import { authRouter } from "@/modules/auth/auth.routes";
import { businessSetupRouter } from "@/modules/businessSetup/businessSetup.routes";
import {
  businessTeamRouter,
  teamInvitationsRouter,
} from "@/modules/businessTeam/businessTeam.routes";
import { tenantRouter } from "@/modules/tenant/tenant.routes";

const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      credentials: true,
      origin: (origin, callback) => {
        callback(null, isAllowedCorsOrigin(origin));
      },
    }),
  );
  app.use(express.json());
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

  app.get("/health", (_request, response) => {
    response.json({
      status: "ok",
    });
  });

  app.use("/auth", authRouter);
  app.use("/business", businessSetupRouter);
  app.use("/business/team", businessTeamRouter);
  app.use("/team-invitations", teamInvitationsRouter);
  app.use("/tenant", tenantRouter);
  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
};

export { createApp };
