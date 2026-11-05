import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

export const GET = (req: MedusaRequest, res: MedusaResponse) => {
  res.sendStatus(200);
};
