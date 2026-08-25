import type { Request, Response } from "express";

import { resolveTenantContextFromRequest } from "@/modules/tenant/tenant.service";

const getTenantContextController = async (
  request: Request,
  response: Response,
) => {
  const result = await resolveTenantContextFromRequest(request);

  response.json(result);
};

export { getTenantContextController };
