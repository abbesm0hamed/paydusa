import type { OrderDTO, OrderLineItemDTO } from "@medusajs/framework/types";
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";

import { INVOICE_MODULE } from "../../modules/invoice-generator";

export interface GenerateInvoicePdfStepInput {
  order: OrderDTO;
  items: OrderLineItemDTO[];
  invoice_id: string;
}

export const generateInvoicePdfStep = createStep(
  "generate-invoice-pdf",
  async (input: GenerateInvoicePdfStepInput, { container }) => {
    const invoiceGeneratorService = container.resolve(INVOICE_MODULE);

    const previousInv = await invoiceGeneratorService.retrieveInvoice(
      input.invoice_id
    );

    const pdfBuffer = await invoiceGeneratorService.generatePdf({
      invoice_id: input.invoice_id,
      items: input.items,
      order: input.order,
    });

    return new StepResponse(
      {
        pdf_buffer: pdfBuffer,
      },
      previousInv
    );
  },
  async (previousInv, { container }) => {
    if (!previousInv) {
      return;
    }

    const invoiceGeneratorService = container.resolve(INVOICE_MODULE);

    await invoiceGeneratorService.updateInvoices({
      id: previousInv.id,
      pdfContent: previousInv.pdfContent,
    });
  }
);
