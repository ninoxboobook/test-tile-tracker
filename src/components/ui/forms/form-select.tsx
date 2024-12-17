'use client'

import { Fragment, useEffect } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { UseFormRegister, FieldError, useController, Control } from 'react-hook-form'

interface Option {
  value: string
  label: string
}

interface FormSelectProps {
  label: string
  name: string
  control: Control<any>
  options: Option[]
  error?: FieldError
  required?: boolean
  placeholder?: string
  className?: string
}

export function FormSelect({
  label,
  name,
  control,
  options,
  error,
  required,
  placeholder = 'Select an option',
  className,
}: FormSelectProps) {
  const {
    field: { value, onChange }
  } = useController({
    name,
    control,
    defaultValue: '',
  })

  // Find the currently selected option
  const selectedOption = options.find(option => option.value === value) || { value: '', label: placeholder }

  return (
    <div className={className}>
      <Listbox value={value} onChange={onChange}>
        {({ open }) => (
          <>
            <Listbox.Label className="block text-sm font-medium text-clay-700">
              {label} {required && <span className="text-red-500">*</span>}
            </Listbox.Label>
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full cursor-default rounded-md border border-clay-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-clay-500 focus:outline-none focus:ring-1 focus:ring-clay-500 sm:text-sm">
                <span className="block truncate">{selectedOption.label}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5 text-clay-400" aria-hidden="true" />
                </span>
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  <Listbox.Option
                    key=""
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-3 pr-9 ${
                        active ? 'bg-clay-100 text-clay-900' : 'text-clay-900'
                      }`
                    }
                    value=""
                  >
                    {({ selected, active }) => (
                      <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                        {placeholder}
                      </span>
                    )}
                  </Listbox.Option>
                  {options.map((option) => (
                    <Listbox.Option
                      key={option.value}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-3 pr-9 ${
                          active ? 'bg-clay-100 text-clay-900' : 'text-clay-900'
                        }`
                      }
                      value={option.value}
                    >
                      {({ selected, active }) => (
                        <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                          {option.label}
                        </span>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
      {/* Hidden input to ensure the value is included in form data */}
      <input type="hidden" name={name} value={value || ''} />
      {error && (
        <p className="mt-2 text-sm text-red-600" id={`${name}-error`}>
          {error.message}
        </p>
      )}
    </div>
  )
}