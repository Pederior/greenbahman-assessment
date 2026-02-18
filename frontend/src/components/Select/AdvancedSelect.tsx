import React, { useState, useMemo, useRef } from 'react';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { CheckIcon, ChevronUpDownIcon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...classes: (string | undefined | null | false)[]) {
  return twMerge(clsx(classes));
}

export interface SelectOption<T = string> {
  value: T;
  label: string;
  group?: string;
  disabled?: boolean;
}

export interface AdvancedSelectProps<T = string> {
  options: SelectOption<T>[];
  value?: T | T[];
  onChange?: (value: T | T[]) => void;
  multiple?: boolean;
  placeholder?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  showSelectAll?: boolean;
  selectAllLabel?: string;
  selectNoneLabel?: string;
  label?: string;
  disabled?: boolean;
  virtualize?: boolean;
  itemHeight?: number;
  maxVisibleItems?: number;
  className?: string;
  showCount?: boolean;
  countLabel?: (count: number, total: number) => string;
  clearable?: boolean;
}

export function AdvancedSelect<T = string>({
  options,
  value,
  onChange,
  multiple = false,
  placeholder = 'Select an option',
  searchable = false,
  searchPlaceholder = 'Search...',
  showSelectAll = false,
  selectAllLabel = 'Select All',
  selectNoneLabel = 'Select None',
  label,
  disabled = false,
  virtualize = true,
  itemHeight = 40,
  maxVisibleItems = 8,
  className,
  showCount = true,
  countLabel = (count, total) => `${count} of ${total} selected`,
  clearable = false,
}: AdvancedSelectProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);

  const selectedValues = useMemo(() => {
    if (value === undefined || value === null) return [];
    return Array.isArray(value) ? value : [value];
  }, [value]);

  const selectedOptions = useMemo(() => {
    return options.filter((opt) => selectedValues.includes(opt.value));
  }, [options, selectedValues]);

  const groups = useMemo(() => {
    const grouped: Record<string, SelectOption<T>[]> = {};
    const ungrouped: SelectOption<T>[] = [];

    options.forEach((opt) => {
      if (opt.group) {
        if (!grouped[opt.group]) {
          grouped[opt.group] = [];
        }
        grouped[opt.group].push(opt);
      } else {
        ungrouped.push(opt);
      }
    });

    return { grouped, ungrouped };
  }, [options]);

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const query = searchQuery.toLowerCase();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(query) ||
        opt.group?.toLowerCase().includes(query)
    );
  }, [options, searchQuery]);

  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return groups;

    const query = searchQuery.toLowerCase();
    const grouped: Record<string, SelectOption<T>[]> = {};
    const ungrouped: SelectOption<T>[] = [];

    Object.entries(groups.grouped).forEach(([groupName, groupOptions]) => {
      const filtered = groupOptions.filter(
        (opt) =>
          opt.label.toLowerCase().includes(query) ||
          groupName.toLowerCase().includes(query)
      );
      if (filtered.length > 0) {
        grouped[groupName] = filtered;
      }
    });

    groups.ungrouped.forEach((opt) => {
      if (opt.label.toLowerCase().includes(query)) {
        ungrouped.push(opt);
      }
    });

    return { grouped, ungrouped };
  }, [groups, searchQuery]);

  const allEnabledOptions = useMemo(() => {
    return options.filter((opt) => !opt.disabled);
  }, [options]);

  const allSelected = useMemo(() => {
    if (!multiple || allEnabledOptions.length === 0) return false;
    return allEnabledOptions.every((opt) => selectedValues.includes(opt.value));
  }, [multiple, allEnabledOptions, selectedValues]);

  const someSelected = useMemo(() => {
    if (!multiple || allEnabledOptions.length === 0) return false;
    const enabledSelected = allEnabledOptions.filter((opt) =>
      selectedValues.includes(opt.value)
    );
    return enabledSelected.length > 0 && enabledSelected.length < allEnabledOptions.length;
  }, [multiple, allEnabledOptions, selectedValues]);

  const handleSelectAll = () => {
    if (!multiple || !onChange) return;
    if (allSelected) {
      const newValue = selectedValues.filter(
        (v) => !allEnabledOptions.some((opt) => opt.value === v)
      );
      onChange(newValue as T | T[]);
    } else {
      const allValues = allEnabledOptions.map((opt) => opt.value);
      onChange(allValues as T | T[]);
    }
  };

  const handleSelectNone = () => {
    if (!multiple || !onChange) return;
    const newValue = selectedValues.filter(
      (v) => allEnabledOptions.some((opt) => opt.value === v)
    );
    onChange(newValue as T | T[]);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onChange) return;
    if (multiple) {
      onChange([] as T[]);
    } else {
      onChange(undefined as unknown as T);
    }
  };

  const handleOptionChange = (optionValue: T) => {
    if (!onChange) return;

    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      if (currentValues.includes(optionValue)) {
        onChange(currentValues.filter((v) => v !== optionValue) as T[]);
      } else {
        onChange([...currentValues, optionValue] as T[]);
      }
    } else {
      onChange(optionValue as T | T[]);
      setIsOpen(false);
    }
  };

  const virtualOptions = useMemo(() => {
    if (!virtualize) return filteredOptions;
    
    const result: (SelectOption<T> | { type: 'group'; name: string })[] = [];
    const currentGroups = searchQuery ? filteredGroups : groups;

    Object.entries(currentGroups.grouped).forEach(([groupName, groupOptions]) => {
      result.push({ type: 'group', name: groupName });
      result.push(...groupOptions);
    });

    result.push(...currentGroups.ungrouped);
    return result;
  }, [virtualize, filteredOptions, filteredGroups, groups, searchQuery]);

  const rowVirtualizer = useVirtualizer({
    count: virtualOptions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeight,
    overscan: 5,
  });

  const displayValue = useMemo(() => {
    if (selectedOptions.length === 0) return placeholder;
    if (!multiple) return selectedOptions[0]?.label || placeholder;
    return selectedOptions.slice(0, 3).map((opt) => opt.label).join(', ') +
      (selectedOptions.length > 3 ? ` +${selectedOptions.length - 3}` : '');
  }, [selectedOptions, multiple, placeholder]);

  const renderOption = (option: SelectOption<T>, isSelected: boolean) => (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          'flex h-5 w-5 items-center justify-center rounded border transition-colors',
          isSelected
            ? 'bg-blue-600 border-blue-600'
            : 'bg-white border-gray-300',
          option.disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        {isSelected && (
          <CheckIcon className="h-3.5 w-3.5 text-white" strokeWidth={3} />
        )}
      </div>
      <span className={cn('flex-1 truncate', option.disabled && 'text-gray-400')}>
        {option.label}
      </span>
    </div>
  );

  const renderVirtualizedOptions = () => {
    return (
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const item = virtualOptions[virtualRow.index];
          
          if ('type' in item && item.type === 'group') {
            return (
              <div
                key={virtualRow.key}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
                className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 sticky top-0"
              >
                {item.name}
              </div>
            );
          }

          const option = item as SelectOption<T>;
          const isSelected = selectedValues.includes(option.value);

          return (
            <ListboxOption
              key={virtualRow.key}
              value={option.value}
              disabled={option.disabled}
              className={({ active, disabled }) =>
                cn(
                  'relative cursor-default select-none py-2 px-3 transition-colors',
                  active && !disabled ? 'bg-blue-50 text-blue-900' : 'text-gray-900',
                  disabled && 'text-gray-400 cursor-not-allowed'
                )
              }
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {({ selected }) => renderOption(option, selected)}
            </ListboxOption>
          );
        })}
      </div>
    );
  };

  const renderNonVirtualizedOptions = () => {
    const currentGroups = searchQuery ? filteredGroups : groups;

    return (
      <>
        {Object.entries(currentGroups.grouped).map(([groupName, groupOptions]) => (
          <div key={groupName}>
            <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 sticky top-0">
              {groupName}
            </div>
            {groupOptions.map((option) => (
              <ListboxOption
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className={({ active, disabled }) =>
                  cn(
                    'relative cursor-default select-none py-2 px-3 transition-colors',
                    active && !disabled ? 'bg-blue-50 text-blue-900' : 'text-gray-900',
                    disabled && 'text-gray-400 cursor-not-allowed'
                  )
                }
              >
                {({ selected }) => renderOption(option, selected)}
              </ListboxOption>
            ))}
          </div>
        ))}
        {currentGroups.ungrouped.length > 0 && (
          <>
            {currentGroups.ungrouped.map((option) => (
              <ListboxOption
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className={({ active, disabled }) =>
                  cn(
                    'relative cursor-default select-none py-2 px-3 transition-colors',
                    active && !disabled ? 'bg-blue-50 text-blue-900' : 'text-gray-900',
                    disabled && 'text-gray-400 cursor-not-allowed'
                  )
                }
              >
                {({ selected }) => renderOption(option, selected)}
              </ListboxOption>
            ))}
          </>
        )}
      </>
    );
  };

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <Listbox
        value={value}
        onChange={handleOptionChange}
        multiple={multiple}
        disabled={disabled}
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
          setSearchQuery('');
        }}
        onOpenChange={setIsOpen}
      >
        <div className="relative">
          <ListboxButton
            className={cn(
              'relative w-full cursor-default rounded-lg bg-white py-2.5 px-4 text-left',
              'border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
              'shadow-sm transition-all duration-200',
              disabled && 'bg-gray-100 text-gray-500 cursor-not-allowed',
              multiple && selectedValues.length > 0 && 'border-blue-400 ring-1 ring-blue-400'
            )}
          >
            <span className="block truncate">{displayValue}</span>
            
            <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-2">
              {clearable && selectedValues.length > 0 && (
                <button
                  onClick={handleClear}
                  className="p-0.5 hover:bg-gray-200 rounded-full transition-colors"
                  tabIndex={-1}
                >
                  <XMarkIcon className="h-4 w-4 text-gray-400" />
                </button>
              )}
              <span className="pointer-events-none">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
              </span>
            </div>
          </ListboxButton>

          {showCount && multiple && selectedValues.length > 0 && (
            <div className="absolute -bottom-5 left-0 text-xs text-gray-500">
              {countLabel(selectedValues.length, options.length)}
            </div>
          )}

          <ListboxOptions
            static
            className={cn(
              'absolute z-50 mt-2 max-h-80 w-full overflow-auto rounded-xl bg-white',
              'shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none',
              'border border-gray-200'
            )}
            style={{
              maxHeight: `${maxVisibleItems * itemHeight + 80}px`,
            }}
          >
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-2">
              {searchable && (
                <div className="relative mb-2">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}
              
              {multiple && showSelectAll && (
                <div className="flex gap-2">
                  <button
                    onClick={handleSelectAll}
                    className={cn(
                      'flex-1 px-2 py-1 text-xs font-medium rounded-md transition-colors',
                      allSelected
                        ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                      someSelected && !allSelected && 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                    )}
                  >
                    {allSelected ? '✓ ' : ''}{selectAllLabel}
                  </button>
                  <button
                    onClick={handleSelectNone}
                    disabled={selectedValues.length === 0}
                    className="flex-1 px-2 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {selectNoneLabel}
                  </button>
                </div>
              )}
            </div>

            <div ref={parentRef} className="p-1">
              {virtualize && virtualOptions.length > maxVisibleItems
                ? renderVirtualizedOptions()
                : renderNonVirtualizedOptions()}
            </div>

            {filteredOptions.length === 0 && (
              <div className="px-4 py-8 text-center text-gray-500 text-sm">
                {searchQuery ? 'No results found' : 'No options available'}
              </div>
            )}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  );
}
