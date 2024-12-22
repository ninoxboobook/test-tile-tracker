'use client'

import { Fragment, useState } from 'react'
import { Popover } from '@headlessui/react'
import { ChevronUpDownIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { HexColorPicker } from 'react-colorful'
import chroma from 'chroma-js'

type ColorCategory =
  | 'Red'
  | 'Pink'
  | 'Purple'
  | 'Blue'
  | 'Turquoise'
  | 'Green'
  | 'Yellow'
  | 'Orange'
  | 'White'
  | 'Grey'
  | 'Brown'
  | 'Black'

interface ColorValue {
  hex: string
  category: ColorCategory
}

interface FormColorPickerProps {
  label: string
  value?: string
  onChange?: (value: ColorValue | undefined) => void
  required?: boolean
  error?: { message?: string }
  className?: string
}

export function FormColorPicker({
  label,
  value,
  onChange,
  required,
  error,
  className
}: FormColorPickerProps) {
  const [selectedColor, setSelectedColor] = useState<string | undefined>(value)

  // Categorize color based on HSL values
  const categorizeColor = (hex: string): ColorCategory => {
    try {
      const color = chroma(hex)
      const [h, s, l] = color.hsl()
      
      // Handle true white and black first
      if (l >= 0.98) return 'White'  // Only pure white
      if (l <= 0.08) return 'Black'

      // Normalize hue to 0-360 range
      const hue = h < 0 ? h + 360 : h

      // Handle very light colors (but not white)
      if (l >= 0.90) {
        // If it has enough saturation, categorize by hue
        if (s > 0.05) {
          if (hue >= 345 || hue < 10) return 'Red'
          if (hue >= 10 && hue < 45) return 'Orange'
          if (hue >= 45 && hue < 65) return 'Yellow'
          if (hue >= 65 && hue < 150) return 'Green'
          if (hue >= 150 && hue < 175) return 'Turquoise'
          if (hue >= 175 && hue < 255) return 'Blue'
          if (hue >= 255 && hue < 315) return 'Purple'
          if (hue >= 315 && hue < 345) return 'Pink'
        }
        return 'White'  // If not enough saturation, it's white
      }

      // Expanded grey detection
      const saturationThreshold = l > 0.5 ? 0.15 : 0.25
      if (s <= saturationThreshold) {
        if (l >= 0.95) return 'White'
        if (l <= 0.2) return 'Black'
        return 'Grey'
      }

      // Special case for browns
      if (
        (hue >= 10 && hue < 40) &&
        (
          (l < 0.4 && s > 0.2 && s <= 0.5) ||
          (l >= 0.4 && l < 0.55 && s > 0.15 && s <= 0.45) ||
          (l >= 0.55 && l < 0.65 && s > 0.1 && s <= 0.35)
        )
      ) {
        return 'Brown'
      }

      // For desaturated colors (but not as desaturated as greys)
      if (s <= 0.3) {
        if (hue >= 345 || hue < 10) return 'Red'
        if (hue >= 10 && hue < 45) return 'Orange'
        if (hue >= 45 && hue < 65) return 'Yellow'
        if (hue >= 65 && hue < 150) return 'Green'
        if (hue >= 150 && hue < 175) return 'Turquoise'
        if (hue >= 175 && hue < 255) return 'Blue'
        if (hue >= 255 && hue < 315) return 'Purple'
        if (hue >= 315 && hue < 345) return 'Pink'
      }

      // Categorize by hue ranges for saturated colors
      if (hue >= 345 || hue < 10) return 'Red'
      if (hue >= 10 && hue < 45) return 'Orange'
      if (hue >= 45 && hue < 65) return 'Yellow'
      if (hue >= 65 && hue < 150) return 'Green'
      if (hue >= 150 && hue < 175) return 'Turquoise'
      if (hue >= 175 && hue < 255) return 'Blue'
      if (hue >= 255 && hue < 315) return 'Purple'
      if (hue >= 315 && hue < 345) return 'Pink'

      return 'Grey'
    } catch {
      return 'Grey'
    }
  }

  const handleColorChange = (hex: string) => {
    setSelectedColor(hex)
    onChange?.({ hex, category: categorizeColor(hex) })
  }

  const clearColor = () => {
    setSelectedColor(undefined)
    onChange?.(undefined)
  }

  return (
    <div className={className}>
      <Popover as="div" className="space-y-2">
        <div className="block font-medium text-clay-700">
          {label} {required && <span className="text-red-500">*</span>}
        </div>
        <div className="relative bg-white/40">
          <div className="flex flex-wrap gap-2 min-h-[42px] py-1 px-3 border border-clay-400 rounded-md">
            {selectedColor ? (
              <span
                className="inline-flex items-center gap-2 px-2 text-sm rounded-md bg-clay-100 text-clay-800"
              >
                <span 
                  className="w-6 h-6 rounded border border-clay-200" 
                  style={{ backgroundColor: selectedColor }}
                />
                <span>{selectedColor.toUpperCase()}</span>
                <span>{categorizeColor(selectedColor)}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    clearColor()
                  }}
                  className="text-clay-500 hover:text-clay-700"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </span>
            ) : (
              <span className="text-clay-700">Select colour</span>
            )}
          </div>
          <Popover.Button className="absolute inset-y-0 right-0 flex items-center px-2">
            <ChevronUpDownIcon className="h-5 w-5 text-clay-400" aria-hidden="true" />
          </Popover.Button>

          <Popover.Panel className="absolute z-10 mt-1 w-fit overflow-auto rounded-md bg-white p-4 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <HexColorPicker color={selectedColor} onChange={handleColorChange} />
          </Popover.Panel>
        </div>
      </Popover>

      {error && (
        <p className="mt-2 text-sm text-red-600" id="color-error">
          {error.message}
        </p>
      )}
    </div>
  )
}
