import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework"
import { trackUserSignupWorkflow } from "../workflows/track-user-events"

export default async function userEventHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string; email?: string; first_name?: string; last_name?: string }>) {
  await trackUserSignupWorkflow(container)
    .run({
      input: {
        customer_id: data.id,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
      },
    })
}

export const config: SubscriberConfig = {
  event: "customer.created",
}
