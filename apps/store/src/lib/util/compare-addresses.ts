import isEqual from "lodash/isEqual.js";
import pick from "lodash/pick.js";

type ComparableAddress =
  | Partial<{
      address_1: string | null;
      city: string | null;
      company: string | null;
      country_code: string | null;
      first_name: string | null;
      last_name: string | null;
      phone: string | null;
      postal_code: string | null;
      province: string | null;
    }>
  | null
  | undefined;

const compareAddresses = (
  address1: ComparableAddress,
  address2: ComparableAddress
) =>
  isEqual(
    pick(address1, [
      "first_name",
      "last_name",
      "address_1",
      "company",
      "postal_code",
      "city",
      "country_code",
      "province",
      "phone",
    ]),
    pick(address2, [
      "first_name",
      "last_name",
      "address_1",
      "company",
      "postal_code",
      "city",
      "country_code",
      "province",
      "phone",
    ])
  );

export default compareAddresses;
