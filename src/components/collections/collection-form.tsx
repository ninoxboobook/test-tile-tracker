'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { collectionSchema, type CollectionFormData } from '@/lib/schemas/collection'
import { Form } from '@/components/ui/forms/form'
import { FormField } from '@/components/ui/forms/form-field'
import { FormTextarea } from '@/components/ui/forms/form-textarea'
import { FormSelect } from '@/components/ui/forms/form-select'
import { ActionButton } from '@/components/ui/buttons/action-button'
import { enum_TestSeries_status } from '@prisma/client'

const STATUS_OPTIONS = Object.values(enum_TestSeries_status).map(status => ({
  value: status,
  label: status.charAt(0).toUpperCase() + status.slice(1)
}))

interface CollectionFormProps {
  initialData?: CollectionFormData
  action: (formData: FormData) => Promise<void>
  submitButtonText?: string
}

export function TestSeriesForm({
  initialData,
  action,
  submitButtonText = 'Create Test Series'
}: CollectionFormProps) {
  const {
    register,
    formState: { errors, isSubmitting }
  } = useForm<CollectionFormData>({
    resolver: zodResolver(collectionSchema),
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

      <FormTextarea
        label="Goal"
        name="goal"
        register={register}
        error={errors.goal}
      />

      <FormTextarea
        label="Variables"
        name="variables"
        register={register}
        error={errors.variables}
        placeholder="Enter variables in JSON format..."
      />

      <FormSelect
        label="Status"
        name="status"
        register={register}
        options={STATUS_OPTIONS}
        error={errors.status}
        required
      />

      <FormTextarea
        label="Conclusions"
        name="conclusions"
        register={register}
        error={errors.conclusions}
      />

      <ActionButton type="submit" isLoading={isSubmitting}>
        {submitButtonText}
      </ActionButton>
    </Form>
  )
} 