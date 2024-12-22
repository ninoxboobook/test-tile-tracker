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
      // More saturated colors can be grey if they're more muted
      const saturationThreshold = l > 0.5 ? 0.15 : 0.25  // Allow higher saturation for darker colors
      if (s <= saturationThreshold) {
        if (l >= 0.95) return 'White'  // Only very light greys are white
        if (l <= 0.2) return 'Black'  // Near-black
        return 'Grey'
      }

      // Special case for browns:
      // Browns are typically oranges/reds with low-medium saturation and low-medium lightness
      if (
        // Main brown range (warm colors)
        // Narrowed from orange-brown range, excluding pure reds
        (hue >= 10 && hue < 40) &&
        (
          // Darker browns: medium saturation
          (l < 0.4 && s > 0.2 && s <= 0.5) ||
          // Medium browns: low-medium saturation
          (l >= 0.4 && l < 0.55 && s > 0.15 && s <= 0.45) ||
          // Lighter browns: must be less saturated
          (l >= 0.55 && l < 0.65 && s > 0.1 && s <= 0.35)
        )
      ) {
        return 'Brown'
      }

      // For desaturated colors (but not as desaturated as greys)
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
