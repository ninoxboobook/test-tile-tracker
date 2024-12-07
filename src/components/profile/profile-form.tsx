'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { profileUpdateSchema, type ProfileUpdateFormData } from '@/lib/schemas/user'
import { Form } from '@/components/ui/forms/form'
import { FormField } from '@/components/ui/forms/form-field'
import { ActionButton } from '@/components/ui/buttons/action-button'
import { ImageUpload } from '@/components/ui/forms/image-upload'
import { updateProfile } from '@/app/(dashboard)/profile/actions'

interface ProfileFormProps {
  initialData?: Partial<ProfileUpdateFormData>
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl)

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<ProfileUpdateFormData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: initialData,
  })

  const onSubmit = async (data: ProfileUpdateFormData) => {
    try {
      setIsSubmitting(true)
      setMessage(null)
      const formData = new FormData()
      
      Object.entries(data).forEach(([key, value]) => {
        if (value) {
          formData.append(key, value)
        }
      })

      // Add the image URL if it exists
      if (imageUrl) {
        formData.append('imageUrl', imageUrl)
      }

      await updateProfile(formData)
      setMessage({ type: 'success', text: 'Profile updated successfully' })
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to update profile'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFormSubmit = async (formData: FormData) => {
    // Extract form data and convert to object
    const formDataObj = Object.fromEntries(formData.entries())
    // Call react-hook-form's handleSubmit with the form data
    await handleSubmit(onSubmit)(formDataObj as any)
  }

  const handleImageSelected = (url: string) => {
    setImageUrl(url)
    setValue('imageUrl', url)
  }

  return (
    <Form onSubmit={handleFormSubmit}>
      <div className="space-y-6">
        {message && (
          <div
            className={`p-4 mb-4 rounded-md ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="border-b border-gray-900/10 pb-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Profile Picture</h3>
          <div className="mt-4">
            <ImageUpload
              currentImageUrl={imageUrl}
              onImageSelected={handleImageSelected}
            />
          </div>
        </div>

        <FormField
          label="Email"
          name="email"
          type="email"
          register={register}
          error={errors.email}
          placeholder="Enter your email"
        />

        <FormField
          label="Username"
          name="username"
          register={register}
          error={errors.username}
          placeholder="Enter your username"
        />

        <FormField
          label="First Name"
          name="firstName"
          register={register}
          error={errors.firstName}
          placeholder="Enter your first name"
        />

        <FormField
          label="Last Name"
          name="lastName"
          register={register}
          error={errors.lastName}
          placeholder="Enter your last name"
        />

        <div className="border-t pt-6 space-y-6">
          <h3 className="text-lg font-medium mb-4">Change Password</h3>
          
          <FormField
            label="Current Password"
            name="currentPassword"
            type="password"
            register={register}
            error={errors.currentPassword}
            placeholder="Enter your current password"
          />

          <FormField
            label="New Password"
            name="newPassword"
            type="password"
            register={register}
            error={errors.newPassword}
            placeholder="Enter your new password"
          />

          <FormField
            label="Confirm New Password"
            name="confirmNewPassword"
            type="password"
            register={register}
            error={errors.confirmNewPassword}
            placeholder="Confirm your new password"
          />
        </div>

        <div className="flex justify-end">
          <ActionButton
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </ActionButton>
        </div>
      </div>
    </Form>
  )
}
