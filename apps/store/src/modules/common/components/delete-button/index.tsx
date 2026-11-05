import { deleteLineItem } from "@lib/data/cart";
import { Spinner, Trash } from "@medusajs/icons";
import { clx } from "@medusajs/ui";
import { useState } from "react";

const DeleteButton = ({
  id,
  children,
  className,
}: {
  id: string;
  children?: React.ReactNode;
  className?: string;
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    await deleteLineItem(id).catch((error) => {
      setIsDeleting(false);
    });
  };

  return (
    <div
      className={clx(
        "flex items-center justify-between text-small-regular",
        className
      )}
    >
      <button
        className="text-ui-fg-subtle hover:text-ui-fg-base flex cursor-pointer gap-x-1"
        onClick={() => handleDelete(id)}
      >
        {isDeleting ? <Spinner className="animate-spin" /> : <Trash />}
        <span>{children}</span>
      </button>
    </div>
  );
};

export default DeleteButton;
