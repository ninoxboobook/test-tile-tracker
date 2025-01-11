'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { profileUpdateSchema, type ProfileUpdateFormData } from '@/lib/schemas/user'
import { Form } from '@/components/ui/forms/form'
import { FormField } from '@/components/ui/forms/form-field'
import { ActionButton } from '@/components/ui/buttons/action-button'
import { CancelButton } from '@/components/ui/buttons/cancel-button'
import { updateProfile } from '@/app/(dashboard)/profile/actions'
import { ProfileImage } from '@/components/profile/profile-image'
import Link from 'next/link'
import { Switch } from '@headlessui/react'

interface ProfileFormProps {
  initialData?: Partial<ProfileUpdateFormData>
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl)

  const {
    register,
    formState: { errors, dirtyFields },
    handleSubmit,
    setValue,
    watch,
  } = useForm<ProfileUpdateFormData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: initialData,
  })

  const isPublic = watch('isPublic')

  const onSubmit = async (data: ProfileUpdateFormData) => {
    try {
      setIsSubmitting(true)
      setMessage(null)
      const formData = new FormData()

      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value.toString())
        }
      })

      // Add the image URL if it exists
      if (imageUrl) {
        formData.append('imageUrl', imageUrl)
      }

      console.log('Form data values:', Object.fromEntries(formData.entries()))

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
      <div className="grid grid-cols-12 gap-8">
        {message && (
          <div className="col-span-12">
            <div
              className={`p-4 rounded-md ${message.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
                }`}
            >
              {message.text}
            </div>
          </div>
        )}

        <div className="col-span-12 md:col-span-4">
          <div className="bg-sand-light rounded-2xl p-8 space-y-6 flex flex-col items-center">
            <ProfileImage
              currentImageUrl={imageUrl}
              onImageSelected={handleImageSelected}
              initials={initialData?.username?.[0]?.toUpperCase() || 'U'}
            />
            <div className="text-center">
              {initialData?.firstName && initialData?.lastName ? (
                <>
                  <h2 className="text-2xl font-semibold text-clay-800">
                    {initialData?.firstName} {initialData?.lastName}
                  </h2>
                  <p className="text-clay-500">@{initialData?.username}
                  </p>
                </>
              ) : (
                <h2 className="text-2xl font-semibold text-clay-800">
                  {initialData?.username}
                </h2>
              )}
            </div>
          </div>
        </div>
        <div className="col-span-12 md:col-span-8 bg-sand-light rounded-2xl p-8">
          <div className="space-y-6 pb-12">
            <h3 className="text-xl font-semibold mb-4 text-clay-800">Your details</h3>

            <FormField
              label="Username"
              name="username"
              register={register}
              error={errors.username}
              placeholder="Enter your username"
            />
            <div className="grid grid-cols-2 gap-4">
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
            </div>

            <FormField
              label="Email"
              name="email"
              type="email"
              register={register}
              error={errors.email}
              placeholder="Enter your email"
            />
          </div>

          <div className="border-t pt-10 space-y-6 pb-12">
            <h3 className="text-xl font-semibold  mb-4 text-clay-800">Privacy and visibility</h3>
            <div className="flex items-center justify-between p-4 border border-solid border-clay-300 rounded-md">
              <div>
                <h4 className="font-medium text-clay-800">Make profile public</h4>
                <p className="text-sm text-clay-700 mb-[2px]">Your profile will be visible to other users</p>
              </div>
              <Switch
                checked={isPublic ?? false}
                onChange={(checked) => setValue('isPublic', checked)}
                className={`${isPublic ? 'bg-brand' : 'bg-clay-400'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-clay-600 focus:ring-offset-2`}
              >
                <span className="sr-only">Enable public profile</span>
                <span
                  className={`${isPublic ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </Switch>
            </div>
          </div>

          <div className="border-t pt-10 space-y-6 pb-12">
            <h3 className="text-xl font-semibold  mb-4 text-clay-800">Change password</h3>

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

          <div className="border-t pt-10">
            <h3 className="text-xl font-semibold text-clay-800 mb-1">Delete account</h3>
            <p className="text-clay-700 mb-6">Account deletion is permanent and cannot be undone. Please be certain before proceeding - all of your data will be lost.</p>
            <div>
              <Link href="/profile/delete">
                <ActionButton variant="danger" type="button">
                  Delete account
                </ActionButton>
              </Link>
            </div>
          </div>
        </div>
        <div className="col-span-12">
          <div className="flex justify-end space-x-3">
            <CancelButton
              hasUnsavedChanges={() => Object.keys(dirtyFields).length > 0}
              type="button"
              onCancel={() => window.location.href = '/dashboard'}
            />
            <ActionButton
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </ActionButton>
          </div>
        </div>
      </div>
    </Form>
  )
}
