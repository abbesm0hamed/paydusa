import {
  BigNumberValue,
  CustomerDTO,
  OrderDTO,
} from "@medusajs/framework/types";
import type { ReactElement } from "react";
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
  pixelBasedPreset,
} from "react-email";

const emailTheme = {
  presets: [pixelBasedPreset],
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        border: "#e5e7eb",
        foreground: "#1a1a1a",
        muted: { DEFAULT: "#f7f7f7", foreground: "#737373" },
        primary: { DEFAULT: "#27272a", foreground: "#fbfbfb" },
      },
      fontFamily: {
        sans: ["Inter", "Helvetica", "Arial", "sans-serif"],
      },
    },
  },
} as const;

type OrderPlacedEmailProps = {
  order: OrderDTO & {
    customer: CustomerDTO;
  };
  email_banner?: {
    body: string;
    title: string;
    url: string;
  };
};

function OrderPlacedEmailComponent({
  order,
  email_banner,
}: OrderPlacedEmailProps): ReactElement {
  const shouldDisplayBanner = email_banner && "title" in email_banner;

  const formatter = new Intl.NumberFormat([], {
    style: "currency",
    currencyDisplay: "narrowSymbol",
    currency: order.currency_code,
  });

  const formatPrice = (price: BigNumberValue) => {
    if (typeof price === "number") {
      return formatter.format(price);
    }

    if (typeof price === "string") {
      return formatter.format(parseFloat(price));
    }

    return price?.toString() || "";
  };

  return (
    <Tailwind config={emailTheme}>
      <Html lang="en">
        <Head />
        <Preview>Thank you for your order from Medusa</Preview>
        <Body className="bg-muted font-sans py-10">
          <Container className="bg-background border border-border rounded-[19px] mx-auto max-w-[520px] overflow-hidden">
            {/* Header */}
            <Section className="bg-primary px-10 py-6">
              <Text className="text-primary-foreground text-base font-bold tracking-tight m-0">
                Medusa Store
              </Text>
            </Section>

            {/* Thank You Message */}
            <Section className="px-10 pt-10 pb-8">
              <Text className="inline-block bg-muted border border-border rounded-full text-muted-foreground text-[11px] font-semibold uppercase tracking-widest px-3 py-1 m-0 mb-6">
                Order Confirmed
              </Text>

              <Heading
                as="h1"
                className="text-foreground text-2xl font-bold tracking-tight leading-snug m-0 mb-3"
              >
                Thank you for your order,{" "}
                {order.customer?.first_name ||
                  order.shipping_address?.first_name}
              </Heading>

              <Text className="text-muted-foreground text-sm leading-6 m-0 mb-6">
                We're processing your order and will notify you when it ships.
              </Text>
            </Section>

            {/* Promotional Banner */}
            {shouldDisplayBanner && (
              <Section className="mx-10 mb-8">
                <Section
                  className="rounded-xl p-7"
                  style={{
                    background: "linear-gradient(to right, #3b82f6, #4f46e5)",
                  }}
                >
                  <Row>
                    <Column align="left">
                      <Heading className="text-white text-xl font-semibold m-0">
                        {email_banner.title}
                      </Heading>
                      <Text className="text-white mt-2 m-0">
                        {email_banner.body}
                      </Text>
                    </Column>
                    <Column align="right">
                      <Link
                        href={email_banner.url}
                        className="font-semibold px-2 text-white underline"
                      >
                        Shop Now
                      </Link>
                    </Column>
                  </Row>
                </Section>
              </Section>
            )}

            {/* Order Items */}
            <Section className="px-10">
              <Heading className="text-foreground text-lg font-semibold m-0 mb-4">
                Your Items
              </Heading>
              <Text className="text-muted-foreground text-sm m-0 mb-4">
                Order ID: #{order.display_id}
              </Text>
              {order.items?.map((item) => (
                <Section key={item.id} className="border-b border-border py-4">
                  <Row>
                    <Column className="w-1/3">
                      <Img
                        src={item.thumbnail ?? ""}
                        alt={item.product_title ?? ""}
                        className="rounded-lg"
                        width="100%"
                      />
                    </Column>
                    <Column className="w-2/3 pl-4">
                      <Text className="text-foreground text-base font-semibold m-0">
                        {item.product_title}
                      </Text>
                      <Text className="text-muted-foreground text-sm m-0">
                        {item.variant_title}
                      </Text>
                      <Text className="text-foreground text-base font-bold mt-2 m-0">
                        {formatPrice(item.total)}
                      </Text>
                    </Column>
                  </Row>
                </Section>
              ))}

              {/* Order Summary */}
              <Section className="mt-8 mb-8">
                <Heading className="text-foreground text-lg font-semibold m-0 mb-4">
                  Order Summary
                </Heading>
                <Row className="text-muted-foreground">
                  <Column className="w-1/2">
                    <Text className="m-0 text-sm">Subtotal</Text>
                  </Column>
                  <Column className="w-1/2 text-right">
                    <Text className="m-0 text-sm">
                      {formatPrice(order.item_total)}
                    </Text>
                  </Column>
                </Row>
                {order.shipping_methods?.map((method) => (
                  <Row className="text-muted-foreground" key={method.id}>
                    <Column className="w-1/2">
                      <Text className="m-0 text-sm">{method.name}</Text>
                    </Column>
                    <Column className="w-1/2 text-right">
                      <Text className="m-0 text-sm">
                        {formatPrice(method.total)}
                      </Text>
                    </Column>
                  </Row>
                ))}
                <Row className="text-muted-foreground">
                  <Column className="w-1/2">
                    <Text className="m-0 text-sm">Tax</Text>
                  </Column>
                  <Column className="w-1/2 text-right">
                    <Text className="m-0 text-sm">
                      {formatPrice(order.tax_total || 0)}
                    </Text>
                  </Column>
                </Row>
                <Row className="border-t border-border mt-4 text-foreground">
                  <Column className="w-1/2">
                    <Text className="text-sm font-bold m-0">Total</Text>
                  </Column>
                  <Column className="w-1/2 text-right">
                    <Text className="text-sm font-bold m-0">
                      {formatPrice(order.total)}
                    </Text>
                  </Column>
                </Row>
              </Section>
            </Section>

            <Section className="border-t border-border mx-10" />

            {/* Footer */}
            <Section className="px-10 py-6">
              <Text className="text-muted-foreground text-xs leading-5 m-0 mb-1">
                If you have any questions, reply to this email or contact our
                support team at support@medusajs.com.
              </Text>
              <Text className="text-muted-foreground text-xs leading-5 m-0">
                Order Token: {order.id}
              </Text>
              <Text className="text-muted-foreground text-xs leading-5 m-0 mt-4">
                © {new Date().getFullYear()} Medusajs, Inc. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
}

export const OrderPlacedEmail = (props: OrderPlacedEmailProps) => (
  <OrderPlacedEmailComponent {...props} />
);
