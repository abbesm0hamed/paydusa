import { 
  defineMiddlewares,
  validateAndTransformBody,
  authenticate,
  errorHandler,
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import * as Sentry from "@sentry/node"
import { SearchSchema } from "./store/products/search/route"

const originalErrorHandler = errorHandler()

export default defineMiddlewares({
  errorHandler: (
    error: MedusaError | any, 
    req: MedusaRequest, 
    res: MedusaResponse, 
    next: MedusaNextFunction
  ) => {
    Sentry.captureException(error)
    return originalErrorHandler(error, req, res, next)
  },
  routes: [
    {
      matcher: "/store/products/search",
      method: ["POST"],
      middlewares: [
        validateAndTransformBody(SearchSchema),
      ],
    },
    {
      matcher: "/admin/algolia/sync",
      method: ["POST"],
      middlewares: [
        authenticate("user", ["session", "bearer"]),
      ],
    },
  ],
})
