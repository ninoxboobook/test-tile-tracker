'use client'

import type { FieldError, UseFormRegister } from 'react-hook-form'

interface FormCheckboxProps {
  label: string
  name: string
  register: UseFormRegister<any>
  error?: FieldError
  className?: string
}

export function FormCheckbox({
  label,
  name,
  register,
  error,
  className = '',
}: FormCheckboxProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id={name}
          className="h-4 w-4 rounded border-clay-300 text-primary focus:ring-primary"
          {...register(name)}
        />
        <label 
          htmlFor={name}
          className="text-sm font-medium text-clay-700"
        >
          {label}
        </label>
      </div>
      {error?.message && (
        <p className="text-sm text-red-500">
          {error.message}
        </p>
      )}
    </div>
  )
} 