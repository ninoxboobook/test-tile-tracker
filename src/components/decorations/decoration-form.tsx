'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { decorationSchema, type DecorationFormData, type DecorationWithRelations } from '@/lib/schemas/decoration'
import { Form } from '@/components/ui/forms/form'
import { FormField } from '@/components/ui/forms/form-field'
import { FormTextarea } from '@/components/ui/forms/form-textarea'
import { FormSelect } from '@/components/ui/forms/form-select'
import { FormMultiSelect } from '@/components/ui/forms/form-multi-select'
import { ActionButton } from '@/components/ui/buttons/action-button'
import { DecorationType, Cone, Atmosphere } from '@prisma/client'

interface DecorationFormProps {
  initialData?: DecorationWithRelations
  action: (formData: FormData) => Promise<void>
  submitButtonText?: string
  decorationTypes: DecorationType[]
  cones: Cone[]
  atmospheres: Atmosphere[]
}

export function DecorationForm({
  initialData,
  action,
  submitButtonText = 'Create Decoration',
  decorationTypes,
  cones,
  atmospheres
}: DecorationFormProps) {
  const defaultValues: Partial<DecorationFormData> = initialData
    ? {
        ...initialData,
        coneIds: initialData.cone.map(c => c.id),
        atmosphereIds: initialData.atmosphere.map(a => a.id)
      }
    : {}

  const {
    register,
    control,
    formState: { errors, isSubmitting }
  } = useForm<DecorationFormData>({
    resolver: zodResolver(decorationSchema),
    defaultValues
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
        options={decorationTypes.map(type => ({
          value: type.id,
          label: type.name
        }))}
        error={errors.typeId}
        required
      />

      <FormSelect
        label="Source"
        name="source"
        control={control}
        options={[
          { value: 'Commercial', label: 'Commercial' },
          { value: 'Studio Made/Community', label: 'Studio Made/Community' },
          { value: 'Recipe', label: 'Recipe' },
          { value: 'Other', label: 'Other' }
        ]}
        error={errors.source}
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField
          label="Manufacturer"
          name="manufacturer"
          register={register}
          error={errors.manufacturer}
        />
        <FormMultiSelect
          label="Cone"
          name="coneIds"
          control={control}
          options={cones.map(cone => ({
            value: cone.id,
            label: cone.name
          }))}
          error={errors.coneIds}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField
          label="Colour"
          name="colour"
          register={register}
          error={errors.colour}
        />
        <FormMultiSelect
          label="Atmosphere"
          name="atmosphereIds"
          control={control}
          options={atmospheres.map(atm => ({
            value: atm.id,
            label: atm.name
          }))}
          error={errors.atmosphereIds}
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
          placeholder="https://glazy.org/recipes/2468"
        />
        <FormField
          label="Image URL"
          name="imageUrl"
          register={register}
          error={errors.imageUrl}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <FormTextarea
        label="Recipe"
        name="recipe"
        register={register}
        error={errors.recipe}
        placeholder="Add the recipe for this decoration..."
      />

      <FormTextarea
        label="Notes"
        name="notes"
        register={register}
        error={errors.notes}
        placeholder="Add any additional notes about this decoration..."
      />

      <div className="mt-6 flex justify-end">
        <ActionButton type="submit" disabled={isSubmitting}>
          {submitButtonText}
        </ActionButton>
      </div>
    </Form>
  )
}