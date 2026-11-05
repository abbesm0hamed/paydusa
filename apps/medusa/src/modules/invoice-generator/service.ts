import { MedusaService } from "@medusajs/framework/utils";
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const pdfmake = require("pdfmake") as {
  addFonts(fonts: Record<string, Record<string, string>>): void;
  createPdf(docDefinition: Record<string, unknown>): {
    getBuffer(): Promise<Buffer>;
  };
};

import type {
  InferTypeOf,
  OrderDTO,
  OrderLineItemDTO,
} from "@medusajs/framework/types";
import axios from "axios";

import { Invoice } from "./models/invoice";
import { InvoiceConfig } from "./models/invoice-config";

const fonts = {
  Helvetica: {
    bold: "Helvetica-Bold",
    bolditalics: "Helvetica-BoldOblique",
    italics: "Helvetica-Oblique",
    normal: "Helvetica",
  },
};

pdfmake.addFonts(fonts);

// ---------------------------------------------------------------------------

interface GeneratePdfParams {
  order: OrderDTO;
  items: OrderLineItemDTO[];
}

class InvoiceGeneratorService extends MedusaService({
  Invoice,
  InvoiceConfig,
}) {
  async generatePdf(
    params: GeneratePdfParams & {
      invoice_id: string;
    }
  ): Promise<Buffer> {
    const invoice = await this.retrieveInvoice(params.invoice_id);

    // Generate new content
    const pdfContent = Object.keys(invoice.pdfContent).length
      ? invoice.pdfContent
      : await this.createInvoiceContent(params, invoice);

    await this.updateInvoices({
      id: invoice.id,
      pdfContent,
    });

    return pdfmake.createPdf(pdfContent as any).getBuffer();
  }

  private async createInvoiceContent(
    params: GeneratePdfParams,
    invoice: InferTypeOf<typeof Invoice>
  ): Promise<Record<string, any>> {
    // Get invoice configuration
    const invoiceConfigs = await this.listInvoiceConfigs();
    const config = invoiceConfigs[0] || {};

    // Create table for order items
    const itemsTable = [
      [
        { style: "tableHeader", text: "Item" },
        { style: "tableHeader", text: "Quantity" },
        { style: "tableHeader", text: "Unit Price" },
        { style: "tableHeader", text: "Total" },
      ],
      ...(await Promise.all(
        params.items.map(async (item) => [
          { style: "tableRow", text: item.title || "Unknown Item" },
          { style: "tableRow", text: item.quantity.toString() },
          {
            style: "tableRow",
            text: await this.formatAmount(
              item.unit_price,
              params.order.currency_code
            ),
          },
          {
            style: "tableRow",
            text: await this.formatAmount(
              Number(item.total),
              params.order.currency_code
            ),
          },
        ])
      )),
    ];

    const invoiceId = `INV-${invoice.display_id.toString().padStart(6, "0")}`;
    const invoiceDate = new Date(invoice.created_at).toLocaleDateString();

    // return the PDF content structure
    return {
      content: [
        {
          columns: [
            /** Company Details */
            {
              stack: [
                {
                  margin: [0, 0, 0, 8],
                  style: "sectionHeader",
                  text: "COMPANY DETAILS",
                },
                config.company_address && {
                  margin: [0, 0, 0, 4],
                  style: "companyAddress",
                  text: config.company_address,
                },
                config.company_phone && {
                  margin: [0, 0, 0, 4],
                  style: "companyContact",
                  text: config.company_phone,
                },
                config.company_email && {
                  margin: [0, 0, 0, 0],
                  style: "companyContact",
                  text: config.company_email,
                },
              ],
              width: "*",
            },
            /** Invoice Details */
            {
              layout: "noBorders",
              margin: [0, 0, 0, 20],
              table: {
                body: [
                  [
                    { style: "label", text: "Invoice ID:" },
                    { style: "value", text: invoiceId },
                  ],
                  [
                    { style: "label", text: "Invoice Date:" },
                    { style: "value", text: invoiceDate },
                  ],
                  [
                    { style: "label", text: "Order ID:" },
                    {
                      style: "value",
                      text: params.order.display_id.toString().padStart(6, "0"),
                    },
                  ],
                  [
                    { style: "label", text: "Order Date:" },
                    {
                      style: "value",
                      text: new Date(
                        params.order.created_at
                      ).toLocaleDateString(),
                    },
                  ],
                ],
                widths: [80, 120],
              },
              width: "auto",
            },
          ],
          margin: [0, 20, 0, 0],
        },
        {
          text: "\n",
        },
        /** Billing and Shipping Addresses */
        {
          columns: [
            {
              stack: [
                {
                  margin: [0, 0, 0, 8],
                  style: "sectionHeader",
                  text: "BILL TO",
                },
                {
                  style: "addressText",
                  text: params.order.billing_address
                    ? `${params.order.billing_address.first_name || ""} ${params.order.billing_address.last_name || ""}
                    ${params.order.billing_address.address_1 || ""}${params.order.billing_address.address_2 ? `\n${params.order.billing_address.address_2}` : ""}
                    ${params.order.billing_address.city || ""}, ${params.order.billing_address.province || ""} ${params.order.billing_address.postal_code || ""}
                    ${params.order.billing_address.country_code || ""}${params.order.billing_address.phone ? `\n${params.order.billing_address.phone}` : ""}`
                    : "No billing address provided",
                },
              ],
              width: "*",
            },
            {
              stack: [
                {
                  margin: [0, 0, 0, 8],
                  style: "sectionHeader",
                  text: "SHIP TO",
                },
                {
                  style: "addressText",
                  text: params.order.shipping_address
                    ? `${params.order.shipping_address.first_name || ""} ${params.order.shipping_address.last_name || ""}
                    ${params.order.shipping_address.address_1 || ""} ${params.order.shipping_address.address_2 ? `\n${params.order.shipping_address.address_2}` : ""}
                    ${params.order.shipping_address.city || ""}, ${params.order.shipping_address.province || ""} ${params.order.shipping_address.postal_code || ""}
                    ${params.order.shipping_address.country_code || ""}${params.order.shipping_address.phone ? `\n${params.order.shipping_address.phone}` : ""}`
                    : "No shipping address provided",
                },
              ],
              width: "*",
            },
          ],
        },
        {
          text: "\n\n",
        },
        /** Items Table */
        {
          layout: {
            fillColor(rowIndex: number) {
              return rowIndex === 0 ? "#f8f9fa" : null;
            },
            hLineColor(i: number, node: any) {
              return i === 0 || i === node.table.body.length
                ? "#cbd5e0"
                : "#e2e8f0";
            },
            hLineWidth(i: number, node: any) {
              return i === 0 || i === node.table.body.length ? 0.8 : 0.3;
            },
            paddingBottom() {
              return 6;
            },
            paddingLeft() {
              return 8;
            },
            paddingRight() {
              return 8;
            },
            paddingTop() {
              return 6;
            },
            vLineColor() {
              return "#e2e8f0";
            },
            vLineWidth(_i: number, _node: any) {
              return 0.3;
            },
          },
          table: {
            body: itemsTable,
            headerRows: 1,
            widths: ["*", "auto", "auto", "auto"],
          },
        },
        {
          text: "\n",
        },
        /** Totals Section */
        {
          columns: [
            { text: "", width: "*" },
            {
              layout: {
                fillColor(rowIndex: number) {
                  return rowIndex === 3 ? "#f8f9fa" : null;
                },
                hLineColor(i: number, node: any) {
                  return i === 0 || i === node.table.body.length
                    ? "#cbd5e0"
                    : "#e2e8f0";
                },
                hLineWidth(i: number, node: any) {
                  return i === 0 || i === node.table.body.length ? 0.8 : 0.3;
                },
                paddingBottom() {
                  return 6;
                },
                paddingLeft() {
                  return 8;
                },
                paddingRight() {
                  return 8;
                },
                paddingTop() {
                  return 6;
                },
                vLineColor() {
                  return "#e2e8f0";
                },
                vLineWidth() {
                  return 0.3;
                },
              },
              table: {
                body: [
                  [
                    { style: "totalLabel", text: "Subtotal:" },
                    {
                      style: "totalValue",
                      text: await this.formatAmount(
                        Number(params.order.subtotal),
                        params.order.currency_code
                      ),
                    },
                  ],
                  [
                    { style: "totalLabel", text: "Tax:" },
                    {
                      style: "totalValue",
                      text: await this.formatAmount(
                        Number(params.order.tax_total),
                        params.order.currency_code
                      ),
                    },
                  ],
                  [
                    { style: "totalLabel", text: "Shipping:" },
                    {
                      style: "totalValue",
                      text: await this.formatAmount(
                        Number(params.order.shipping_methods?.[0]?.total || 0),
                        params.order.currency_code
                      ),
                    },
                  ],
                  [
                    { style: "totalLabel", text: "Discount:" },
                    {
                      style: "totalValue",
                      text: await this.formatAmount(
                        Number(params.order.discount_total),
                        params.order.currency_code
                      ),
                    },
                  ],
                  [
                    { style: "totalLabel", text: "Total:" },
                    {
                      style: "totalValue",
                      text: await this.formatAmount(
                        Number(params.order.total),
                        params.order.currency_code
                      ),
                    },
                  ],
                ],
                widths: ["auto", "auto"],
              },
              width: "auto",
            },
          ],
        },
        {
          text: "\n\n",
        },
        /** Notes Section */
        ...(config.notes
          ? [
              {
                margin: [0, 20, 0, 10],
                style: "sectionHeader",
                text: "Notes",
              },
              {
                margin: [0, 0, 0, 20],
                style: "notesText",
                text: config.notes,
              },
            ]
          : []),
        {
          alignment: "center",
          margin: [0, 30, 0, 0],
          style: "thankYouText",
          text: "Thank you for your business!",
        },
      ],
      defaultStyle: {
        font: "Helvetica",
      },
      header: {
        columns: [
          /** Company Logo */
          {
            stack: [
              ...(config.company_logo
                ? [
                    {
                      fit: [80, 40],
                      height: 40,
                      image: await this.imageUrlToBase64(config.company_logo),
                      margin: [0, 0, 0, 10],
                      width: 80,
                    },
                  ]
                : []),
              {
                margin: [0, 0, 0, 0],
                style: "companyName",
                text: config.company_name || "Your Company Name",
              },
            ],
            width: "*",
          },
          /** Invoice Title */
          {
            stack: [
              {
                alignment: "right",
                margin: [0, 0, 0, 0],
                style: "invoiceTitle",
                text: "INVOICE",
              },
            ],
            width: "auto",
          },
        ],
        margin: [40, 20, 40, 0],
      },
      pageMargins: [40, 60, 40, 60],
      pageSize: "A4",
      styles: {
        addressText: {
          color: "#495057",
          fontSize: 10,
          lineHeight: 1.3,
        },
        companyAddress: {
          color: "#4a5568",
          fontSize: 11,
          lineHeight: 1.3,
        },
        companyContact: {
          color: "#4a5568",
          fontSize: 10,
        },
        companyName: {
          bold: true,
          color: "#1a365d",
          fontSize: 22,
          margin: [0, 0, 0, 5],
        },
        invoiceTitle: {
          bold: true,
          color: "#2c3e50",
          fontSize: 24,
        },
        label: {
          color: "#6c757d",
          fontSize: 10,
          margin: [0, 0, 8, 0],
        },
        notesText: {
          color: "#6c757d",
          fontSize: 10,
          italics: true,
          lineHeight: 1.4,
        },
        sectionHeader: {
          backgroundColor: "#f8f9fa",
          bold: true,
          color: "#2c3e50",
          fontSize: 12,
          padding: [8, 12],
        },
        tableHeader: {
          bold: true,
          color: "#ffffff",
          fillColor: "#495057",
          fontSize: 10,
        },
        tableRow: {
          color: "#495057",
          fontSize: 9,
        },
        thankYouText: {
          color: "#28a745",
          fontSize: 12,
          italics: true,
        },
        totalLabel: {
          bold: true,
          color: "#495057",
          fontSize: 10,
        },
        totalValue: {
          bold: true,
          color: "#2c3e50",
          fontSize: 10,
        },
        value: {
          bold: true,
          color: "#2c3e50",
          fontSize: 10,
        },
      },
    };
  }

  private async formatAmount(
    amount: number,
    currency: string
  ): Promise<string> {
    return new Intl.NumberFormat("en-US", {
      currency,
      style: "currency",
    }).format(amount);
  }

  private async imageUrlToBase64(url: string): Promise<string> {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const base64 = Buffer.from(response.data).toString("base64");
    const mimeType = response.headers["content-type"] || "image/png";
    return `data:${mimeType};base64,${base64}`;
  }
}

export default InvoiceGeneratorService;
