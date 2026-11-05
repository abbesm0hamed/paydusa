"use client";

import { updateLineItem } from "@lib/data/cart";
import type { HttpTypes } from "@medusajs/types";
import { Table, Text, clx } from "@medusajs/ui";
import CartItemSelect from "@modules/cart/components/cart-item-select";
import ErrorMessage from "@modules/checkout/components/error-message";
import DeleteButton from "@modules/common/components/delete-button";
import LineItemOptions from "@modules/common/components/line-item-options";
import LineItemPrice from "@modules/common/components/line-item-price";
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import Spinner from "@modules/common/icons/spinner";
import Thumbnail from "@modules/products/components/thumbnail";
import { useState } from "react";

interface ItemProps {
  item: HttpTypes.StoreCartLineItem;
  type?: "full" | "preview";
  currencyCode: string;
}

const Item = ({ item, type = "full", currencyCode }: ItemProps) => {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changeQuantity = async (quantity: number) => {
    setError(null);
    setUpdating(true);

    await updateLineItem({
      lineId: item.id,
      quantity,
    })
      .catch((error_) => {
        setError(error_.message);
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  // TODO: Update this to grab the actual max inventory
  const maxQtyFromInventory = 10;
  const maxQuantity = item.variant?.manage_inventory ? 10 : maxQtyFromInventory;

  return (
    <Table.Row className="w-full" data-testid="product-row">
      <Table.Cell className="w-24 p-4 !pl-0">
        <LocalizedClientLink
          href={`/products/${item.product_handle}`}
          className={clx("flex", {
            "small:w-24 w-12": type === "full",
            "w-16": type === "preview",
          })}
        >
          <Thumbnail
            thumbnail={item.thumbnail}
            images={item.variant?.product?.images}
            size="square"
          />
        </LocalizedClientLink>
      </Table.Cell>

      <Table.Cell className="text-left">
        <Text
          className="txt-medium-plus text-ui-fg-base"
          data-testid="product-title"
        >
          {item.product_title}
        </Text>
        <LineItemOptions variant={item.variant} data-testid="product-variant" />
      </Table.Cell>

      {type === "full" && (
        <Table.Cell>
          <div className="flex w-28 items-center gap-2">
            <DeleteButton id={item.id} data-testid="product-delete-button" />
            <CartItemSelect
              value={item.quantity}
              onChange={(value) =>
                changeQuantity(Number.parseInt(value.target.value))
              }
              className="h-10 w-14 p-4"
              data-testid="product-select-button"
            >
              {/* TODO: Update this with the v2 way of managing inventory */}
              {Array.from(
                {
                  length: Math.min(maxQuantity, 10),
                },
                (_, i) => (
                  <option value={i + 1} key={i}>
                    {i + 1}
                  </option>
                )
              )}

              <option value={1} key={1}>
                1
              </option>
            </CartItemSelect>
            {updating && <Spinner />}
          </div>
          <ErrorMessage error={error} data-testid="product-error-message" />
        </Table.Cell>
      )}

      {type === "full" && (
        <Table.Cell className="small:table-cell hidden">
          <LineItemUnitPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
        </Table.Cell>
      )}

      <Table.Cell className="!pr-0">
        <span
          className={clx("!pr-0", {
            "flex flex-col items-end h-full justify-center": type === "preview",
          })}
        >
          {type === "preview" && (
            <span className="flex gap-x-1">
              <Text className="text-ui-fg-muted">{item.quantity}x </Text>
              <LineItemUnitPrice
                item={item}
                style="tight"
                currencyCode={currencyCode}
              />
            </span>
          )}
          <LineItemPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
        </span>
      </Table.Cell>
    </Table.Row>
  );
};

export default Item;
