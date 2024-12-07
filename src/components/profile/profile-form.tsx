'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { profileUpdateSchema, type ProfileUpdateFormData } from '@/lib/schemas/user'
import { Form } from '@/components/ui/forms/form'
import { FormField } from '@/components/ui/forms/form-field'
import { FormInput } from '@/components/ui/forms/form-input'
import { ActionButton } from '@/components/ui/buttons/action-button'
import { updateProfile } from '@/app/(dashboard)/profile/actions'
import { toast } from 'sonner'

interface ProfileFormProps {
  initialData?: Partial<ProfileUpdateFormData>
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<ProfileUpdateFormData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: initialData,
  })

  const onSubmit = async (data: ProfileUpdateFormData) => {
    try {
      setIsSubmitting(true)
      const formData = new FormData()
      
      Object.entries(data).forEach(([key, value]) => {
        if (value) {
          formData.append(key, value)
        }
      })

      await updateProfile(formData)
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFormSubmit = async (formData: FormData) => {
    const handler = handleSubmit(onSubmit)
    await handler()
  }

  return (
    <Form onSubmit={handleFormSubmit}>
      <div className="space-y-6">
        <FormField
          label="Email"
          name="email"
          register={register}
          error={errors.email}
        >
          <FormInput
            type="email"
            {...register('email')}
            placeholder="Enter your email"
          />
        </FormField>

        <FormField
          label="Username"
          name="username"
          register={register}
          error={errors.username}
        >
          <FormInput
            {...register('username')}
            placeholder="Enter your username"
          />
        </FormField>

        <FormField
          label="First Name"
          name="firstName"
          register={register}
          error={errors.firstName}
        >
          <FormInput
            {...register('firstName')}
            placeholder="Enter your first name"
          />
        </FormField>

        <FormField
          label="Last Name"
          name="lastName"
          register={register}
          error={errors.lastName}
        >
          <FormInput
            {...register('lastName')}
            placeholder="Enter your last name"
          />
        </FormField>

        <FormField
          label="Profile Picture URL"
          name="imageUrl"
          register={register}
          error={errors.imageUrl}
        >
          <FormInput
            {...register('imageUrl')}
            placeholder="Enter your profile picture URL"
          />
        </FormField>

        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Change Password</h3>
          
          <FormField
            label="Current Password"
            name="currentPassword"
            register={register}
            error={errors.currentPassword}
          >
            <FormInput
              type="password"
              {...register('currentPassword')}
              placeholder="Enter your current password"
            />
          </FormField>

          <FormField
            label="New Password"
            name="newPassword"
            register={register}
            error={errors.newPassword}
          >
            <FormInput
              type="password"
              {...register('newPassword')}
              placeholder="Enter your new password"
            />
          </FormField>
        </div>

        <div className="flex justify-end">
          <ActionButton
            type="submit"
            loading={isSubmitting}
          >
            Save Changes
          </ActionButton>
        </div>
      </div>
    </Form>
  )
}
