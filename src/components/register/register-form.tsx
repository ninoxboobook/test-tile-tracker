'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState, useRef } from 'react'
import { registerSchema, type RegisterFormData } from '@/lib/schemas/auth'
import { FormField } from '../ui/forms/form-field'
import { ActionButton } from '../ui/buttons/action-button'
import { Turnstile, type TurnstileRef } from '../ui/forms/turnstile'

export function RegisterForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const turnstileRef = useRef<TurnstileRef>(null)
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError: setFormError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError(null)

      if (!captchaToken) {
        setError('Please complete the captcha verification')
        return
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, captchaToken }),
      })

      const result = await response.json()

      if (!response.ok) {
        if (response.status === 400 && result.errors) {
          // Handle validation errors
          Object.keys(result.errors).forEach((key) => {
            setFormError(key as keyof RegisterFormData, {
              message: result.errors[key][0],
            })
          })
          return
        }
        throw new Error(result.message || 'Registration failed')
      }

      router.push('/login?registered=true')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
      turnstileRef.current?.reset()
      setCaptchaToken(null)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}
      
      <FormField
        label="Username"
        name="username"
        type="text"
        register={register}
        error={errors.username}
        autoComplete="username"
        required
      />

      <FormField
        label="Email"
        name="email"
        type="email"
        register={register}
        error={errors.email}
        autoComplete="email"
        required
      />

      <FormField
        label="Password"
        name="password"
        type="password"
        register={register}
        error={errors.password}
        autoComplete="new-password"
        required
      />

      <FormField
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        register={register}
        error={errors.confirmPassword}
        autoComplete="new-password"
        required
      />

      <div className="flex justify-center">
        <Turnstile
          ref={turnstileRef}
          onSuccess={setCaptchaToken}
          onError={() => {
            setError('Captcha verification failed. Please try again.')
            setCaptchaToken(null)
          }}
          onExpire={() => {
            setCaptchaToken(null)
          }}
        />
      </div>

      <ActionButton
        type="submit"
        isLoading={isSubmitting}
        className="w-full justify-center"
      >
        {isSubmitting ? 'Signing up...' : 'Sign up'}
      </ActionButton>
      <p className="text-center">
        <a href="/login" className="font-medium text-brand hover:text-clay-500">
          Or log in to your account
        </a>
      </p>
    </form>
  )
}
