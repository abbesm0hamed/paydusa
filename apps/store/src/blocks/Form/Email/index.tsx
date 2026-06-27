import { Input } from "@ecommerce/ui/components/input";
import { Label } from "@ecommerce/ui/components/label";
import type { EmailField } from "@payloadcms/plugin-form-builder/types";
import type React from "react";
import type {
  FieldErrorsImpl,
  FieldValues,
  UseFormRegister,
} from "react-hook-form";

import { Error } from "../Error";
import { Width } from "../Width";

export const Email: React.FC<
  EmailField & {
    errors: Partial<FieldErrorsImpl>;
    register: UseFormRegister<FieldValues>;
  }
> = ({ name, defaultValue, errors, label, register, required, width }) => {
  return (
    <Width width={width}>
      <Label htmlFor={name} className="mb-2">
        {label}

        {required && (
          <span className="required">
            * <span className="sr-only">(required)</span>
          </span>
        )}
      </Label>
      <Input
        defaultValue={defaultValue}
        id={name}
        type="text"
        {...register(name, { pattern: /^\S[^\s@]*@\S+$/, required })}
      />

      {errors[name] && <Error name={name} />}
    </Width>
  );
};
