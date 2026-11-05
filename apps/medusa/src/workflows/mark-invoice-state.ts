import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { useQueryGraphStep } from "@medusajs/medusa/core-flows";

import { InvoiceStatus } from "../modules/invoice-generator/models/invoice";
import { updateInvoicesStep } from "./steps/update-invoices";

interface WorkflowInput {
  order_id: string;
}

export const markInvoicesStaleWorkflow = createWorkflow(
  "mark-invoices-stale",
  (input: WorkflowInput) => {
    const updatedInvoices = updateInvoicesStep({
      data: {
        status: InvoiceStatus.STALE,
      },
      selector: {
        order_id: input.order_id,
      },
    });

    return new WorkflowResponse({
      invoices: updatedInvoices,
    });
  }
);
