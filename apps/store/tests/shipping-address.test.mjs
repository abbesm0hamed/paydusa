import assert from "node:assert/strict";
import { test } from "node:test";

import { getShippingAddressFormData } from "../src/modules/checkout/lib/shipping-address.ts";

test("initializes every shipping field when the cart has no address", () => {
  const fields = getShippingAddressFormData();

  assert.equal(Object.keys(fields).length, 9);
  assert.equal(
    Object.values(fields).every((value) => value === ""),
    true
  );
  assert.deepEqual(getShippingAddressFormData(null), fields);
});

test("maps address fields to the existing checkout form names", () => {
  const address = {
    address_1: "10 Example Street",
    city: "Tunis",
    company: "Example",
    country_code: "tn",
    first_name: "First",
    last_name: "Last",
    phone: "12345678",
    postal_code: "1000",
    province: "Tunis",
  };
  const fields = getShippingAddressFormData(address);

  for (const [field, value] of Object.entries(address)) {
    assert.equal(fields[`shipping_address.${field}`], value);
  }
  assert.equal("email" in fields, false);
});

test("retains empty-string fallbacks for missing and null fields", () => {
  assert.deepEqual(
    getShippingAddressFormData({ first_name: null, last_name: "" }),
    getShippingAddressFormData()
  );
});
