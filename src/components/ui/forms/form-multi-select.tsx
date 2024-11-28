'use client'

import { UseFormRegister, FieldError, Merge } from 'react-hook-form'

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
  value?: string[]
}

export function FormMultiSelect({
  label,
  name,
  register,
  error,
  options,
  required,
  value
}: FormMultiSelectProps) {
  const { onChange, ...rest } = register(name)

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value)
    console.log('Multi-select handleChange:', {
      name,
      selectedOptions,
      eventTarget: event.target.value
    })
    onChange({
      target: {
        value: selectedOptions,
        name
      },
      type: 'change'
    })
  }

  // Only add the value and onChange props if it's explicitly controlled
  const selectProps = value !== undefined ? {
    ...rest,
    onChange: handleChange,
    value
  } : {
    ...register(name)
  }

  // Get currently selected values for display
  const selectedValues = value || []

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
        {...selectProps}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error.message}
        </p>
      )}

      {selectedValues.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedValues.map(selectedValue => {
            const option = options.find(opt => opt.value === selectedValue)
            return option && (
              <span
                key={selectedValue}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {option.label}
              </span>
            )
          })}
        </div>
      )}

      <div className="mt-2 text-sm text-gray-500">
        Hold Ctrl (Windows) or Cmd (Mac) to select multiple items
      </div>
    </div>
  )
}