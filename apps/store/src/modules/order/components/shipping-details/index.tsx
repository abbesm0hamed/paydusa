import { convertToLocale } from "@lib/util/money";
import type { HttpTypes } from "@medusajs/types";
import { Heading, Text } from "@medusajs/ui";
import Divider from "@modules/common/components/divider";

interface ShippingDetailsProps {
  order: HttpTypes.StoreOrder;
}

const ShippingDetails = ({ order }: ShippingDetailsProps) => (
  <div>
    <Heading level="h2" className="text-3xl-regular my-6 flex flex-row">
      Delivery
    </Heading>
    <div className="flex items-start gap-x-8">
      <div
        className="flex w-1/3 flex-col"
        data-testid="shipping-address-summary"
      >
        <Text className="txt-medium-plus text-ui-fg-base mb-1">
          Shipping Address
        </Text>
        <Text className="txt-medium text-ui-fg-subtle">
          {order.shipping_address?.first_name}{" "}
          {order.shipping_address?.last_name}
        </Text>
        <Text className="txt-medium text-ui-fg-subtle">
          {order.shipping_address?.address_1}{" "}
          {order.shipping_address?.address_2}
        </Text>
        <Text className="txt-medium text-ui-fg-subtle">
          {order.shipping_address?.postal_code}, {order.shipping_address?.city}
        </Text>
        <Text className="txt-medium text-ui-fg-subtle">
          {order.shipping_address?.country_code?.toUpperCase()}
        </Text>
      </div>

      <div
        className="flex w-1/3 flex-col"
        data-testid="shipping-contact-summary"
      >
        <Text className="txt-medium-plus text-ui-fg-base mb-1">Contact</Text>
        <Text className="txt-medium text-ui-fg-subtle">
          {order.shipping_address?.phone}
        </Text>
        <Text className="txt-medium text-ui-fg-subtle">{order.email}</Text>
      </div>

      <div
        className="flex w-1/3 flex-col"
        data-testid="shipping-method-summary"
      >
        <Text className="txt-medium-plus text-ui-fg-base mb-1">Method</Text>
        <Text className="txt-medium text-ui-fg-subtle">
          {(order as any).shipping_methods[0]?.name} (
          {convertToLocale({
            amount: order.shipping_methods?.[0].total ?? 0,
            currency_code: order.currency_code,
          })
            .replaceAll(",", "")
            .replaceAll(".", ",")}
          )
        </Text>
      </div>
    </div>
    <Divider className="mt-8" />
  </div>
);

export default ShippingDetails;
