'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid'
import { DataGridTile } from './data/data-grid-tile'
import { LozengeVariant } from './lozenge'

interface CarouselProps {
  tiles: Array<{
    title: string
    subtitle?: string
    images?: string[]
    lozenges?: Array<{
      label?: string
      lozengeVariant?: LozengeVariant
    }>
    metadata?: Array<{
      label?: string
      value: string
    }>
    description?: string
  }>
  autoPlayInterval?: number
}

export function Carousel({ tiles, autoPlayInterval = 3000 }: CarouselProps) {
  const [isPlaying, setIsPlaying] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Create an array with duplicated items for infinite scrolling
  const items = [...tiles, ...tiles, ...tiles]

  const resetScroll = useCallback(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    const singleSetWidth = (container.scrollWidth / 3)
    
    // If we've scrolled past 2 sets, jump back to 1 set
    if (container.scrollLeft >= singleSetWidth * 2) {
      container.scrollLeft = singleSetWidth
    }
    // If we've scrolled before the first set, jump to the second set
    else if (container.scrollLeft <= 0) {
      container.scrollLeft = singleSetWidth
    }
  }, [])

  const scrollNext = useCallback(() => {
    if (!containerRef.current || !isPlaying || isDragging) return
    const container = containerRef.current
    const tileWidth = container.children[0]?.clientWidth || 0
    const gap = 24 // matches the gap-6 class (6 * 4px)
    
    container.scrollBy({
      left: tileWidth + gap,
      behavior: 'smooth'
    })

    // Wait for the smooth scroll to complete before checking position
    setTimeout(resetScroll, 500)
  }, [isPlaying, isDragging, resetScroll])

  // Initialize scroll position
  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    const singleSetWidth = container.scrollWidth / 3
    container.scrollLeft = singleSetWidth
  }, [])

  // Auto-scroll effect
  useEffect(() => {
    if (!isPlaying || !containerRef.current) return

    const interval = setInterval(scrollNext, autoPlayInterval)
    return () => clearInterval(interval)
  }, [isPlaying, autoPlayInterval, scrollNext])

  // Handle manual scrolling
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      if (!isDragging) {
        resetScroll()
      }
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [isDragging, resetScroll])

  // Handle touch/mouse events
  const handleDragStart = () => {
    setIsDragging(true)
    setIsPlaying(false)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  return (
    <div className="relative">
      {/* Gradient overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-sand to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-sand to-transparent pointer-events-none z-10" />

      {/* Play/Pause button */}
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="absolute top-4 right-4 z-20 rounded-full bg-clay-900/10 p-2 hover:bg-clay-900/20 transition-colors"
        aria-label={isPlaying ? 'Pause carousel' : 'Play carousel'}
      >
        {isPlaying ? (
          <PauseIcon className="h-5 w-5 text-clay-900" />
        ) : (
          <PlayIcon className="h-5 w-5 text-clay-900" />
        )}
      </button>

      {/* Tiles container */}
      <div
        ref={containerRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide touch-pan-x pb-6"
        onMouseDown={handleDragStart}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchEnd={handleDragEnd}
      >
        {items.map((tile, index) => (
          <div key={`${tile.title}-${index}`} className="flex-none w-80 border border-clay-400 overflow-hidden rounded-xl">
            <DataGridTile {...tile} />
          </div>
        ))}
      </div>
    </div>
  )
}
