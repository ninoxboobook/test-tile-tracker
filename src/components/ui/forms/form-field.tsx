'use client'

import { UseFormRegister, FieldError } from 'react-hook-form'

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  name: string
  register: UseFormRegister<any>
  error?: FieldError
  required?: boolean
}

export function FormField({
  label,
  name,
  register,
  error,
  required,
  type = 'text',
  ...props
}: FormFieldProps) {
  return (
    <div className="space-y-1">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <input
        type={type}
        id={name}
        {...register(name)}
        {...props}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-clay-500 focus:ring-clay-500 sm:text-sm"
      />

      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error.message}
        </p>
      )}
    </div>
  )
} 