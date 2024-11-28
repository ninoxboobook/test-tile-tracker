'use client'

import { Fragment, useState } from 'react'
import { Combobox } from '@headlessui/react'
import { ChevronUpDownIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { UseFormRegister, FieldError, Merge, useController, Control } from 'react-hook-form'

interface Option {
  value: string
  label: string
}

interface FormMultiSelectProps {
  label: string
  name: string
  control: Control<any>
  error?: FieldError | Merge<FieldError, (FieldError | undefined)[]>
  options: Option[]
  required?: boolean
  placeholder?: string
  className?: string
}

export function FormMultiSelect({
  label,
  name,
  control,
  error,
  options,
  required,
  placeholder = 'Select options',
  className
}: FormMultiSelectProps) {
  const [query, setQuery] = useState('')
  const {
    field: { value = [], onChange }
  } = useController({
    name,
    control,
    defaultValue: [],
  })

  const filteredOptions =
    query === ''
      ? options
      : options.filter((option) => {
          return option.label.toLowerCase().includes(query.toLowerCase())
        })

  // Get selected options with their full details
  const selectedOptions = value.map(
    (selectedValue: string) => options.find((option) => option.value === selectedValue)
  ).filter((option: Option | undefined): option is Option => option !== undefined)

  const handleSelect = (selectedValue: string) => {
    const newValue = value.includes(selectedValue)
      ? value.filter((v: string) => v !== selectedValue)
      : [...value, selectedValue]
    onChange(newValue)
  }

  const removeOption = (optionValue: string) => {
    onChange(value.filter((v: string) => v !== optionValue))
  }

  return (
    <div className={className}>
      <Combobox as="div" value={null} onChange={handleSelect}>
        <Combobox.Label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </Combobox.Label>
        <div className="relative mt-1">
          <div className="flex flex-wrap gap-2 p-1 border rounded-md">
            {selectedOptions.map((option: Option) => (
              <span
                key={option.value}
                className="inline-flex items-center gap-1 px-2 py-1 text-sm rounded-md bg-clay-100 text-clay-800"
              >
                {option.label}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    removeOption(option.value)
                  }}
                  className="text-clay-500 hover:text-clay-700"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </span>
            ))}
            <Combobox.Input
              className="border-0 p-0 focus:ring-0 text-sm flex-1 min-w-[120px]"
              placeholder={selectedOptions.length === 0 ? placeholder : ''}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center px-2">
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </Combobox.Button>

          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredOptions.length === 0 && query !== '' ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                Nothing found.
              </div>
            ) : (
              filteredOptions.map((option: Option) => (
                <Combobox.Option
                  key={option.value}
                  value={option.value}
                  as={Fragment}
                >
                  {({ active }) => (
                    <li
                      className={`relative cursor-default select-none py-2 pl-3 pr-9 ${
                        active ? 'bg-clay-100 text-clay-900' : 'text-gray-900'
                      } ${value.includes(option.value) ? 'font-semibold' : ''}`}
                    >
                      {option.label}
                    </li>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </div>
      </Combobox>

      {/* Hidden input for form data */}
      {value.map((selectedValue: string) => (
        <input
          key={selectedValue}
          type="hidden"
          name={name}
          value={selectedValue}
        />
      ))}

      {error && (
        <p className="mt-2 text-sm text-red-600" id={`${name}-error`}>
          {error.message}
        </p>
      )}
    </div>
  )
}