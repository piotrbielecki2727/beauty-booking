import { Router } from "express";

import { getTenantContextController } from "@/modules/tenant/tenant.controller";
import { asyncHandler } from "@/utils/asyncHandler";

const tenantRouter = Router();

tenantRouter.get("/context", asyncHandler(getTenantContextController));

export { tenantRouter };
