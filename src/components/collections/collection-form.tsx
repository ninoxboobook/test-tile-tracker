'use client'

import { FieldError, Merge, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { collectionSchema, type CollectionFormData } from '@/lib/schemas/collection'
import { Form } from '@/components/ui/forms/form'
import { FormField } from '@/components/ui/forms/form-field'
import { FormTextarea } from '@/components/ui/forms/form-textarea'
import { FormMultiSelect } from '@/components/ui/forms/form-multi-select'
import { ActionButton } from '@/components/ui/buttons/action-button'
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
  submitButtonText = 'Create Collection',
  testTiles
}: CollectionFormProps) {
  const {
    register,
    control,
    formState: { errors, isSubmitting }
  } = useForm<CollectionFormData>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      ...initialData,
      testTileIds: initialData?.testTileIds ?? []
    }
  })

  return (
    <Form onSubmit={action}>
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
      />

      <FormMultiSelect
        name="testTileIds"
        label="Test Tiles"
        control={control}
        options={testTiles.map(testTile => ({
          value: testTile.id,
          label: testTile.name
        }))}
        error={errors.testTileIds}
      />

      <ActionButton type="submit" isLoading={isSubmitting}>
        {submitButtonText}
      </ActionButton>
    </Form>
  )
} 