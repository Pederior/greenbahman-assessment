import { Fragment, useState, useMemo, useRef } from "react";
import { Listbox, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ChevronUpDownIcon,
  XCircleIcon,
} from "@heroicons/react/20/solid";
import { useVirtualizer } from "@tanstack/react-virtual";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { AdvancedSelectProps } from "../../types/select";


function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export function AdvancedSelect({
  options,
  value,
  onChange,
  label,
  placeholder = "Select items...",
  maxVisibleItems = 5,
}: AdvancedSelectProps) {
  const [query, setQuery] = useState("");
  const ITEM_HEIGHT = 40;
  const parentRef = useRef<HTMLDivElement>(null);

  // ۱. فیلتر کردن آیتم‌ها
  const filteredOptions = useMemo(() => {
    return options.filter((option) =>
      option.label.toLowerCase().includes(query.toLowerCase()),
    );
  }, [options, query]);

// eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: filteredOptions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ITEM_HEIGHT,
    overscan: 5,
  });

  const handleSelectAll = () => {
    if (value.length === filteredOptions.length) {
      onChange([]);
    } else {
      onChange(filteredOptions.filter((opt) => !opt.disabled));
    }
  };

  const removeOption = (e: React.MouseEvent, id: string | number) => {
    e.stopPropagation();
    onChange(value.filter((item) => item.id !== id));
  };

  return (
    <div className="w-full max-w-md">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <Listbox value={value} onChange={onChange} multiple>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 sm:text-sm border border-gray-300">
            <span className="block truncate">
              {value.length > 0
                ? `${value.length} items selected`
                : placeholder}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>

          {value.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {value.map((item) => (
                <span
                  key={item.id}
                  className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800"
                >
                  {item.label}
                  <button
                    onClick={(e) => removeOption(e, item.id)}
                    className="ml-1 hover:text-blue-600"
                  >
                    <XCircleIcon className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              static
              className="absolute mt-1 w-full overflow-hidden rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50"
            >
              <div className="sticky top-0 bg-white z-10 p-2 border-b">
                <input
                  type="text"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-1 mb-2"
                  placeholder="Search..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  onClick={handleSelectAll}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  {value.length === filteredOptions.length
                    ? "Deselect All"
                    : "Select All"}
                </button>
              </div>

              <div
                ref={parentRef}
                className="overflow-auto"
                style={{
                  height:
                    Math.min(filteredOptions.length, maxVisibleItems) *
                    ITEM_HEIGHT,
                }}
              >
                <div
                  style={{
                    height: `${virtualizer.getTotalSize()}px`,
                    width: "100%",
                    position: "relative",
                  }}
                >
                  {virtualizer.getVirtualItems().map((virtualItem) => {
                    const option = filteredOptions[virtualItem.index];
                    const isSelected = value.some((v) => v.id === option.id);
                    const isGroupHeader =
                      virtualItem.index > 0 &&
                      filteredOptions[virtualItem.index - 1].group !==
                        option.group;

                    return (
                      <div
                        key={virtualItem.key}
                        data-index={virtualItem.index}
                        ref={virtualizer.measureElement}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          transform: `translateY(${virtualItem.start}px)`,
                        }}
                        className={cn(
                          "cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-blue-50",
                          isSelected
                            ? "bg-blue-100 text-blue-900"
                            : "text-gray-900",
                          isGroupHeader ? "border-t pt-3" : "",
                        )}
                        onClick={() => {
                          if (option.disabled) return;
                          if (isSelected) {
                            onChange(value.filter((v) => v.id !== option.id));
                          } else {
                            onChange([...value, option]);
                          }
                        }}
                      >
                        {isGroupHeader && option.group && (
                          <div className="text-xs font-semibold text-gray-500 mb-1">
                            {option.group}
                          </div>
                        )}
                        <span
                          className={cn(
                            "block truncate",
                            isSelected ? "font-semibold" : "font-normal",
                          )}
                        >
                          {option.label}
                        </span>
                        {isSelected && (
                          <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {filteredOptions.length === 0 && (
                <div className="p-3 text-gray-500 text-center">
                  No results found
                </div>
              )}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
