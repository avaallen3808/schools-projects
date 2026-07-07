import { forwardRef, SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', ...props }, ref) => (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium" style={{ color: '#4c4c4c' }}>{label}</label>}
      <select
        ref={ref}
        className={`w-full px-4 py-2.5 text-sm rounded-xl outline-none ${className}`}
        style={{ border: '1px solid #f6f4ee', color: '#4c4c4c', background: '#fff' }}
        {...props}
      >
        <option value="">Pilih...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-xs" style={{ color: '#dc2626' }}>{error}</p>}
    </div>
  ),
);
Select.displayName = 'Select';
