import { retrieveOrder } from "@lib/data/orders";
import OrderCompletedTemplate from "@modules/order/templates/order-completed-template";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}
export const metadata: Metadata = {
  description: "You purchase was successful",
  title: "Order Confirmed",
};

export default async function OrderConfirmedPage(props: Props) {
  const params = await props.params;
  const order = await retrieveOrder(params.id).catch(() => null);

  if (!order) {
    return notFound();
  }

  return <OrderCompletedTemplate order={order} />;
}
