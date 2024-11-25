'use client'

import { UseFormRegister, FieldError, Merge } from 'react-hook-form'
import { useState } from 'react'

interface Option {
  value: string
  label: string
}

interface FormMultiSelectProps {
  label: string
  name: string
  register: UseFormRegister<any>
  error?: FieldError | Merge<FieldError, FieldError[]>
  options: Option[]
  required?: boolean
}

export function FormMultiSelect({
  label,
  name,
  register,
  error,
  options,
  required
}: FormMultiSelectProps) {
  const [selectedValues, setSelectedValues] = useState<string[]>([])

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const values = Array.from(e.target.selectedOptions, option => option.value)
    setSelectedValues(values)
  }

  return (
    <div className="space-y-1">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <select
        multiple
        id={name}
        {...register(name)}
        onChange={handleSelectChange}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-clay-500 focus:border-clay-500 sm:text-sm rounded-md"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="py-1"
          >
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error.message}
        </p>
      )}

      <div className="mt-2 text-sm text-gray-500">
        Hold Ctrl (Windows) or Cmd (Mac) to select multiple items
      </div>

      {selectedValues.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedValues.map(value => {
            const option = options.find(opt => opt.value === value)
            return (
              <span
                key={value}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-clay-100 text-clay-800"
              >
                {option?.label}
              </span>
            )}
          )}
        </div>
      )}
    </div>
  )
} 