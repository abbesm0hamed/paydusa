import { createWorkflow, createStep } from "@medusajs/framework/workflows-sdk"
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"
import { Modules } from "@medusajs/framework/utils"
import { OrderDTO } from "@medusajs/framework/types"

type StepInput = {
  order: OrderDTO
}

const trackOrderPlacedStep = createStep(
  "track-order-placed-step",
  async ({ order }: StepInput, { container }) => {
    const analyticsModuleService = container.resolve(Modules.ANALYTICS)

    await analyticsModuleService.track({
      event: "order_placed",
      actor_id: order.customer_id,
      properties: {
        order_id: order.id,
        total: order.total,
        items: order.items?.map((item) => ({
          variant_id: item.variant_id,
          product_id: item.product_id,
          quantity: item.quantity,
        })),
        customer_id: order.customer_id,
      },
    })
  }
)

type WorkflowInput = {
  order_id: string
}

export const trackOrderPlacedWorkflow = createWorkflow(
  "track-order-placed-workflow",
  ({ order_id }: WorkflowInput) => {
    const { data: orders } = useQueryGraphStep({
      entity: "order",
      fields: [
        "*",
        "customer.*",
        "items.*",
      ],
      filters: {
        id: order_id,
      },
    })
    
    trackOrderPlacedStep({
      order: orders[0],
    } as unknown as StepInput)
  }
)
