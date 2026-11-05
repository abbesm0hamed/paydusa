import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { MedusaError } from "@medusajs/framework/utils";

export const GET = (_req: MedusaRequest, _res: MedusaResponse) => {
  throw new MedusaError(
    MedusaError.Types.UNEXPECTED_STATE,
    "This is a test error for Sentry integration."
  );
};
