import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { useQueryGraphStep } from "@medusajs/medusa/core-flows";

import { sendNotificationStep } from "./steps/send-notification";

interface WorkflowInput {
  id: string;
}

export const sendOrderConfirmationWorkflow = createWorkflow(
  "send-order-confirmation",
  ({ id }: WorkflowInput) => {
    const { data: orders } = useQueryGraphStep({
      entity: "order",
      fields: [
        "id",
        "display_id",
        "email",
        "currency_code",
        "total",
        "items.*",
        "shipping_address.*",
        "billing_address.*",
        "shipping_methods.*",
        "customer.*",
        "total",
        "subtotal",
        "discount_total",
        "shipping_total",
        "tax_total",
        "item_subtotal",
        "item_total",
        "item_tax_total",
      ],
      filters: {
        id,
      },
    });

    const notification = sendNotificationStep([
      {
        channel: "email",
        data: {
          order: orders[0],
        },
        template: "order-placed",
        to: orders[0].email,
      },
    ]);

    return new WorkflowResponse(notification);
  }
);
