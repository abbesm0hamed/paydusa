"use client";

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { updateRegion } from "@lib/data/cart";
import type { StateType } from "@lib/hooks/use-toggle-state";
import type { HttpTypes } from "@medusajs/types";
import { useParams, usePathname } from "next/navigation";
import { Fragment, useEffect, useMemo, useState } from "react";
import ReactCountryFlag from "react-country-flag";

interface CountryOption {
  country: string;
  region: string;
  label: string;
}

interface CountrySelectProps {
  toggleState: StateType;
  regions: HttpTypes.StoreRegion[];
}

const CountrySelect = ({ toggleState, regions }: CountrySelectProps) => {
  const [current, setCurrent] = useState<
    | { country: string | undefined; region: string; label: string | undefined }
    | undefined
  >(undefined);

  const { countryCode, locale } = useParams();
  const currentPath = usePathname().split(`/${countryCode}`)[1];

  const { state, close } = toggleState;

  const options = useMemo(
    () =>
      regions
        ?.flatMap((r) =>
          r.countries?.map((c) => ({
            country: c.iso_2,
            label: c.display_name,
            region: r.id,
          }))
        )
        .sort((a, b) => (a?.label ?? "").localeCompare(b?.label ?? "")),
    [regions]
  );

  useEffect(() => {
    if (countryCode) {
      const option = options?.find((o) => o?.country === countryCode);
      setCurrent(option);
    }
  }, [options, countryCode]);

  const handleChange = (option: CountryOption) => {
    updateRegion(option.country, currentPath, locale as string);
    close();
  };

  return (
    <div>
      <Listbox
        as="span"
        onChange={handleChange}
        defaultValue={
          countryCode
            ? options?.find((o) => o?.country === countryCode)
            : undefined
        }
      >
        <ListboxButton className="w-full py-1">
          <div className="txt-compact-small flex items-start gap-x-2">
            <span>Shipping to:</span>
            {current && (
              <span className="txt-compact-small flex items-center gap-x-2">
                {/* @ts-expect-error */}
                <ReactCountryFlag
                  svg
                  style={{
                    height: "16px",
                    width: "16px",
                  }}
                  countryCode={current.country ?? ""}
                />
                {current.label}
              </span>
            )}
          </div>
        </ListboxButton>
        <div className="relative flex w-full min-w-[320px]">
          <Transition
            show={state}
            as={Fragment}
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxOptions
              className="xsmall:left-auto xsmall:right-0 text-small-regular no-scrollbar rounded-rounded absolute -bottom-[calc(100%-36px)] left-0 z-[900] max-h-[442px] w-full overflow-y-scroll bg-white text-black uppercase drop-shadow-md"
              static
            >
              {options?.map((o, index) => (
                <ListboxOption
                  key={index}
                  value={o}
                  className="flex cursor-pointer items-center gap-x-2 px-3 py-2 hover:bg-gray-200"
                >
                  {/* @ts-expect-error */}
                  <ReactCountryFlag
                    svg
                    style={{
                      height: "16px",
                      width: "16px",
                    }}
                    countryCode={o?.country ?? ""}
                  />{" "}
                  {o?.label}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default CountrySelect;
