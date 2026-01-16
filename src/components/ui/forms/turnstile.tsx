'use client'

import { Turnstile as TurnstileWidget, type TurnstileInstance } from '@marsidev/react-turnstile'
import { forwardRef, useImperativeHandle, useRef } from 'react'

interface TurnstileProps {
  onSuccess: (token: string) => void
  onError?: () => void
  onExpire?: () => void
}

export interface TurnstileRef {
  reset: () => void
}

export const Turnstile = forwardRef<TurnstileRef, TurnstileProps>(
  function Turnstile({ onSuccess, onError, onExpire }, ref) {
    const turnstileRef = useRef<TurnstileInstance>(null)

    useImperativeHandle(ref, () => ({
      reset: () => {
        turnstileRef.current?.reset()
      },
    }))

    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

    if (!siteKey) {
      console.error('NEXT_PUBLIC_TURNSTILE_SITE_KEY is not configured')
      return null
    }

    return (
      <TurnstileWidget
        ref={turnstileRef}
        siteKey={siteKey}
        onSuccess={onSuccess}
        onError={onError}
        onExpire={onExpire}
        options={{
          theme: 'light',
        }}
      />
    )
  }
)
