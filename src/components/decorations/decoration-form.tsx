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
    control,
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

      <FormSelect
        label="Category"
        name="category"
        control={control}
        options={[
          { value: 'Glaze', label: 'Glaze' },
          { value: 'Underglaze', label: 'Underglaze' },
          { value: 'Oxide', label: 'Oxide' },
          { value: 'Slip', label: 'Slip' },
          { value: 'Engobe', label: 'Engobe' },
          { value: 'Other', label: 'Other' }
        ]}
        error={errors.category}
        required
      />
      <FormSelect
        label="Type"
        name="type"
        control={control}
        options={[
          { value: 'Commercial', label: 'Commercial' },
          { value: 'Studio Made', label: 'Studio Made' },
          { value: 'Test', label: 'Test' },
          { value: 'Other', label: 'Other' }
        ]}
        error={errors.type}
        required
      />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField
          label="Manufacturer"
          name="manufacturer"
          register={register}
          error={errors.manufacturer}
        />
        <FormField
          label="Cone"
          name="cone"
          register={register}
          error={errors.cone}
        />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField
          label="Colour"
          name="colour"
          register={register}
          error={errors.colour}
        />
        <FormSelect
          label="Atmosphere"
          name="atmosphere"
          control={control}
          options={[
            { value: 'Oxidation', label: 'Oxidation' },
            { value: 'Reduction', label: 'Reduction' },
            { value: 'Neutral', label: 'Neutral' },
            { value: 'Raku', label: 'Raku' }
          ]}
          error={errors.atmosphere}
        />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormSelect
          label="Surface"
          name="surface"
          control={control}
          options={[
            { value: 'Matte', label: 'Matte' },
            { value: 'Satin', label: 'Satin' },
            { value: 'Glossy', label: 'Glossy' },
            { value: 'Breaking', label: 'Breaking' },
            { value: 'Crystalline', label: 'Crystalline' }
          ]}
          error={errors.surface}
        />
        <FormSelect
          label="Transparency"
          name="transparency"
          control={control}
          options={[
            { value: 'Opaque', label: 'Opaque' },
            { value: 'Semi-opaque', label: 'Semi-opaque' },
            { value: 'Semi-transparent', label: 'Semi-transparent' },
            { value: 'Transparent', label: 'Transparent' }
          ]}
          error={errors.transparency}
        />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField
          label="Glazy URL"
          name="glazyUrl"
          register={register}
          error={errors.glazyUrl}
        />
        <FormField
          label="Image URL"
          name="imageUrl"
          register={register}
          error={errors.imageUrl}
        />
      </div>
      <FormTextarea
        label="Recipe"
        name="recipe"
        register={register}
        error={errors.recipe}
      />
      <FormTextarea
        label="Notes"
        name="notes"
        register={register}
        error={errors.notes}
      />

      <ActionButton type="submit" isLoading={isSubmitting}>
        {submitButtonText}
      </ActionButton>
    </Form>
  )
} 