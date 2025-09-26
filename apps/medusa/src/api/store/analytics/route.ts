import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { 
  trackProductViewWorkflow,
  trackSearchEventWorkflow 
} from "../../../workflows/track-user-events"
import { trackCartEventWorkflow } from "../../../workflows/track-cart-events"

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { event, properties } = req.body

  try {
    switch (event) {
      case "product_viewed":
        await trackProductViewWorkflow(req.scope)
          .run({
            input: {
              product_id: properties.product_id,
              customer_id: properties.customer_id,
              variant_id: properties.variant_id,
            },
          })
        break

      case "search_performed":
        await trackSearchEventWorkflow(req.scope)
          .run({
            input: {
              query: properties.query,
              results_count: properties.results_count || 0,
              customer_id: properties.customer_id,
            },
          })
        break

      case "add_to_cart":
        if (properties.cart_id) {
          await trackCartEventWorkflow(req.scope)
            .run({
              input: {
                id: properties.cart_id,
                event_type: "item_added",
              },
            })
        }
        break

      default:
        return res.status(400).json({
          error: `Unsupported event type: ${event}`,
        })
    }

    res.status(200).json({
      success: true,
      message: `Event ${event} tracked successfully`,
    })
  } catch (error) {
    console.error("Analytics tracking error:", error)
    res.status(500).json({
      error: "Failed to track analytics event",
      details: error.message,
    })
  }
}
