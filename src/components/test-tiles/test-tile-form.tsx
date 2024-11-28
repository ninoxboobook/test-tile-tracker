'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { FieldError } from 'react-hook-form'

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
  const [isClayBodyModalOpen, setIsClayBodyModalOpen] = useState(false)
  const [isDecorationModalOpen, setIsDecorationModalOpen] = useState(false)
  const [clayBodies, setClayBodies] = useState(initialClayBodies)
  const [decorations, setDecorations] = useState(initialDecorations)
  const {
    register,
    setValue,
    watch,
    formState: { errors, isSubmitting }
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
      <Form onSubmit={action}>
        <div className="space-y-6">
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
              label="Clay Body"
              name="clayBodyId"
              register={register}
              error={errors.clayBodyId}
              required
              options={clayBodies.map(body => ({
                value: body.id,
                label: body.name
              }))}
              value={selectedClayBodyId}
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
              label="Decorations"
              name="decorationIds"
              register={register}
              error={errors.decorationIds as FieldError}
              options={decorations.map(decoration => ({
                value: decoration.id,
                label: decoration.name
              }))}
            />
            <div className="flex justify-end">
              <ActionButton
                type="button"
                variant="secondary"
                onClick={() => setIsDecorationModalOpen(true)}
              >
                Add New Decoration
              </ActionButton>
            </div>
          </div>

          <FormMultiSelect
            label="Collections"
            name="collectionIds"
            register={register}
            error={errors.collectionIds as FieldError}
            options={collections.map(collection => ({
              value: collection.id,
              label: collection.name
            }))}
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