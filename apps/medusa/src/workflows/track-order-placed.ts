import type { OrderDTO } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";
import { createWorkflow, createStep } from "@medusajs/framework/workflows-sdk";
import { useQueryGraphStep } from "@medusajs/medusa/core-flows";

interface StepInput {
  order: OrderDTO;
}

const trackOrderPlacedStep = createStep(
  "track-order-placed-step",
  async ({ order }: StepInput, { container }) => {
    const analyticsModuleService = container.resolve(Modules.ANALYTICS);

    await analyticsModuleService.track({
      actor_id: order.customer_id,
      event: "order_placed",
      properties: {
        customer_id: order.customer_id,
        items: order.items?.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          variant_id: item.variant_id,
        })),
        order_id: order.id,
        total: order.total,
      },
    });
  }
);

interface WorkflowInput {
  order_id: string;
}

export const trackOrderPlacedWorkflow = createWorkflow(
  "track-order-placed-workflow",
  ({ order_id }: WorkflowInput) => {
    const { data: orders } = useQueryGraphStep({
      entity: "order",
      fields: ["*", "customer.*", "items.*"],
      filters: {
        id: order_id,
      },
    });

    trackOrderPlacedStep({
      order: orders[0],
    } as unknown as StepInput);
  }
);
