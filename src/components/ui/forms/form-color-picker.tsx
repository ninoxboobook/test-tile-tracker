'use client'

import { useCallback, useEffect, useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import chroma from 'chroma-js'

export type ColorCategory =
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

interface FormColorPickerProps {
  label?: string
  value?: string
  onChange?: (color: { hex: string; category: ColorCategory }) => void
  required?: boolean
  error?: { message?: string }
  className?: string
}

export function FormColorPicker({
  label,
  value = '#000000',
  onChange,
  required,
  error,
  className
}: FormColorPickerProps) {
  const [color, setColor] = useState(value)

  // Categorize color based on HSL values
  const categorizeColor = useCallback((hex: string): ColorCategory => {
    try {
      const color = chroma(hex)
      const [h, s, l] = color.hsl()
      
      // Handle achromatic colors first
      if (l >= 0.95) return 'White'
      if (l <= 0.08) return 'Black'
      if (s <= 0.08) {
        if (l >= 0.8) return 'White'  // Off-white
        if (l <= 0.2) return 'Black'  // Near-black
        return 'Grey'
      }

      // Normalize hue to 0-360 range
      const hue = h < 0 ? h + 360 : h

      // Special case for browns:
      // Browns are typically oranges/reds with low saturation and low-medium lightness
      if (
        // Main brown range (oranges and reds)
        ((hue >= 10 && hue < 50) || (hue >= 0 && hue < 10)) &&
        s <= 0.7 && // Not too saturated
        l > 0.1 && l < 0.5 && // Darker shades
        s > l // Saturation should be higher than lightness for browns
      ) {
        return 'Brown'
      }

      // For desaturated colors, lean towards their hue category rather than brown
      if (s <= 0.3) {
        // Use the same hue ranges as below, just with lower saturation threshold
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

      return 'Grey' // Fallback
    } catch {
      return 'Grey' // Fallback for invalid colors
    }
  }, [])

  const handleChange = useCallback((newColor: string) => {
    setColor(newColor)
    onChange?.({
      hex: newColor,
      category: categorizeColor(newColor)
    })
  }, [onChange, categorizeColor])

  // Update local state when value prop changes
  useEffect(() => {
    if (value !== color) {
      setColor(value)
    }
  }, [value])

  return (
    <div className={`space-y-2 ${className || ''}`}>
      <label className="block font-medium text-clay-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="space-y-4">
        <HexColorPicker
          color={color}
          onChange={handleChange}
          className="!w-full"
        />
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-md border border-clay-400"
            style={{ backgroundColor: color }}
          />
          <div className="space-y-1">
            <div className="font-medium">{categorizeColor(color)}</div>
            <div className="text-sm text-clay-600 uppercase">{color}</div>
          </div>
        </div>
      </div>
      {error?.message && (
        <p className="mt-1 text-sm text-red-600">{error.message}</p>
      )}
    </div>
  )
}
