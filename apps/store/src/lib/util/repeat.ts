const MAX_ARRAY_LENGTH = 2 ** 32 - 1;

const repeat = (times: number) => {
  if (!Number.isInteger(times) || times < 0 || times > MAX_ARRAY_LENGTH) {
    throw new RangeError("Invalid array length");
  }

  return Array.from({ length: times }, (_, index) => index);
};

export default repeat;
