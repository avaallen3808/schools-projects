import { forwardRef, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-text">{label}</label>}
      <input
        ref={ref}
        className={`w-full px-4 py-2.5 text-sm rounded-xl outline-none border border-border focus:border-primary bg-bg text-text ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  ),
);
Input.displayName = 'Input';
