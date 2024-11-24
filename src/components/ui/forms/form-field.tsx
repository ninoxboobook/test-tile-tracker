import { HTMLInputTypeAttribute } from 'react'
import { UseFormRegister, FieldError } from 'react-hook-form'

interface FormFieldProps {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  required?: boolean;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  className?: string;
}

export function FormField({
  label,
  name,
  register,
  error,
  required,
  type = 'text',
  placeholder,
  className,
}: FormFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-1">
        <input
          type={type}
          {...register(name)}
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