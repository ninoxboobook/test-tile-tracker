'use client'

import { UseFormRegister, FieldError } from 'react-hook-form'

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  name: string
  helpText?: string
  register: UseFormRegister<any>
  error?: FieldError
  required?: boolean
}

export function FormField({
  label,
  name,
  helpText,
  register,
  error,
  required,
  type = 'text',
  ...props
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="block font-medium text-clay-700"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {helpText && <span className="text-sm text-clay-500">{helpText}</span>}
      <input
        type={type}
        id={name}
        {...register(name)}
        {...props}
        className="mt-1 block w-full rounded-md border-clay-400 bg-white/40 focus:border-clay-500 focus:ring-clay-500 placeholder:text-clay-700"
      />

      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error.message}
        </p>
      )}
    </div>
  )
} 