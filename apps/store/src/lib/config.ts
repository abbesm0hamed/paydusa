import Medusa from "@medusajs/js-sdk";

// Defaults to standard port for Medusa server
let MEDUSA_BACKEND_URL = "http://localhost:9000";

if (process.env.MEDUSA_BACKEND_URL) {
  MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL;
}

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
});

const EMPTY_RESULT = {
  hits: [],
  nbHits: 0,
  nbPages: 0,
  page: 0,
  hitsPerPage: 0,
  processingTimeMS: 0,
  query: "",
  params: "",
};

export const searchClient = {
  _type: "search-client" as const,

  search: async (params: unknown) => {
    const requests = Array.isArray(params) ? params : [params];
    const results = await Promise.all(
      requests.map(async (request: Record<string, unknown>) => {
        const indexParams =
          "params" in request
            ? ((request.params as Record<string, unknown>) ?? {})
            : {};
        const query =
          (indexParams.query as string) ??
          ("query" in request ? (request.query as string) : "");

        if (!query) {
          return EMPTY_RESULT;
        }

        const res = await fetch(`/api/search`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });
        const response = (await res.json()) as {
          results: Array<Record<string, unknown>>;
        };

        return response.results?.[0] ?? EMPTY_RESULT;
      })
    );

    return { results };
  },

  searchForFacetValues: async () => {
    throw new Error(
      "searchForFacetValues is not supported with the Medusa search proxy"
    );
  },
};
