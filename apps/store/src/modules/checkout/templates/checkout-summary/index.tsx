import { Heading } from "@medusajs/ui";
import ItemsPreviewTemplate from "@modules/cart/templates/preview";
import DiscountCode from "@modules/checkout/components/discount-code";
import CartTotals from "@modules/common/components/cart-totals";
import Divider from "@modules/common/components/divider";

const CheckoutSummary = ({ cart }: { cart: any }) => (
  <div className="small:flex-col small:py-0 sticky top-0 flex flex-col-reverse gap-y-8 py-8">
    <div className="flex w-full flex-col bg-white">
      <Divider className="small:hidden my-6" />
      <Heading
        level="h2"
        className="text-3xl-regular flex flex-row items-baseline"
      >
        In your Cart
      </Heading>
      <Divider className="my-6" />
      <CartTotals totals={cart} />
      <ItemsPreviewTemplate cart={cart} />
      <div className="my-6">
        <DiscountCode cart={cart} />
      </div>
    </div>
  </div>
);

export default CheckoutSummary;
