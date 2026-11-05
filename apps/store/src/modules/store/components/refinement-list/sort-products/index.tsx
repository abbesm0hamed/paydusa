"use client";

import FilterRadioGroup from "@modules/common/components/filter-radio-group";

export type SortOptions = "price_asc" | "price_desc" | "created_at";

interface SortProductsProps {
  sortBy: SortOptions;
  setQueryParams: (name: string, value: SortOptions) => void;
  "data-testid"?: string;
}

const sortOptions = [
  {
    label: "Latest Arrivals",
    value: "created_at",
  },
  {
    label: "Price: Low -> High",
    value: "price_asc",
  },
  {
    label: "Price: High -> Low",
    value: "price_desc",
  },
];

const SortProducts = ({
  "data-testid": dataTestId,
  sortBy,
  setQueryParams,
}: SortProductsProps) => {
  const handleChange = (value: SortOptions) => {
    setQueryParams("sortBy", value);
  };

  return (
    <FilterRadioGroup
      title="Sort by"
      items={sortOptions}
      value={sortBy}
      handleChange={handleChange}
      data-testid={dataTestId}
    />
  );
};

export default SortProducts;
