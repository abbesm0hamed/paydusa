import type { HttpTypes } from "@medusajs/types";
import { Text } from "@medusajs/ui";

interface LineItemOptionsProps {
  variant: HttpTypes.StoreProductVariant | undefined;
  "data-testid"?: string;
  "data-value"?: HttpTypes.StoreProductVariant;
}

const LineItemOptions = ({
  variant,
  "data-testid": dataTestid,
  "data-value": dataValue,
}: LineItemOptionsProps) => (
  <Text
    data-testid={dataTestid}
    data-value={dataValue}
    className="txt-medium text-ui-fg-subtle inline-block w-full overflow-hidden text-ellipsis"
  >
    Variant: {variant?.title}
  </Text>
);

export default LineItemOptions;
