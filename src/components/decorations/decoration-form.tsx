'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { decorationSchema, type DecorationFormData, DECORATION_TYPES, ATMOSPHERE_TYPES } from '@/lib/schemas/decoration'
import { Form } from '@/components/ui/forms/form'
import { FormField } from '@/components/ui/forms/form-field'
import { FormTextarea } from '@/components/ui/forms/form-textarea'
import { FormSelect } from '@/components/ui/forms/form-select'
import { ActionButton } from '@/components/ui/buttons/action-button'

const typeOptions = DECORATION_TYPES.map(type => ({
  value: type,
  label: type
}))

const atmosphereOptions = ATMOSPHERE_TYPES.map(type => ({
  value: type,
  label: type.charAt(0).toUpperCase() + type.slice(1)
}))

interface DecorationFormProps {
  initialData?: DecorationFormData
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
      <FormField
        label="Name"
        name="name"
        register={register}
        error={errors.name}
        required
      />

      <FormSelect
        label="Type"
        name="type"
        register={register}
        options={typeOptions}
        error={errors.type}
        required
      />

      <FormTextarea
        label="Description"
        name="description"
        register={register}
        error={errors.description}
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField
          label="Color"
          name="color"
          register={register}
          error={errors.color}
        />

        <FormField
          label="Color Reaction"
          name="color_reaction"
          register={register}
          error={errors.color_reaction}
        />
      </div>

      <FormSelect
        label="Atmosphere"
        name="atmosphere"
        register={register}
        options={atmosphereOptions}
        error={errors.firing_atmosphere}
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField
          label="Surface"
          name="surface"
          register={register}
          error={errors.surface}
        />

        <FormField
          label="Transparency"
          name="transparency"
          register={register}
          error={errors.transparency}
        />
      </div>

      <ActionButton type="submit" isLoading={isSubmitting}>
        {submitButtonText}
      </ActionButton>
    </Form>
  )
} 