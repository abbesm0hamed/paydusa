import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

import { trackCartEventWorkflow } from "../../../workflows/track-cart-events";
import {
  trackProductViewWorkflow,
  trackSearchEventWorkflow,
} from "../../../workflows/track-user-events";

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { event, properties } = req.body;

  try {
    switch (event) {
      case "product_viewed": {
        await trackProductViewWorkflow(req.scope).run({
          input: {
            customer_id: properties.customer_id,
            product_id: properties.product_id,
            variant_id: properties.variant_id,
          },
        });
        break;
      }

      case "search_performed": {
        await trackSearchEventWorkflow(req.scope).run({
          input: {
            customer_id: properties.customer_id,
            query: properties.query,
            results_count: properties.results_count || 0,
          },
        });
        break;
      }

      case "add_to_cart": {
        if (properties.cart_id) {
          await trackCartEventWorkflow(req.scope).run({
            input: {
              event_type: "item_added",
              id: properties.cart_id,
            },
          });
        }
        break;
      }

      default: {
        return res.status(400).json({
          error: `Unsupported event type: ${event}`,
        });
      }
    }

    res.status(200).json({
      message: `Event ${event} tracked successfully`,
      success: true,
    });
  } catch (error) {
    console.error("Analytics tracking error:", error);
    res.status(500).json({
      details: error.message,
      error: "Failed to track analytics event",
    });
  }
};
