import { Listbox, Transition } from "@headlessui/react";
import compareAddresses from "@lib/util/compare-addresses";
import { ChevronUpDown } from "@medusajs/icons";
import type { HttpTypes } from "@medusajs/types";
import { clx } from "@medusajs/ui";
import Radio from "@modules/common/components/radio";
import { Fragment, useMemo } from "react";

interface AddressSelectProps {
  addresses: HttpTypes.StoreCustomerAddress[];
  addressInput: Partial<HttpTypes.StoreCartAddress> | null;
  onSelect: (
    address: HttpTypes.StoreCartAddress | undefined,
    email?: string
  ) => void;
}

const AddressSelect = ({
  addresses,
  addressInput,
  onSelect,
}: AddressSelectProps) => {
  const handleSelect = (id: string) => {
    const savedAddress = addresses.find((a) => a.id === id);
    if (savedAddress) {
      onSelect(savedAddress as HttpTypes.StoreCartAddress);
    }
  };

  const selectedAddress = useMemo(
    () => addresses.find((a) => compareAddresses(a, addressInput)),
    [addresses, addressInput]
  );

  return (
    <Listbox onChange={handleSelect} value={selectedAddress?.id}>
      <div className="relative">
        <Listbox.Button
          className="rounded-rounded focus-visible:ring-opacity-75 text-base-regular relative flex w-full cursor-default items-center justify-between border bg-white px-4 py-[10px] text-left focus:outline-none focus-visible:border-gray-300 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-300"
          data-testid="shipping-address-select"
        >
          {({ open }) => (
            <>
              <span className="block truncate">
                {selectedAddress
                  ? selectedAddress.address_1
                  : "Choose an address"}
              </span>
              <ChevronUpDown
                className={clx("transition-rotate duration-200", {
                  "transform rotate-180": open,
                })}
              />
            </>
          )}
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options
            className="text-small-regular border-top-0 absolute z-20 max-h-60 w-full overflow-auto border bg-white focus:outline-none sm:text-sm"
            data-testid="shipping-address-options"
          >
            {addresses.map((address) => (
              <Listbox.Option
                key={address.id}
                value={address.id}
                className="relative cursor-default py-4 pr-10 pl-6 select-none hover:bg-gray-50"
                data-testid="shipping-address-option"
              >
                <div className="flex items-start gap-x-4">
                  <Radio
                    checked={selectedAddress?.id === address.id}
                    data-testid="shipping-address-radio"
                  />
                  <div className="flex flex-col">
                    <span className="text-base-semi text-left">
                      {address.first_name} {address.last_name}
                    </span>
                    {address.company && (
                      <span className="text-small-regular text-ui-fg-base">
                        {address.company}
                      </span>
                    )}
                    <div className="text-base-regular mt-2 flex flex-col text-left">
                      <span>
                        {address.address_1}
                        {address.address_2 && (
                          <span>, {address.address_2}</span>
                        )}
                      </span>
                      <span>
                        {address.postal_code}, {address.city}
                      </span>
                      <span>
                        {address.province && `${address.province}, `}
                        {address.country_code?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};

export default AddressSelect;
