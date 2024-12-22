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
  onChange?: (values: string[]) => void
}

export function FormMultiSelect({
  label,
  name,
  control,
  error,
  options,
  required,
  placeholder = 'Select options',
  className,
  onChange: onExternalChange
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

  const selectedOptions = value.map(
    (selectedValue: string) => options.find((option) => option.value === selectedValue)
  ).filter((option: Option | undefined): option is Option => option !== undefined)

  const handleSelect = (selectedValue: string) => {
    const newValue = value.includes(selectedValue)
      ? value.filter((v: string) => v !== selectedValue)
      : [...value, selectedValue]
    onChange(newValue)
    onExternalChange?.(newValue)
  }

  const removeOption = (optionValue: string) => {
    const newValue = value.filter((v: string) => v !== optionValue)
    onChange(newValue)
    onExternalChange?.(newValue)
  }

  return (
    <div className={className}>
      <Combobox as="div" value={null} onChange={handleSelect} className="space-y-2">
        <Combobox.Label className="block font-medium text-clay-700">
          {label} {required && <span className="text-red-500">*</span>}
        </Combobox.Label>
        <div className="relative bg-white/40">
          <div className="flex flex-wrap gap-2 min-h-[42px] py-1 px-3 border border-clay-400 rounded-md">
            {selectedOptions.map((option: Option) => (
              <span
                key={option.value}
                className="inline-flex items-center gap-1 px-2 text-sm rounded-md bg-clay-100 text-clay-800"
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
              className="border-0 p-0 bg-transparent focus:ring-0 flex-1 min-w-[120px] placeholder:text-clay-700"
              placeholder={selectedOptions.length === 0 ? placeholder : ''}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center px-2">
            <ChevronUpDownIcon className="h-5 w-5 text-clay-400" aria-hidden="true" />
          </Combobox.Button>

          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {filteredOptions.length === 0 && query !== '' ? (
              <div className="relative cursor-default select-none py-2 px-4 text-clay-700">
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
                        active ? 'bg-clay-100 text-clay-900' : 'text-clay-900'
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

      {error && (
        <p className="mt-2 text-sm text-red-600" id={`${name}-error`}>
          {error.message}
        </p>
      )}
    </div>
  )
}