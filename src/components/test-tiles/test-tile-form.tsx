'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { testTileSchema, type TestTileFormData } from '@/lib/schemas/test-tile'
import { Form } from '@/components/ui/forms/form'
import { FormField } from '@/components/ui/forms/form-field'
import { FormTextarea } from '@/components/ui/forms/form-textarea'
import { FormSelect } from '@/components/ui/forms/form-select'
import { ActionButton } from '@/components/ui/buttons/action-button'

interface TestTileFormProps {
  initialData?: TestTileFormData
  action: (formData: FormData) => Promise<void>
  submitButtonText?: string
  clayBodies: Array<{ id: string; name: string }>
  decorations: Array<{ id: string; name: string }>
  testSeries: Array<{ id: string; name: string }>
}

export function TestTileForm({
  initialData,
  action,
  submitButtonText = 'Create Test Tile',
  clayBodies,
  decorations,
  testSeries
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

      <FormSelect
        label="Clay Body"
        name="clay_body_id"
        register={register}
        error={errors.clay_body_id}
        required
        options={clayBodies.map(body => ({
          value: body.id,
          label: body.name
        }))}
      />

      <FormSelect
        label="Decoration"
        name="decoration_id"
        register={register}
        error={errors.decoration_id}
        options={[
          { value: '', label: 'None' },
          ...decorations.map(decoration => ({
            value: decoration.id,
            label: decoration.name
          }))
        ]}
      />

      <FormSelect
        label="Test Series"
        name="test_series_id"
        register={register}
        error={errors.test_series_id}
        options={[
          { value: '', label: 'None' },
          ...testSeries.map(series => ({
            value: series.id,
            label: series.name
          }))
        ]}
      />

      <ActionButton type="submit" isLoading={isSubmitting}>
        {submitButtonText}
      </ActionButton>
    </Form>
  )
} 