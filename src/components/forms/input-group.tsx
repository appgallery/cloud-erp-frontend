import React, { type HTMLInputTypeAttribute, useId } from "react";
import { clsx } from "clsx";

type InputGroupProps = {
  className?: string;
  label: string;
  placeholder: string;
  type: HTMLInputTypeAttribute;
  required?: boolean;
  disabled?: boolean;
  active?: boolean;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  name?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  height?: "sm" | "default";
  defaultValue?: string;
};

export function InputGroup({
  className,
  label,
  type,
  placeholder,
  required,
  disabled,
  active,
  handleChange,
  icon,
  iconPosition = "right",
  height = "default",
  ...props
}: InputGroupProps) {
  const id = useId();

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-dark dark:text-white mb-2"
      >
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <div
        className={clsx(
          "relative [&_svg]:absolute [&_svg]:top-1/2 [&_svg]:-translate-y-1/2",
          iconPosition === "left" ? "[&_svg]:left-4" : "[&_svg]:right-4"
        )}
      >
        <input
          id={id}
          type={type}
          name={props.name}
          placeholder={placeholder}
          onChange={handleChange}
          value={props.value}
          defaultValue={props.defaultValue}
          className={clsx(
            "w-full rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition focus:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary dark:disabled:bg-dark",
            "px-4.5 py-3 text-dark placeholder:text-dark-6 dark:text-white text-sm font-medium",
            iconPosition === "left" && "pl-11",
            iconPosition === "right" && icon && "pr-11",
            height === "sm" && "py-2"
          )}
          required={required}
          disabled={disabled}
        />

        {icon}
      </div>
    </div>
  );
}
