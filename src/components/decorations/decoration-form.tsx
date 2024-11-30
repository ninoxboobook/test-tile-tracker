'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { decorationSchema, type DecorationFormData } from '@/lib/schemas/decoration'
import { Form } from '@/components/ui/forms/form'
import { FormField } from '@/components/ui/forms/form-field'
import { FormTextarea } from '@/components/ui/forms/form-textarea'
import { FormSelect } from '@/components/ui/forms/form-select'
import { ActionButton } from '@/components/ui/buttons/action-button'

interface DecorationFormProps {
  initialData?: DecorationFormData & { id?: string }
  action: (formData: FormData) => Promise<void>
  submitButtonText?: string
}

export function DecorationForm({
  initialData,
  action,
  submitButtonText = 'Create Decoration'
}: DecorationFormProps) {
  const {
    register,
    formState: { errors, isSubmitting }
  } = useForm<DecorationFormData>({
    resolver: zodResolver(decorationSchema),
    defaultValues: initialData
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
      
      {/* ... other form fields ... */}

      <ActionButton type="submit" isLoading={isSubmitting}>
        {submitButtonText}
      </ActionButton>
    </Form>
  )
} 