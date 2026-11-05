"use client";

import { transferCart } from "@lib/data/customer";
import { ExclamationCircleSolid } from "@medusajs/icons";
import type { StoreCart, StoreCustomer } from "@medusajs/types";
import { Button } from "@medusajs/ui";
import { useState } from "react";

function CartMismatchBanner(props: {
  customer: StoreCustomer;
  cart: StoreCart;
}) {
  const { customer, cart } = props;
  const [isPending, setIsPending] = useState(false);
  const [actionText, setActionText] = useState("Run transfer again");

  if (!customer || !!cart.customer_id) {
    return;
  }

  const handleSubmit = async () => {
    try {
      setIsPending(true);
      setActionText("Transferring..");

      await transferCart();
    } catch {
      setActionText("Run transfer again");
      setIsPending(false);
    }
  };

  return (
    <div className="small:p-4 small:gap-2 mt-2 flex items-center justify-center gap-1 bg-orange-300 p-2 text-center text-sm text-orange-800">
      <div className="small:flex-row small:gap-2 flex flex-col items-center gap-1">
        <span className="flex items-center gap-1">
          <ExclamationCircleSolid className="inline" />
          Something went wrong when we tried to transfer your cart
        </span>

        <span>·</span>

        <Button
          variant="transparent"
          className="bg-transparent p-0 text-orange-950 hover:bg-transparent focus:bg-transparent active:bg-transparent disabled:text-orange-500"
          size="base"
          disabled={isPending}
          onClick={handleSubmit}
        >
          {actionText}
        </Button>
      </div>
    </div>
  );
}

export default CartMismatchBanner;
