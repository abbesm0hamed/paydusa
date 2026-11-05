import { Label } from "@medusajs/ui";
import Eye from "@modules/common/icons/eye";
import EyeOff from "@modules/common/icons/eye-off";
import React, { useEffect, useImperativeHandle, useState } from "react";

type InputProps = Omit<
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
  "placeholder"
> & {
  label: string;
  errors?: Record<string, unknown>;
  touched?: Record<string, unknown>;
  name: string;
  topLabel?: string;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ type, name, label, touched, required, topLabel, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [inputType, setInputType] = useState(type);

    useEffect(() => {
      if (type === "password" && showPassword) {
        setInputType("text");
      }

      if (type === "password" && !showPassword) {
        setInputType("password");
      }
    }, [type, showPassword]);

    useImperativeHandle(ref, () => inputRef.current!);

    return (
      <div className="flex w-full flex-col">
        {topLabel && (
          <Label className="txt-compact-medium-plus mb-2">{topLabel}</Label>
        )}
        <div className="txt-compact-medium relative z-0 flex w-full">
          <input
            type={inputType}
            name={name}
            placeholder=" "
            required={required}
            className="bg-ui-bg-field focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover mt-0 block h-11 w-full appearance-none rounded-md border px-4 pt-4 pb-1 focus:ring-0 focus:outline-none"
            {...props}
            ref={inputRef}
          />
          <label
            htmlFor={name}
            onClick={() => inputRef.current?.focus()}
            className="origin-0 text-ui-fg-subtle absolute top-3 -z-1 mx-3 flex items-center justify-center px-1 transition-all duration-300"
          >
            {label}
            {required && <span className="text-rose-500">*</span>}
          </label>
          {type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-ui-fg-subtle focus:text-ui-fg-base absolute top-3 right-0 px-4 transition-all duration-150 outline-none focus:outline-none"
            >
              {showPassword ? <Eye /> : <EyeOff />}
            </button>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
