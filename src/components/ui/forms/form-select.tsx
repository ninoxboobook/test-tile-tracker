import { UseFormRegister, FieldError } from 'react-hook-form'

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  options: Option[];
  error?: FieldError;
  required?: boolean;
  placeholder?: string;
  className?: string;
  value?: string;
}

export function FormSelect({
  label,
  name,
  register,
  options,
  error,
  required,
  placeholder = 'Select an option',
  className,
  value,
}: FormSelectProps) {
  // Only add the value prop if it's explicitly provided
  const selectProps = value !== undefined ? {
    ...register(name),
    value: value
  } : register(name)

  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-1">
        <select
          {...selectProps}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-clay-500 focus:ring-clay-500 sm:text-sm"
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error.message}</p>
        )}
      </div>
    </div>
  )
}