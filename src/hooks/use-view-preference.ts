'use client'

import { useState, useEffect } from 'react'

export function useViewPreference(page: string) {
  const [view, setView] = useState<'grid' | 'table'>('table')

  useEffect(() => {
    const stored = localStorage.getItem(`${page}-view`)
    if (stored === 'grid' || stored === 'table') {
      setView(stored)
    }
  }, [page])

  const setViewPreference = (newView: 'grid' | 'table') => {
    setView(newView)
    localStorage.setItem(`${page}-view`, newView)
  }

  return [view, setViewPreference] as const
} 