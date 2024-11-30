'use client'

import { useState, useEffect } from 'react'
import { VisibilityState } from '@tanstack/react-table'

type ViewType = 'grid' | 'table'
type ViewPreference = {
  view: ViewType
  columnVisibility: VisibilityState
}

export function useViewPreference(key: string): [
  ViewType,
  (view: ViewType) => void,
  VisibilityState,
  (updaterOrValue: VisibilityState | ((prev: VisibilityState) => VisibilityState)) => void
] {
  const [preference, setPreference] = useState<ViewPreference>({
    view: 'grid',
    columnVisibility: {}
  })

  useEffect(() => {
    const stored = localStorage.getItem(`view-preference-${key}`)
    if (stored) {
      setPreference(JSON.parse(stored))
    }
  }, [key])

  const setView = (view: ViewType) => {
    const newPreference = { ...preference, view }
    setPreference(newPreference)
    localStorage.setItem(`view-preference-${key}`, JSON.stringify(newPreference))
  }

  const setColumnVisibility = (
    updaterOrValue: VisibilityState | ((prev: VisibilityState) => VisibilityState)
  ) => {
    const newColumnVisibility = 
      typeof updaterOrValue === 'function' 
        ? updaterOrValue(preference.columnVisibility)
        : updaterOrValue

    const newPreference = { ...preference, columnVisibility: newColumnVisibility }
    setPreference(newPreference)
    localStorage.setItem(`view-preference-${key}`, JSON.stringify(newPreference))
  }

  return [preference.view, setView, preference.columnVisibility, setColumnVisibility]
} 