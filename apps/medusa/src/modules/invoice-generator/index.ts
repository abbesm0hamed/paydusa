import { Module } from "@medusajs/framework/utils";

import createDefaultConfigLoader from "./loaders/create-default-config";
import InvoiceModuleService from "./service";

export const INVOICE_MODULE = "invoiceGenerator";

export default Module(INVOICE_MODULE, {
  service: InvoiceModuleService,
  loaders: [createDefaultConfigLoader],
});
