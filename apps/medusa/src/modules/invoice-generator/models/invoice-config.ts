import { model } from "@medusajs/framework/utils";

export const InvoiceConfig = model.define("invoice_config", {
  company_address: model.text(),
  company_email: model.text(),
  company_logo: model.text().nullable(),
  company_name: model.text(),
  company_phone: model.text(),
  id: model.id().primaryKey(),
  notes: model.text().nullable(),
});
