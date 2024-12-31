'use client'

import { useState } from 'react'
import { FieldError, Merge, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { collectionSchema, type CollectionFormData } from '@/lib/schemas/collection'
import { Form } from '@/components/ui/forms/form'
import { FormField } from '@/components/ui/forms/form-field'
import { FormTextarea } from '@/components/ui/forms/form-textarea'
import { FormMultiSelect } from '@/components/ui/forms/form-multi-select'
import { ActionButton } from '@/components/ui/buttons/action-button'
import { CancelButton } from '@/components/ui/buttons/cancel-button'
import { TestTile } from '@prisma/client'

interface CollectionFormProps {
  initialData?: CollectionFormData & { id?: string }
  action: (formData: FormData) => Promise<void>
  submitButtonText?: string
  testTiles: Pick<TestTile, 'id' | 'name'>[]
}

export function CollectionForm({
  initialData,
  action,
  submitButtonText = 'Create collection',
  testTiles
}: CollectionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors }
  } = useForm<CollectionFormData>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      ...initialData,
      testTileIds: initialData?.testTileIds ?? []
    }
  })

  const handleSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true)

      // Get the current form values
      const values = watch()

      // add test tiles to form data
      values.testTileIds?.forEach(testTile => {
        formData.append('testTileIds', testTile)
      })

      console.log('Form data before submission:', Object.fromEntries(formData.entries()))
      await action(formData)
    } catch (error) {
      if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
        return
      }
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <div className="grid grid-cols-12 gap-8">
        <div className="p-8 bg-sand-light rounded-2xl col-span-12 md:col-span-7 space-y-6 ">
        {initialData?.id && (
          <input type="hidden" name="id" value={initialData.id} />
        )}
        <FormField
          label="Name"
          name="name"
          register={register}
          error={errors.name}
          required
        />

        <FormTextarea
          label="Description"
          name="description"
          register={register}
          error={errors.description}
          placeholder="Add a description of this collection..."
        />

        <FormMultiSelect
          name="testTileIds"
          label="Test tiles"
          control={control}
          options={testTiles.map(testTile => ({
            value: testTile.id,
            label: testTile.name
          }))}
          error={errors.testTileIds}
        />

        <div className="mt-6 flex justify-end gap-3">
          <CancelButton
            hasUnsavedChanges={() => {
              const values = watch();
              return (
                !!values.name ||
                !!values.description ||
                (values.testTileIds?.length ?? 0) > 0
              );
            }}
            type="button"
            onCancel={() => window.location.href = '/collections'}
          />
          <ActionButton
            type="submit"
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            {submitButtonText}
          </ActionButton>
        </div>
      </div>
      </div>
    </Form>
  )
}