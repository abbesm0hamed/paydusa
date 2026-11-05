import { Dialog, Transition } from "@headlessui/react";
import useToggleState from "@lib/hooks/use-toggle-state";
import { getProductPrice } from "@lib/util/get-product-price";
import { isSimpleProduct } from "@lib/util/product";
import type { HttpTypes } from "@medusajs/types";
import { Button, clx } from "@medusajs/ui";
import ChevronDown from "@modules/common/icons/chevron-down";
import X from "@modules/common/icons/x";
import React, { Fragment, useMemo } from "react";

import OptionSelect from "./option-select";

interface MobileActionsProps {
  product: HttpTypes.StoreProduct;
  variant?: HttpTypes.StoreProductVariant;
  options: Record<string, string | undefined>;
  updateOptions: (title: string, value: string) => void;
  inStock?: boolean;
  handleAddToCart: () => void;
  isAdding?: boolean;
  show: boolean;
  optionsDisabled: boolean;
}

const MobileActions: React.FC<MobileActionsProps> = ({
  product,
  variant,
  options,
  updateOptions,
  inStock,
  handleAddToCart,
  isAdding,
  show,
  optionsDisabled,
}) => {
  const { state, open, close } = useToggleState();

  const price = getProductPrice({
    product,
    variantId: variant?.id,
  });

  const selectedPrice = useMemo(() => {
    if (!price) {
      return null;
    }
    const { variantPrice, cheapestPrice } = price;

    return variantPrice || cheapestPrice || null;
  }, [price]);

  const isSimple = isSimpleProduct(product);

  return (
    <>
      <div
        className={clx("lg:hidden inset-x-0 bottom-0 fixed", {
          "pointer-events-none": !show,
        })}
      >
        <Transition
          as={Fragment}
          show={show}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="text-large-regular flex h-full w-full flex-col items-center justify-center gap-y-3 border-t border-gray-200 bg-white p-4"
            data-testid="mobile-actions"
          >
            <div className="flex items-center gap-x-2">
              <span data-testid="mobile-title">{product.title}</span>
              <span>—</span>
              {selectedPrice ? (
                <div className="text-ui-fg-base flex items-end gap-x-2">
                  {selectedPrice.price_type === "sale" && (
                    <p>
                      <span className="text-small-regular line-through">
                        {selectedPrice.original_price}
                      </span>
                    </p>
                  )}
                  <span
                    className={clx({
                      "text-ui-fg-interactive":
                        selectedPrice.price_type === "sale",
                    })}
                  >
                    {selectedPrice.calculated_price}
                  </span>
                </div>
              ) : (
                <div></div>
              )}
            </div>
            <div
              className={clx("grid grid-cols-2 w-full gap-x-4", {
                "!grid-cols-1": isSimple,
              })}
            >
              {!isSimple && (
                <Button
                  onClick={open}
                  variant="secondary"
                  className="w-full"
                  data-testid="mobile-actions-button"
                >
                  <div className="flex w-full items-center justify-between">
                    <span>
                      {variant
                        ? Object.values(options).join(" / ")
                        : "Select Options"}
                    </span>
                    <ChevronDown />
                  </div>
                </Button>
              )}
              <Button
                onClick={handleAddToCart}
                disabled={!inStock || !variant}
                className="w-full"
                isLoading={isAdding}
                data-testid="mobile-cart-button"
              >
                {variant
                  ? inStock
                    ? "Add to cart"
                    : "Out of stock"
                  : "Select variant"}
              </Button>
            </div>
          </div>
        </Transition>
      </div>
      <Transition appear show={state} as={Fragment}>
        <Dialog as="div" className="relative z-[75]" onClose={close}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="bg-opacity-75 fixed inset-0 bg-gray-700 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-x-0 bottom-0">
            <div className="flex h-full min-h-full items-center justify-center text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Panel
                  className="flex h-full w-full transform flex-col gap-y-3 overflow-hidden text-left"
                  data-testid="mobile-actions-modal"
                >
                  <div className="flex w-full justify-end pr-6">
                    <button
                      onClick={close}
                      className="text-ui-fg-base flex h-12 w-12 items-center justify-center rounded-full bg-white"
                      data-testid="close-modal-button"
                    >
                      <X />
                    </button>
                  </div>
                  <div className="bg-white px-6 py-12">
                    {(product.variants?.length ?? 0) > 1 && (
                      <div className="flex flex-col gap-y-6">
                        {(product.options || []).map((option) => (
                          <div key={option.id}>
                            <OptionSelect
                              option={option}
                              current={options[option.id]}
                              updateOption={updateOptions}
                              title={option.title ?? ""}
                              disabled={optionsDisabled}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default MobileActions;
