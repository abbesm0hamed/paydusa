import { ArrowUpRightMini } from "@medusajs/icons";
import { Text } from "@medusajs/ui";

import LocalizedClientLink from "../localized-client-link";

interface InteractiveLinkProps {
  href: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

const InteractiveLink = ({
  href,
  children,
  onClick,
  ...props
}: InteractiveLinkProps) => (
  <LocalizedClientLink
    className="group flex items-center gap-x-1"
    href={href}
    onClick={onClick}
    {...props}
  >
    <Text className="text-ui-fg-interactive">{children}</Text>
    <ArrowUpRightMini
      className="duration-150 ease-in-out group-hover:rotate-45"
      color="var(--fg-interactive)"
    />
  </LocalizedClientLink>
);

export default InteractiveLink;
