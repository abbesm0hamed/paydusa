export const isObject = (input: unknown): input is object =>
  input instanceof Object;
export const isArray = (input: unknown): input is unknown[] =>
  Array.isArray(input);
export const isEmpty = (input: unknown) =>
  input === null ||
  input === undefined ||
  (isObject(input) && Object.keys(input).length === 0) ||
  (isArray(input) && input.length === 0) ||
  (typeof input === "string" && input.trim().length === 0);
