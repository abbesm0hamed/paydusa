import { createWorkflow, createStep } from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"

type CartWorkflowInput = {
  cart_id: string
  event_type: "item_added" | "item_removed" | "item_updated"
  customer_id?: string
}

const trackCartEventStep = createStep(
  "track-cart-event-step",
  async ({ cart_id, event_type, customer_id }: CartWorkflowInput, { container }) => {
    const analyticsModuleService = container.resolve(Modules.ANALYTICS)

    await analyticsModuleService.track({
      event: `cart_${event_type}`,
      actor_id: customer_id,
      properties: {
        cart_id,
        event_type,
        customer_id,
        timestamp: new Date(),
      },
    })
  }
)

export const trackCartEventWorkflow = createWorkflow(
  "track-cart-event",
  ({ cart_id, event_type, customer_id }: CartWorkflowInput) => {
    trackCartEventStep({
      cart_id,
      event_type,
      customer_id,
    })
  }
)

// Separate workflow for checkout started
type CheckoutWorkflowInput = {
  cart_id: string
  customer_id?: string
  total?: number
  currency?: string
}

const trackCheckoutStartedStep = createStep(
  "track-checkout-started-step",
  async ({ cart_id, customer_id, total, currency }: CheckoutWorkflowInput, { container }) => {
    const analyticsModuleService = container.resolve(Modules.ANALYTICS)

    await analyticsModuleService.track({
      event: "checkout_started",
      actor_id: customer_id,
      properties: {
        cart_id,
        customer_id,
        total: total || 0,
        currency: currency || "USD",
        timestamp: new Date(),
      },
    })
  }
)

export const trackCheckoutStartedWorkflow = createWorkflow(
  "track-checkout-started",
  ({ cart_id, customer_id, total, currency }: CheckoutWorkflowInput) => {
    trackCheckoutStartedStep({
      cart_id,
      customer_id,
      total,
      currency,
    })
  }
)
