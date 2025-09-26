import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework"
import { trackCartEventWorkflow } from "../workflows/track-cart-events"

export default async function cartEventHandler({
  event: { name, data },
  container,
}: SubscriberArgs<{ id: string; customer_id?: string }>) {
  let eventType: "item_added" | "item_removed" | "item_updated"
  
  switch (name) {
    case "cart.item_added":
      eventType = "item_added"
      break
    case "cart.item_removed":
      eventType = "item_removed"
      break
    case "cart.item_updated":
      eventType = "item_updated"
      break
    default:
      return // Skip unknown events
  }

  await trackCartEventWorkflow(container)
    .run({
      input: {
        cart_id: data.id,
        event_type: eventType,
        customer_id: data.customer_id,
      },
    })
}

export const config: SubscriberConfig = {
  event: [
    "cart.item_added",
    "cart.item_removed", 
    "cart.item_updated",
  ],
}
