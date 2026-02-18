import { useState } from 'react';
import { AdvancedSelect } from './AdvancedSelect';
import { largeOptions } from './data';
import { type SelectOption } from '../../types/select';

export default function DemoSelect() {
  const [selected, setSelected] = useState<SelectOption[]>([]);

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">تسک ۳: کامپوننت Select پیشرفته</h1>
      <div className="bg-white p-6 rounded shadow">
        <AdvancedSelect
          label="انتخاب گزینه‌ها (همراه با جستجو و مجازی‌سازی)"
          options={largeOptions}
          value={selected}
          onChange={setSelected}
          placeholder="جستجو کنید..."
        />
        
        <div className="mt-8">
          <h3 className="font-semibold mb-2">خروجی انتخاب‌ها (Console Log):</h3>
          <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
            {JSON.stringify(selected, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}