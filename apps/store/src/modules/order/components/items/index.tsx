import repeat from "@lib/util/repeat";
import type { HttpTypes } from "@medusajs/types";
import { Table } from "@medusajs/ui";
import Divider from "@modules/common/components/divider";
import Item from "@modules/order/components/item";
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item";

interface ItemsProps {
  order: HttpTypes.StoreOrder;
}

const Items = ({ order }: ItemsProps) => {
  const { items } = order;

  return (
    <div className="flex flex-col">
      <Divider className="!mb-0" />
      <Table>
        <Table.Body data-testid="products-table">
          {items?.length
            ? items
                .sort((a, b) =>
                  (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                )
                .map((item) => (
                  <Item
                    key={item.id}
                    item={item}
                    currencyCode={order.currency_code}
                  />
                ))
            : repeat(5).map((i) => <SkeletonLineItem key={i} />)}
        </Table.Body>
      </Table>
    </div>
  );
};

export default Items;
