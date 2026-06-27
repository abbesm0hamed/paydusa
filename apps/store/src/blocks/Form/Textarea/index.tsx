import { Label } from "@ecommerce/ui/components/label";
import { Textarea as TextAreaComponent } from "@ecommerce/ui/components/textarea";
import type { TextField } from "@payloadcms/plugin-form-builder/types";
import React from "react";
import type {
  FieldErrorsImpl,
  FieldValues,
  UseFormRegister,
} from "react-hook-form";

import { Error } from "../Error";
import { Width } from "../Width";

export const Textarea: React.FC<
  TextField & {
    errors: Partial<FieldErrorsImpl>;
    register: UseFormRegister<FieldValues>;
    rows?: number;
  }
> = ({
  name,
  defaultValue,
  errors,
  label,
  register,
  required,
  rows = 3,
  width,
}) => {
  return (
    <Width width={width}>
      <Label htmlFor={name}>
        {label}

        {required && (
          <span className="required">
            * <span className="sr-only">(required)</span>
          </span>
        )}
      </Label>

      <TextAreaComponent
        defaultValue={defaultValue}
        id={name}
        rows={rows}
        {...register(name, { required: required })}
      />

      {errors[name] && <Error name={name} />}
    </Width>
  );
};
