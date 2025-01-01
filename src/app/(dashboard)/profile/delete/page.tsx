'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageLayout } from '@/components/ui/layout/page-layout'
import { FormField } from '@/components/ui/forms/form-field'
import { ActionButton } from '@/components/ui/buttons/action-button'
import { deleteAccount } from '../actions'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { signOut } from 'next-auth/react'

const deleteConfirmSchema = z.object({
  confirmText: z.string().refine((val) => val === 'DELETE', {
    message: 'Please type DELETE to confirm',
  }),
})

type DeleteConfirmFormData = z.infer<typeof deleteConfirmSchema>

export default function DeleteAccountPage() {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeleteConfirmFormData>({
    resolver: zodResolver(deleteConfirmSchema),
  })

  const handleDelete = async (data: DeleteConfirmFormData) => {
    try {
      setIsDeleting(true)
      await deleteAccount()
      await signOut({ redirect: false })
      router.push('/account-deleted')
    } catch (error) {
      setIsDeleting(false)
      console.error('Failed to delete account:', error)
    }
  }

  return (
    <PageLayout
      title="Delete account"
      description="We're sorry to see you go"
    >
      <div className="space-y-6 max-w-2xl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          <h3 className="font-semibold mb-2">Warning: This action cannot be undone</h3>
          <p>Deleting your account will permanently remove:</p>
          <ul className="list-disc list-inside mt-2">
            <li>All your test tiles</li>
            <li>All your collections</li>
            <li>All your clay bodies</li>
            <li>All your decorations</li>
            <li>Your profile and account information</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit(handleDelete)} className="space-y-6">
          <FormField
            label="Type DELETE to confirm deletion"
            name="confirmText"
            type="text"
            register={register}
            error={errors.confirmText}
            placeholder="Type DELETE"
          />

          <div className="flex gap-4">
            <ActionButton
              onClick={() => router.push('/profile')}
              variant="secondary"
              type="button"
            >
              Cancel
            </ActionButton>
            <ActionButton
              type="submit"
              variant="danger"
              disabled={isDeleting}
              isLoading={isDeleting}
            >
              Delete account
            </ActionButton>
          </div>
        </form>
      </div>
    </PageLayout>
  )
}
