import { Modules } from "@medusajs/framework/utils";
import { createWorkflow, createStep } from "@medusajs/framework/workflows-sdk";

interface CartWorkflowInput {
  cart_id: string;
  event_type: "item_added" | "item_removed" | "item_updated";
  customer_id?: string;
}

const trackCartEventStep = createStep(
  "track-cart-event-step",
  async (
    { cart_id, event_type, customer_id }: CartWorkflowInput,
    { container }
  ) => {
    const analyticsModuleService = container.resolve(Modules.ANALYTICS);

    await analyticsModuleService.track({
      actor_id: customer_id,
      event: `cart_${event_type}`,
      properties: {
        cart_id,
        customer_id,
        event_type,
        timestamp: new Date(),
      },
    });
  }
);

export const trackCartEventWorkflow = createWorkflow(
  "track-cart-event",
  ({ cart_id, event_type, customer_id }: CartWorkflowInput) => {
    trackCartEventStep({
      cart_id,
      customer_id,
      event_type,
    });
  }
);

// Separate workflow for checkout started
interface CheckoutWorkflowInput {
  cart_id: string;
  customer_id?: string;
  total?: number;
  currency?: string;
}

const trackCheckoutStartedStep = createStep(
  "track-checkout-started-step",
  async (
    { cart_id, customer_id, total, currency }: CheckoutWorkflowInput,
    { container }
  ) => {
    const analyticsModuleService = container.resolve(Modules.ANALYTICS);

    await analyticsModuleService.track({
      actor_id: customer_id,
      event: "checkout_started",
      properties: {
        cart_id,
        currency: currency || "USD",
        customer_id,
        timestamp: new Date(),
        total: total || 0,
      },
    });
  }
);

export const trackCheckoutStartedWorkflow = createWorkflow(
  "track-checkout-started",
  ({ cart_id, customer_id, total, currency }: CheckoutWorkflowInput) => {
    trackCheckoutStartedStep({
      cart_id,
      currency,
      customer_id,
      total,
    });
  }
);
