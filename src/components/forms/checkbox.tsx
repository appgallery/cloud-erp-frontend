import React, { useId } from "react";
import { CheckIcon } from "../common/icons";
import { clsx } from "clsx";

type CheckboxProps = {
  label: string;
  name?: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};

export function Checkbox({
  label,
  name,
  checked,
  onChange,
  className,
}: CheckboxProps) {
  const id = useId();

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="flex cursor-pointer items-center select-none text-sm font-medium text-dark-5 dark:text-dark-6"
      >
        <div className="relative">
          <input
            type="checkbox"
            onChange={onChange}
            checked={checked}
            name={name}
            id={id}
            className="peer sr-only"
          />

          <div
            className={clsx(
              "mr-2.5 flex h-5 w-5 items-center justify-center rounded border border-stroke bg-transparent transition peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:*:block dark:border-dark-3 dark:peer-checked:border-primary"
            )}
          >
            <CheckIcon className="hidden text-primary h-3.5 w-3.5" />
          </div>
        </div>
        <span>{label}</span>
      </label>
    </div>
  );
}
