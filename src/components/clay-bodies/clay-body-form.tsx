'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { clayBodySchema, type ClayBodyFormData } from '@/lib/schemas/clay-body'
import { Form } from '@/components/ui/forms/form'
import { FormField } from '@/components/ui/forms/form-field'
import { FormTextarea } from '@/components/ui/forms/form-textarea'
import { FormSelect } from '@/components/ui/forms/form-select'
import { FormMultiSelect } from '@/components/ui/forms/form-multi-select'
import { ActionButton } from '@/components/ui/buttons/action-button'
import { ClayBodyType, Cone } from '@prisma/client'

interface ClayBodyFormProps {
  initialData?: ClayBodyFormData & { id?: string }
  action: (formData: FormData) => Promise<void>
  submitButtonText?: string
  clayBodyTypes: ClayBodyType[]
  cones: Cone[]
}

export function ClayBodyForm({
  initialData,
  action,
  submitButtonText = 'Create Clay Body',
  clayBodyTypes,
  cones
}: ClayBodyFormProps) {
  const {
    register,
    control,
    formState: { errors, isSubmitting }
  } = useForm<ClayBodyFormData>({
    resolver: zodResolver(clayBodySchema),
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
        label="Type"
        name="typeId"
        control={control}
        options={clayBodyTypes.map(type => ({
          value: type.id,
          label: type.name
        }))}
        error={errors.typeId}
        required
      />

      <FormField
        label="Manufacturer"
        name="manufacturer"
        register={register}
        error={errors.manufacturer}
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormMultiSelect
          label="Cone"
          name="cone"
          control={control}
          options={cones.map(cone => ({
            value: cone.name,
            label: cone.name
          }))}
          error={errors.cone}
        />

        <FormField
          label="Firing Temperature"
          name="firingTemperature"
          register={register}
          error={errors.firingTemperature}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormSelect
          label="Texture"
          name="texture"
          control={control}
          options={[
            { value: 'Smooth', label: 'Smooth' },
            { value: 'Fine Grog', label: 'Fine Grog' },
            { value: 'Medium Grog', label: 'Medium Grog' },
            { value: 'Coarse Grog', label: 'Coarse Grog' }
          ]}
          error={errors.texture}
        />

        <FormSelect
          label="Plasticity"
          name="plasticity"
          control={control}
          options={[
            { value: 'Very Plastic', label: 'Very Plastic' },
            { value: 'Plastic', label: 'Plastic' },
            { value: 'Medium', label: 'Medium' },
            { value: 'Slightly Plastic', label: 'Slightly Plastic' },
            { value: 'Non-Plastic', label: 'Non-Plastic' }
          ]}
          error={errors.plasticity}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField
          label="Colour (Oxidation)"
          name="colourOxidation"
          register={register}
          error={errors.colourOxidation}
        />

        <FormField
          label="Colour (Reduction)"
          name="colourReduction"
          register={register}
          error={errors.colourReduction}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField
          label="Shrinkage (%)"
          name="shrinkage"
          type="number"
          step="0.1"
          register={register}
          error={errors.shrinkage}
        />

        <FormField
          label="Absorption (%)"
          name="absorption"
          type="number"
          step="0.1"
          register={register}
          error={errors.absorption}
        />

        <FormField
          label="Mesh Size"
          name="meshSize"
        type="number"
          register={register}
          error={errors.meshSize}
        />
      </div>

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
        placeholder="Add any additional notes about this clay body..."
      />

      <div className="mt-6 flex justify-end">
        <ActionButton
          type="submit"
          disabled={isSubmitting}
        >
          {submitButtonText}
        </ActionButton>
      </div>
    </Form>
  )
}
