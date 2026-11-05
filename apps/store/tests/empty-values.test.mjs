import assert from "node:assert/strict";
import { test } from "node:test";

import { isArray, isEmpty, isObject } from "../src/lib/util/isEmpty.ts";
import repeat from "../src/lib/util/repeat.ts";

test("identifies empty values without treating zero and false as empty", () => {
  for (const value of [null, undefined, {}, [], "", "  "]) {
    assert.equal(isEmpty(value), true);
  }
  for (const value of [0, false, "value", [0], { value: 0 }]) {
    assert.equal(isEmpty(value), false);
  }
});

test("keeps the existing object and array predicates", () => {
  assert.equal(isObject({}), true);
  assert.equal(isObject([]), true);
  assert.equal(isObject(null), false);
  assert.equal(isObject("value"), false);
  assert.equal(isArray([]), true);
  assert.equal(isArray({}), false);
});

test("generates indices and retains range validation", () => {
  assert.deepEqual(repeat(0), []);
  assert.deepEqual(repeat(3), [0, 1, 2]);
  assert.throws(() => repeat(-1), RangeError);
  assert.throws(() => repeat(1.5), RangeError);
  assert.throws(() => repeat(Number.NaN), RangeError);
  assert.throws(() => repeat(Infinity), RangeError);
  assert.throws(() => repeat(2 ** 32), RangeError);
});
