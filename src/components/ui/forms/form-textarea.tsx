import { UseFormRegister, FieldError } from 'react-hook-form'

interface FormTextareaProps {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  required?: boolean;
  rows?: number;
  placeholder?: string;
  className?: string;
}

export function FormTextarea({
  label,
  name,
  register,
  error,
  required,
  rows = 3,
  placeholder,
  className,
}: FormTextareaProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor={name} className="block font-medium text-clay-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div>
        <textarea
          {...register(name)}
          rows={rows}
          placeholder={placeholder}
          className="block w-full rounded-md bg-white/40 border-clay-400 focus:border-clay-500 focus:ring-clay-500"
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error.message}</p>
        )}
      </div>
    </div>
  )
} 