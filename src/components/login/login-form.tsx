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

  const {
    register,
    handleSubmit,
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

      <FormField
        label="Password"
        name="password"
        type="password"
        register={register}
        error={errors.password}
        autoComplete="current-password"
        required
      />

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
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
      <p className="text-center">
        <a href="/register" className="font-medium text-brand hover:text-clay-500">
          Or create a new account
        </a>
      </p>

    </form>
  )
}
