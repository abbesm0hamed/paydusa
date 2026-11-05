import { Heading } from "@medusajs/ui";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import React from "react";

const Help = () => (
  <div className="mt-6">
    <Heading className="text-base-semi">Need help?</Heading>
    <div className="text-base-regular my-2">
      <ul className="flex flex-col gap-y-2">
        <li>
          <LocalizedClientLink href="/contact">Contact</LocalizedClientLink>
        </li>
        <li>
          <LocalizedClientLink href="/contact">
            Returns & Exchanges
          </LocalizedClientLink>
        </li>
      </ul>
    </div>
  </div>
);

export default Help;
