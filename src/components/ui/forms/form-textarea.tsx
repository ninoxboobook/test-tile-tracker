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
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-1">
        <textarea
          {...register(name)}
          rows={rows}
          placeholder={placeholder}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-clay-500 focus:ring-clay-500 sm:text-sm"
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error.message}</p>
        )}
      </div>
    </div>
  )
} 