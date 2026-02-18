import {type SelectOption } from '../../types/select';

export const largeOptions: SelectOption[] = Array.from({ length: 1000 }, (_, i) => ({
  id: i,
  label: `Option ${i + 1}`,
  group: i % 5 === 0 ? 'Group A' : i % 3 === 0 ? 'Group B' : 'Group C',
}));