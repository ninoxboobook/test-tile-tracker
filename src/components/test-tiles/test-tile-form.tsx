'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { testTileSchema, type TestTileFormData } from '@/lib/schemas/test-tile'
import { Form } from '@/components/ui/forms/form'
import { FormField } from '@/components/ui/forms/form-field'
import { FormTextarea } from '@/components/ui/forms/form-textarea'
import { FormSelect } from '@/components/ui/forms/form-select'
import { FormMultiSelect } from '@/components/ui/forms/form-multi-select'
import { ActionButton } from '@/components/ui/buttons/action-button'
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
  clayBodies,
  decorations,
  collections
}: TestTileFormProps) {
  const {
    register,
    formState: { errors, isSubmitting }
  } = useForm<TestTileFormData>({
    resolver: zodResolver(testTileSchema),
    defaultValues: initialData
  })

  return (
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
        />

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
  )
} 