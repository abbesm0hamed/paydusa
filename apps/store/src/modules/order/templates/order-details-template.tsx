"use client";

import { XMark } from "@medusajs/icons";
import type { HttpTypes } from "@medusajs/types";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import Help from "@modules/order/components/help";
import Items from "@modules/order/components/items";
import OrderDetails from "@modules/order/components/order-details";
import OrderSummary from "@modules/order/components/order-summary";
import ShippingDetails from "@modules/order/components/shipping-details";
import React from "react";

interface OrderDetailsTemplateProps {
  order: HttpTypes.StoreOrder;
}

const OrderDetailsTemplate: React.FC<OrderDetailsTemplateProps> = ({
  order,
}) => (
  <div className="flex flex-col justify-center gap-y-4">
    <div className="flex items-center justify-between gap-2">
      <h1 className="text-2xl-semi">Order details</h1>
      <LocalizedClientLink
        href="/account/orders"
        className="text-ui-fg-subtle hover:text-ui-fg-base flex items-center gap-2"
        data-testid="back-to-overview-button"
      >
        <XMark /> Back to overview
      </LocalizedClientLink>
    </div>
    <div
      className="flex h-full w-full flex-col gap-4 bg-white"
      data-testid="order-details-container"
    >
      <OrderDetails order={order} showStatus />
      <Items order={order} />
      <ShippingDetails order={order} />
      <OrderSummary order={order} />
      <Help />
    </div>
  </div>
);

export default OrderDetailsTemplate;
