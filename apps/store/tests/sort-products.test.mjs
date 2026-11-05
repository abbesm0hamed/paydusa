import assert from "node:assert/strict";
import { test } from "node:test";

import {
  filterProductsByPrice,
  sortProducts,
} from "../src/lib/util/sort-products.ts";

const product = (id, amounts, createdAt) => ({
  created_at: createdAt,
  id,
  variants: amounts.map((amount) => ({
    calculated_price: { calculated_amount: amount },
  })),
});

test("sorts by minimum variant price in place and retains cached prices", () => {
  const cheap = product("cheap", [4, 2]);
  const expensive = product("expensive", [20]);
  const noVariants = product("no-variants", []);
  const products = [expensive, noVariants, cheap];

  assert.equal(sortProducts(products, "price_asc"), products);
  assert.deepEqual(
    products.map(({ id }) => id),
    ["cheap", "expensive", "no-variants"]
  );
  assert.equal(cheap._minPrice, 2);
  sortProducts(products, "price_desc");
  assert.deepEqual(
    products.map(({ id }) => id),
    ["no-variants", "expensive", "cheap"]
  );
});

test("price filtering includes bounds and preserves zero-price products", () => {
  const products = [
    product("free", [0]),
    product("within", [5, 8]),
    product("above", [20]),
    product("no-variants", []),
  ];

  assert.equal(filterProductsByPrice(products), products);
  assert.deepEqual(
    filterProductsByPrice(products, 0, 5).map(({ id }) => id),
    ["free", "within"]
  );
  assert.deepEqual(
    filterProductsByPrice(products, 5, 5).map(({ id }) => id),
    ["within"]
  );
});

test("sorts by newest creation date without requiring every date to exist", () => {
  const older = product("older", [], "2025-01-01");
  const newer = product("newer", [], "2026-01-01");
  const products = [older, newer];

  assert.deepEqual(sortProducts(products, "created_at"), [newer, older]);
  const undatedEpoch = product("epoch", [], null);
  assert.deepEqual(sortProducts([undatedEpoch, newer], "created_at"), [
    newer,
    undatedEpoch,
  ]);
  const undated = [product("first", []), product("second", [])];
  assert.deepEqual(
    sortProducts(undated, "created_at").map(({ id }) => id),
    ["first", "second"]
  );
});
