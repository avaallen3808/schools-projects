import { forwardRef, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium" style={{ color: '#4c4c4c' }}>{label}</label>}
      <input
        ref={ref}
        className={`w-full px-4 py-2.5 text-sm rounded-xl outline-none ${className}`}
        style={{ border: '1px solid #f6f4ee', color: '#4c4c4c', background: '#fff' }}
        {...props}
      />
      {error && <p className="text-xs" style={{ color: '#dc2626' }}>{error}</p>}
    </div>
  ),
);
Input.displayName = 'Input';
