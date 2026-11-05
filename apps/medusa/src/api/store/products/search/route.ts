import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { z } from "@medusajs/framework/zod";

import { ALGOLIA_MODULE } from "../../../../modules/algolia";
import type AlgoliaModuleService from "../../../../modules/algolia/service";

export const SearchSchema = z.object({
  query: z.string().trim().min(1),
});

type SearchRequest = z.infer<typeof SearchSchema>;

export const POST = async (
  req: MedusaRequest<SearchRequest>,
  res: MedusaResponse
) => {
  const algoliaModuleService: AlgoliaModuleService =
    req.scope.resolve(ALGOLIA_MODULE);

  const { query } = req.validatedBody;

  try {
    const results = await algoliaModuleService.search(query);
    res.json(results);
  } catch (error) {
    const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER);
    logger.error(
      `Algolia product search failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
    res.status(503).json({
      message:
        "Product search is temporarily unavailable. Please try again later.",
      type: "search_unavailable",
    });
  }
};
