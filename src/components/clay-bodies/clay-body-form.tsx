'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { clayBodySchema, type ClayBodyFormData } from '@/lib/schemas/clay-body'
import { ActionButton } from '@/components/ui/buttons/action-button'
import { Form } from '@/components/ui/forms/form'
import { FormField } from '@/components/ui/forms/form-field'
import { FormTextarea } from '@/components/ui/forms/form-textarea'
import { FormSelect } from '@/components/ui/forms/form-select'

interface ClayBodyFormProps {
  initialData?: ClayBodyFormData
  action: (formData: FormData) => Promise<void>
  submitButtonText?: string
}

const CLAY_TYPE_OPTIONS = [
  { value: 'Stoneware', label: 'Stoneware' },
  { value: 'Porcelain', label: 'Porcelain' },
  { value: 'Earthenware', label: 'Earthenware' },
  { value: 'Bone China', label: 'Bone China' },
  { value: 'Other', label: 'Other' },
]

const PLASTICITY_OPTIONS = [
  { value: 'Very Plastic', label: 'Very Plastic' },
  { value: 'Plastic', label: 'Plastic' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Slightly Plastic', label: 'Slightly Plastic' },
  { value: 'Non-Plastic', label: 'Non-Plastic' },
]

const TEXTURE_OPTIONS = [
  { value: 'Smooth', label: 'Smooth' },
  { value: 'Fine Grog', label: 'Fine Grog' },
  { value: 'Medium Grog', label: 'Medium Grog' },
  { value: 'Coarse Grog', label: 'Coarse Grog' },
]

export function ClayBodyForm({
  initialData,
  action,
  submitButtonText = 'Create Clay Body'
}: ClayBodyFormProps) {
  const {
    register,
    formState: { errors, isSubmitting }
  } = useForm<ClayBodyFormData>({
    resolver: zodResolver(clayBodySchema),
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
        options={CLAY_TYPE_OPTIONS}
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
          label="Cone"
          name="cone"
          register={register}
          error={errors.cone}
          required
        />

        <FormField
          label="Firing Temperature (°C)"
          name="firing_temperature"
          register={register}
          error={errors.firing_temperature}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField
          label="Shrinkage (%)"
          name="shrinkage"
          type="number"
          register={register}
          error={errors.shrinkage}
        />

        <FormField
          label="Absorption (%)"
          name="absorption"
          type="number"
          register={register}
          error={errors.absorption}
        />
      </div>

      <FormSelect
        label="Plasticity"
        name="plasticity"
        register={register}
        options={PLASTICITY_OPTIONS}
        error={errors.plasticity}
      />

      <FormSelect
        label="Texture"
        name="texture"
        register={register}
        options={TEXTURE_OPTIONS}
        error={errors.texture}
      />

      <FormField
        label="Manufacturer"
        name="manufacturer"
        register={register}
        error={errors.manufacturer}
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField
          label="Colour (Oxidation)"
          name="colour_oxidation"
          register={register}
          error={errors.colour_oxidation}
        />

        <FormField
          label="Colour (Reduction)"
          name="colour_reduction"
          register={register}
          error={errors.colour_reduction}
        />
      </div>

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
