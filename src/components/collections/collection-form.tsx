'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { collectionSchema, type CollectionFormData } from '@/lib/schemas/collection'
import { Form } from '@/components/ui/forms/form'
import { FormField } from '@/components/ui/forms/form-field'
import { FormTextarea } from '@/components/ui/forms/form-textarea'
import { FormSelect } from '@/components/ui/forms/form-select'
import { ActionButton } from '@/components/ui/buttons/action-button'

interface CollectionFormProps {
  initialData?: CollectionFormData
  action: (formData: FormData) => Promise<void>
  submitButtonText?: string
}

export function CollectionForm({
  initialData,
  action,
  submitButtonText = 'Create Collection'
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

      <ActionButton type="submit" isLoading={isSubmitting}>
        {submitButtonText}
      </ActionButton>
    </Form>
  )
} 