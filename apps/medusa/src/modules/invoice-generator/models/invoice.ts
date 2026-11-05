import { model } from "@medusajs/framework/utils";

export enum InvoiceStatus {
  LATEST = "latest",
  STALE = "stale",
}

export const Invoice = model.define("invoice", {
  display_id: model.autoincrement(),
  id: model.id().primaryKey(),
  order_id: model.text(),
  pdfContent: model.json(),
  status: model.enum(InvoiceStatus).default(InvoiceStatus.LATEST),
});
