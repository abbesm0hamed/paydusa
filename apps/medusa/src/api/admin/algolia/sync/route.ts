import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules } from "@medusajs/framework/utils";

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const eventModuleService = req.scope.resolve(Modules.EVENT_BUS);
  await eventModuleService.emit({
    data: {},
    name: "algolia.sync",
  });
  res.send({
    message: "Syncing data to Algolia",
  });
};
