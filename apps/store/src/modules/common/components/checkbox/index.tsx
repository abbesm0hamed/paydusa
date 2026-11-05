import { Checkbox, Label } from "@medusajs/ui";
import React from "react";

interface CheckboxProps {
  checked?: boolean;
  onChange?: () => void;
  label: string;
  name?: string;
  "data-testid"?: string;
}

const CheckboxWithLabel: React.FC<CheckboxProps> = ({
  checked = true,
  onChange,
  label,
  name,
  "data-testid": dataTestId,
}) => (
  <div className="flex items-center space-x-2">
    <Checkbox
      className="text-base-regular flex items-center gap-x-2"
      id="checkbox"
      role="checkbox"
      type="button"
      checked={checked}
      aria-checked={checked}
      onClick={onChange}
      name={name}
      data-testid={dataTestId}
    />
    <Label
      htmlFor="checkbox"
      className="!txt-medium !transform-none"
      size="large"
    >
      {label}
    </Label>
  </div>
);

export default CheckboxWithLabel;
