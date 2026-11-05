import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

export const GET = (req: MedusaRequest, res: MedusaResponse): void => {
  const config = req.scope.resolve("configModule");

  res.redirect(302, config.admin.path || "/app");
};
