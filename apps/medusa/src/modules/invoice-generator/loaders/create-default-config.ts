import type {
  LoaderOptions,
  IMedusaInternalService,
} from "@medusajs/framework/types";

import type { InvoiceConfig } from "../models/invoice-config";

export default async function createDefaultConfigLoader({
  container,
}: LoaderOptions) {
  const service: IMedusaInternalService<typeof InvoiceConfig> =
    container.resolve("invoiceConfigService");

  const [_, count] = await service.listAndCount();

  if (count > 0) {
    return;
  }

  await service.create({
    company_address: "123 Paydusa, TN, 37201",
    company_email: "admin@paydusa.com",
    company_name: "Paydusa",
    company_phone: "+216 ** *** ***",
  });
}
