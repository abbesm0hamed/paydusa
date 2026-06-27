import { listCartOptions, retrieveCart } from "@lib/data/cart";
import { retrieveCustomer } from "@lib/data/customer";
import { getBaseURL } from "@lib/util/env";
import { StoreCartShippingOption } from "@medusajs/types";
import CartMismatchBanner from "@modules/layout/components/cart-mismatch-banner";
import MedusaFooter from "@modules/layout/templates/footer";
import FreeShippingPriceNudge from "@modules/shipping/components/free-shipping-price-nudge";
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
};

export const instant = false;

export default async function PageLayout(props: { children: React.ReactNode }) {
  const customer = await retrieveCustomer();
  const cart = await retrieveCart();
  let shippingOptions: StoreCartShippingOption[] = [];

  if (cart) {
    const { shipping_options } = await listCartOptions();

    shippingOptions = shipping_options;
  }

  return (
    <>
      {customer && cart && (
        <CartMismatchBanner customer={customer} cart={cart} />
      )}

      {cart && (
        <FreeShippingPriceNudge
          variant="popup"
          cart={cart}
          shippingOptions={shippingOptions}
        />
      )}
      {props.children}
      <MedusaFooter />
    </>
  );
}
