export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface ProductFilterParams {
  type_id?: string[];
  tag_id?: string[];
  collection_id?: string[];
  category_id?: string[];
  option_value_id?: string[];
  price_from?: string;
  price_to?: string;
}
