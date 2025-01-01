'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ActionButton } from '../ui/buttons/action-button'
import { FormField } from '../ui/forms/form-field'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isResettingPassword, setIsResettingPassword] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null) // Clear any previous errors

      const result = await signIn('credentials', {
        redirect: false,
        email: data.email.toLowerCase(), // Normalize email
        password: data.password,
      })

      if (!result) {
        setError('An unexpected error occurred')
        return
      }

      if (result.error) {
        setError('Invalid email or password')
        return
      }

      if (result.ok) {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('An error occurred. Please try again.')
    }
  }

  const handleForgotPassword = async () => {
    const email = watch('email')
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email address')
      return
    }

    setIsResettingPassword(true)
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setError(null)
        // Show success message in the error div with a different style
        setError('If an account exists with this email, you will receive password reset instructions shortly.')
      } else {
        setError('Failed to send reset email. Please try again.')
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setIsResettingPassword(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormField
        label="Email"
        name="email"
        type="email"
        register={register}
        error={errors.email}
        autoComplete="email"
        required
      />

      <div>
        <FormField
          label="Password"
          name="password"
          type="password"
          register={register}
          error={errors.password}
          autoComplete="current-password"
          required
        />
        <button
          type="button"
          onClick={handleForgotPassword}
          disabled={isResettingPassword}
          className="text-sm text-brand hover:text-clay-500 font-medium"
        >
          {isResettingPassword ? 'Sending reset email...' : 'Forgot your password?'}
        </button>
      </div>

      {error && (
        <div className={`rounded-md p-4 ${error.includes('receive password reset instructions') ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="flex">
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${error.includes('receive password reset instructions') ? 'text-green-800' : 'text-red-800'}`}>
                {error}
              </h3>
            </div>
          </div>
        </div>
      )}

      <ActionButton
        type="submit"
        isLoading={isSubmitting}
        className="w-full justify-center"
      >
        {isSubmitting ? 'Signing in...' : 'Sign in'}
      </ActionButton>

      <div className="text-center">
        <a href="/register" className="font-medium text-brand hover:text-clay-500">
          Or create a new account
        </a>
      </div>
    </form>
  )
}
