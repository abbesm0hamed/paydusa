import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { useQueryGraphStep } from "@medusajs/medusa/core-flows";

import { InvoiceStatus } from "../modules/invoice-generator/models/invoice";
import { updateInvoicesStep } from "./steps/update-invoices";

type WorkflowInput = {
  order_id: string;
};

export const markInvoicesStaleWorkflow = createWorkflow(
  "mark-invoices-stale",
  (input: WorkflowInput) => {
    const updatedInvoices = updateInvoicesStep({
      selector: {
        order_id: input.order_id,
      },
      data: {
        status: InvoiceStatus.STALE,
      },
    });

    return new WorkflowResponse({
      invoices: updatedInvoices,
    });
  }
);
