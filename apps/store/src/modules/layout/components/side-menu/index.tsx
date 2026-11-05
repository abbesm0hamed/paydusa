"use client";

import { Popover, PopoverPanel, Transition } from "@headlessui/react";
import { ArrowRightMini, XMark } from "@medusajs/icons";
import type { HttpTypes } from "@medusajs/types";
import { Text, clx, useToggleState } from "@medusajs/ui";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import { Fragment, useEffect, useState } from "react";

import CountrySelect from "../country-select";

const SideMenuItems = {
  Account: "/account",
  Cart: "/cart",
  Home: "/",
  Store: "/store",
};

const SideMenu = ({ regions }: { regions: HttpTypes.StoreRegion[] | null }) => {
  const toggleState = useToggleState();
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <div className="h-full">
      <div className="flex h-full items-center">
        <Popover className="flex h-full">
          {({ open, close }) => (
            <>
              <div className="relative flex h-full">
                <Popover.Button
                  data-testid="nav-menu-button"
                  className="hover:text-ui-fg-base relative flex h-full items-center transition-all duration-200 ease-out focus:outline-none"
                >
                  Menu
                </Popover.Button>
              </div>

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-150"
                enterFrom="opacity-0"
                enterTo="opacity-100 backdrop-blur-2xl"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 backdrop-blur-2xl"
                leaveTo="opacity-0"
              >
                <PopoverPanel className="text-ui-fg-on-color fixed inset-0 z-50 m-2 flex h-[calc(100vh-1rem)] w-full flex-col pr-4 text-sm backdrop-blur-md sm:w-1/3 sm:min-w-min sm:pr-0 2xl:w-1/4">
                  <div
                    data-testid="nav-menu-popup"
                    className="rounded-rounded flex h-full flex-col justify-between bg-[rgba(3,7,18,0.5)] p-6"
                  >
                    <div className="flex justify-end" id="xmark">
                      <button data-testid="close-menu-button" onClick={close}>
                        <XMark />
                      </button>
                    </div>
                    <ul className="flex flex-col items-start justify-start gap-6">
                      {Object.entries(SideMenuItems).map(([name, href]) => (
                        <li key={name}>
                          <LocalizedClientLink
                            href={href}
                            className="hover:text-ui-fg-disabled text-xl leading-8 sm:text-3xl sm:leading-10"
                            onClick={close}
                            data-testid={`${name.toLowerCase()}-link`}
                          >
                            {name}
                          </LocalizedClientLink>
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-col gap-y-6">
                      <div
                        className="flex justify-between"
                        onMouseEnter={toggleState.open}
                        onMouseLeave={toggleState.close}
                      >
                        {regions && (
                          <CountrySelect
                            toggleState={toggleState}
                            regions={regions}
                          />
                        )}
                        <ArrowRightMini
                          className={clx(
                            "transition-transform duration-150",
                            toggleState.state ? "-rotate-90" : ""
                          )}
                        />
                      </div>
                      <Text className="txt-compact-small flex justify-between">
                        © {year} Medusa Store. All rights reserved.
                      </Text>
                    </div>
                  </div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  );
};

export default SideMenu;
