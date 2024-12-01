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
    values.testTileIds?.forEach(testTile   => {
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