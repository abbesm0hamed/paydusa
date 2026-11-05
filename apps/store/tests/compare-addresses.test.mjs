import assert from "node:assert/strict";
import { test } from "node:test";

import compareAddresses from "../src/lib/util/compare-addresses.ts";

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

test("matches saved and draft addresses regardless of unrelated fields", () => {
  assert.equal(
    compareAddresses({ ...address, id: "saved-address" }, address),
    true
  );
});

test("detects differences in each field used for address selection", () => {
  for (const field of Object.keys(address)) {
    assert.equal(
      compareAddresses(address, { ...address, [field]: "different" }),
      false,
      field
    );
  }
});

test("preserves comparison behavior for missing addresses", () => {
  assert.equal(compareAddresses(null, undefined), true);
  assert.equal(compareAddresses({}, {}), true);
  assert.equal(compareAddresses(address, null), false);
});
