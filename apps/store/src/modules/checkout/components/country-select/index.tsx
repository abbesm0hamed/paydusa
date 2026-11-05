import type { HttpTypes } from "@medusajs/types";
import type { NativeSelectProps } from "@modules/common/components/native-select";
import NativeSelect from "@modules/common/components/native-select";
import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";

const CountrySelect = forwardRef<
  HTMLSelectElement,
  NativeSelectProps & {
    region?: HttpTypes.StoreRegion;
  }
>(({ placeholder = "Country", region, defaultValue, ...props }, ref) => {
  const innerRef = useRef<HTMLSelectElement>(null);

  useImperativeHandle<HTMLSelectElement | null, HTMLSelectElement | null>(
    ref,
    () => innerRef.current
  );

  const countryOptions = useMemo(() => {
    if (!region) {
      return [];
    }

    return region.countries?.map((country) => ({
      label: country.display_name,
      value: country.iso_2,
    }));
  }, [region]);

  return (
    <NativeSelect
      ref={innerRef}
      placeholder={placeholder}
      defaultValue={defaultValue}
      {...props}
    >
      {countryOptions?.map(({ value, label }, index) => (
        <option key={index} value={value}>
          {label}
        </option>
      ))}
    </NativeSelect>
  );
});

CountrySelect.displayName = "CountrySelect";

export default CountrySelect;
