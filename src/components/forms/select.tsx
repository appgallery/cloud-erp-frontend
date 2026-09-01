"use client";

import React, { useState, useRef, useEffect, useId, useMemo } from "react";
import { ChevronDown, Check, Search, X } from "lucide-react";
import { clsx } from "clsx";

export interface SelectOption<T = string> {
  value: T;
  label: string;
  sublabel?: string;
  badge?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface CustomSelectProps<T = string> {
  value?: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
  searchable?: boolean;
  clearable?: boolean;
  size?: "sm" | "md" | "lg";
  align?: "left" | "right";
}

export function CustomSelect<T extends string | number = string>({
  value,
  onChange,
  options,
  placeholder = "Select an option...",
  label,
  required = false,
  disabled = false,
  error,
  hint,
  icon,
  className,
  triggerClassName,
  menuClassName,
  searchable,
  clearable = false,
  size = "md",
  align = "left",
}: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const id = useId();

  const showSearch = searchable ?? options.length > 6;

  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value]
  );

  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return options;
    const term = searchTerm.toLowerCase();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(term) ||
        (opt.sublabel && opt.sublabel.toLowerCase().includes(term)) ||
        (opt.badge && opt.badge.toLowerCase().includes(term))
    );
  }, [options, searchTerm]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("touchstart", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && showSearch) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
    if (isOpen) {
      const idx = filteredOptions.findIndex((o) => o.value === value);
      setActiveIndex(idx >= 0 ? idx : 0);
    }
  }, [isOpen, showSearch, filteredOptions, value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case "Enter":
      case " ":
        if (!isOpen) {
          e.preventDefault();
          setIsOpen(true);
        } else if (activeIndex >= 0 && activeIndex < filteredOptions.length) {
          e.preventDefault();
          const target = filteredOptions[activeIndex];
          if (!target.disabled) {
            onChange(target.value);
            setIsOpen(false);
            setSearchTerm("");
            triggerRef.current?.focus();
          }
        }
        break;
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setActiveIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setActiveIndex((prev) =>
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
        }
        break;
      case "Escape":
        if (isOpen) {
          e.preventDefault();
          setIsOpen(false);
          setSearchTerm("");
          triggerRef.current?.focus();
        }
        break;
      case "Tab":
        if (isOpen) {
          setIsOpen(false);
          setSearchTerm("");
        }
        break;
    }
  };

  const handleSelect = (option: SelectOption<T>) => {
    if (option.disabled) return;
    onChange(option.value);
    setIsOpen(false);
    setSearchTerm("");
    triggerRef.current?.focus();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("" as unknown as T);
    setSearchTerm("");
  };

  const sizeClasses = {
    sm: "py-1.5 px-3 text-xs min-h-[34px]",
    md: "py-2.5 px-3.5 text-xs min-h-[42px]",
    lg: "py-3 px-4 text-sm min-h-[48px]",
  };

  return (
    <div className={clsx("relative w-full text-left", className)} ref={containerRef}>
      {label && (
        <label
          htmlFor={id}
          className="mb-1.5 flex items-center justify-between text-xs font-semibold text-dark dark:text-white"
        >
          <span>
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </span>
        </label>
      )}

      <button
        id={id}
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-invalid={!!error}
        className={clsx(
          "group relative flex w-full items-center justify-between gap-2 rounded-xl border bg-gray-2 text-left font-medium transition duration-150 focus:outline-none focus:ring-2 focus:ring-primary/20",
          error
            ? "border-red-500 bg-red-50/20 focus:border-red-500 dark:border-red-500"
            : isOpen
            ? "border-primary bg-white shadow-xs dark:border-primary dark:bg-dark-2"
            : "border-stroke hover:border-dark-5/40 hover:bg-white dark:border-dark-3 dark:bg-dark-2 dark:hover:border-dark-4 dark:hover:bg-dark-3",
          disabled && "cursor-not-allowed opacity-60 bg-gray-3 dark:bg-dark-3",
          sizeClasses[size],
          triggerClassName
        )}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2.5 overflow-hidden">
          {icon && (
            <span className="shrink-0 text-dark-5 transition group-hover:text-dark dark:text-dark-6 dark:group-hover:text-white">
              {icon}
            </span>
          )}

          {selectedOption ? (
            <div className="flex min-w-0 items-center gap-1.5 truncate">
              {selectedOption.icon && (
                <span className="shrink-0">{selectedOption.icon}</span>
              )}
              <span className="truncate font-semibold text-dark dark:text-white">
                {selectedOption.label}
              </span>
              {selectedOption.badge && (
                <span className="shrink-0 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary dark:bg-primary/20">
                  {selectedOption.badge}
                </span>
              )}
            </div>
          ) : (
            <span className="truncate text-dark-5 dark:text-dark-6">
              {placeholder}
            </span>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {clearable && selectedOption && !disabled && (
            <span
              role="button"
              tabIndex={-1}
              onClick={handleClear}
              className="rounded p-0.5 text-dark-5 hover:bg-gray-3 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
              title="Clear selection"
            >
              <X className="h-3.5 w-3.5" />
            </span>
          )}
          <ChevronDown
            className={clsx(
              "h-4 w-4 shrink-0 text-dark-5 transition-transform duration-200 dark:text-dark-6",
              isOpen && "rotate-180 text-primary"
            )}
          />
        </div>
      </button>

      {isOpen && (
        <div
          ref={listboxRef}
          role="listbox"
          tabIndex={-1}
          className={clsx(
            "absolute z-[100] mt-1.5 w-full min-w-[200px] max-w-[calc(100vw-2rem)] rounded-2xl border border-stroke bg-white p-1.5 shadow-xl transition-all dark:border-dark-3 dark:bg-gray-dark animate-in fade-in zoom-in-95 duration-100",
            align === "right" ? "right-0" : "left-0",
            menuClassName
          )}
        >
          {showSearch && (
            <div className="relative mb-1.5 px-1 pt-1">
              <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-dark-5 dark:text-dark-6" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search options..."
                className="w-full rounded-xl border border-stroke bg-gray-2 py-1.5 pl-8 pr-3 text-xs text-dark placeholder:text-dark-6 focus:border-primary focus:bg-white focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              />
            </div>
          )}

          <div className="max-h-60 overflow-y-auto no-scrollbar space-y-0.5 p-0.5">
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-xs text-dark-5 dark:text-dark-6">
                No matching options found.
              </div>
            ) : (
              filteredOptions.map((opt, index) => {
                const isSelected = opt.value === value;
                const isFocused = index === activeIndex;

                return (
                  <button
                    key={String(opt.value)}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    disabled={opt.disabled}
                    onClick={() => handleSelect(opt)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={clsx(
                      "group flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition cursor-pointer select-none",
                      isSelected
                        ? "bg-primary/10 font-bold text-primary dark:bg-primary/20"
                        : isFocused
                        ? "bg-gray-2 text-dark dark:bg-dark-3 dark:text-white"
                        : "text-dark hover:bg-gray-2 dark:text-white dark:hover:bg-dark-3",
                      opt.disabled && "cursor-not-allowed opacity-40 hover:bg-transparent"
                    )}
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      {opt.icon && (
                        <span className="shrink-0">{opt.icon}</span>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="truncate">{opt.label}</span>
                          {opt.badge && (
                            <span className="shrink-0 rounded bg-primary/10 px-1.5 py-0.2 text-[10px] font-semibold text-primary">
                              {opt.badge}
                            </span>
                          )}
                        </div>
                        {opt.sublabel && (
                          <div className="truncate text-[10px] text-dark-5 dark:text-dark-6">
                            {opt.sublabel}
                          </div>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <Check className="h-4 w-4 shrink-0 text-primary" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Error or Helper Message */}
      {error ? (
        <p className="mt-1 text-[11px] font-medium text-red-500">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-[11px] text-dark-5 dark:text-dark-6">{hint}</p>
      ) : null}
    </div>
  );
}

export interface NativeSelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  icon?: React.ReactNode;
  size?: "sm" | "md";
}

export function NativeSelect({
  value,
  onChange,
  children,
  className,
  icon,
  size = "md",
  disabled = false,
  ...props
}: NativeSelectProps) {
  return (
    <div className="relative inline-block w-full">
      {icon && (
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-dark-5 dark:text-dark-6">
          {icon}
        </div>
      )}
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={clsx(
          "w-full appearance-none rounded-xl border border-stroke bg-gray-2 text-xs font-semibold text-dark outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
          size === "sm" ? "py-1.5 pl-3 pr-8 text-xs" : "py-2.5 pl-3.5 pr-9 text-xs",
          icon && (size === "sm" ? "pl-8" : "pl-9"),
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-dark-5 dark:text-dark-6" />
    </div>
  );
}
