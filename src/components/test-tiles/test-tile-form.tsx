'use client'

import { useState } from 'react'
import { useForm, FieldError, Merge } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { testTileSchema, type TestTileFormData } from '@/lib/schemas/test-tile'
import { Form } from '@/components/ui/forms/form'
import { FormField } from '@/components/ui/forms/form-field'
import { FormTextarea } from '@/components/ui/forms/form-textarea'
import { FormSelect } from '@/components/ui/forms/form-select'
import { FormMultiSelect } from '@/components/ui/forms/form-multi-select'
import { ActionButton } from '@/components/ui/buttons/action-button'
import { Modal } from '@/components/ui/modal'
import { ClayBodyForm } from '@/components/clay-bodies/clay-body-form'
import { DecorationForm } from '@/components/decorations/decoration-form'

interface TestTileFormProps {
  initialData?: TestTileFormData
  action: (formData: FormData) => Promise<void>
  submitButtonText?: string
  clayBodies: Array<{ id: string; name: string }>
  decorations: Array<{ id: string; name: string }>
  collections: Array<{ id: string; name: string }>
}

export function TestTileForm({
  initialData,
  action,
  submitButtonText = 'Create Test Tile',
  clayBodies: initialClayBodies,
  decorations: initialDecorations,
  collections
}: TestTileFormProps) {
  const router = useRouter()
  const [isClayBodyModalOpen, setIsClayBodyModalOpen] = useState(false)
  const [isDecorationModalOpen, setIsDecorationModalOpen] = useState(false)
  const [clayBodies, setClayBodies] = useState(initialClayBodies)
  const [decorations, setDecorations] = useState(initialDecorations)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    register,
    setValue,
    watch,
    control,
    formState: { errors }
  } = useForm<TestTileFormData>({
    resolver: zodResolver(testTileSchema),
    defaultValues: initialData
  })

  // Watch the clayBodyId to make the select controlled
  const selectedClayBodyId = watch('clayBodyId')

  const handleClayBodySubmit = async (formData: FormData) => {
    const response = await fetch('/api/clay-bodies', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error('Failed to create clay body')
    }

    const clayBody = await response.json()
    // Update the clay bodies list with the new clay body
    setClayBodies(prevBodies => [...prevBodies, { id: clayBody.id, name: clayBody.name }])
    // Set the selected value to the new clay body
    setValue('clayBodyId', clayBody.id, { shouldValidate: true })
    setIsClayBodyModalOpen(false)
  }

  const handleDecorationSubmit = async (formData: FormData) => {
    const response = await fetch('/api/decorations', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error('Failed to create decoration')
    }

    const decoration = await response.json()
    // Update the decorations list with the new decoration
    setDecorations(prevDecorations => [...prevDecorations, { id: decoration.id, name: decoration.name }])
    // Get current selected decorations and add the new one
    const currentDecorations = watch('decorationIds') || []
    setValue('decorationIds', [...currentDecorations, decoration.id], { shouldValidate: true })
    setIsDecorationModalOpen(false)
  }

  return (
    <>
      <Form onSubmit={async (formData) => {
        try {
          setIsSubmitting(true)
          await action(formData)
        } catch (error) {
          // If it's a redirect error, we don't need to handle it
          if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
            return
          }
          console.error('Form submission error:', error)
        } finally {
          setIsSubmitting(false)
        }
      }}>
        <div className="space-y-6">
          {initialData?.id && (
            <input 
              type="hidden" 
              name="id" 
              value={initialData.id} 
            />
          )}
          <FormField
            label="Name"
            name="name"
            register={register}
            error={errors.name}
            required
          />

          <FormField
            label="Stamp"
            name="stamp"
            register={register}
            error={errors.stamp}
          />

          <div className="space-y-2">
            <FormSelect
              name="clayBodyId"
              label="Clay Body"
              control={control}
              options={clayBodies.map(body => ({ value: body.id, label: body.name }))}
              error={errors.clayBodyId}
              required
            />
            <div className="flex justify-end">
              <ActionButton
                type="button"
                variant="secondary"
                onClick={() => setIsClayBodyModalOpen(true)}
              >
                Add New Clay Body
              </ActionButton>
            </div>
          </div>

          <div className="space-y-2">
            <FormMultiSelect
              name="decorationIds"
              label="Decorations"
              control={control}
              options={decorations.map(decoration => ({
                value: decoration.id,
                label: decoration.name
              }))}
              error={errors.decorationIds as FieldError | Merge<FieldError, (FieldError | undefined)[]>}
            />
            <div className="flex justify-end">
              <ActionButton
                type="button"
                onClick={() => setIsDecorationModalOpen(true)}
              >
                Add Decoration
              </ActionButton>
            </div>
          </div>

          <FormMultiSelect
            name="collectionIds"
            label="Collections"
            control={control}
            options={collections.map(collection => ({
              value: collection.id,
              label: collection.name
            }))}
            error={errors.collectionIds as FieldError | Merge<FieldError, (FieldError | undefined)[]>}
          />

          <FormField
            label="Image URL"
            name="imageUrl"
            register={register}
            error={errors.imageUrl}
            placeholder="https://example.com/image.jpg"
          />

          <FormTextarea
            label="Notes"
            name="notes"
            register={register}
            error={errors.notes}
            placeholder="Add any notes about this test tile..."
          />

          <ActionButton type="submit" isLoading={isSubmitting}>
            {submitButtonText}
          </ActionButton>
        </div>
      </Form>

      <Modal
        isOpen={isClayBodyModalOpen}
        onClose={() => setIsClayBodyModalOpen(false)}
        title="Add New Clay Body"
      >
        <ClayBodyForm
          action={handleClayBodySubmit}
          submitButtonText="Create Clay Body"
        />
      </Modal>

      <Modal
        isOpen={isDecorationModalOpen}
        onClose={() => setIsDecorationModalOpen(false)}
        title="Add New Decoration"
      >
        <DecorationForm
          action={handleDecorationSubmit}
          submitButtonText="Create Decoration"
        />
      </Modal>
    </>
  )
}