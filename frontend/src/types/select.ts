export interface SelectOption {
  id: string | number;
  label: string;
  group?: string; 
  disabled?: boolean;
}

export interface AdvancedSelectProps {
  options: SelectOption[];
  value: SelectOption[];
  onChange: (selected: SelectOption[]) => void;
  label?: string;
  placeholder?: string;
  maxVisibleItems?: number; 
}