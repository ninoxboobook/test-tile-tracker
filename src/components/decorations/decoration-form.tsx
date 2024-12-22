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
import { CancelButton } from '@/components/ui/buttons/cancel-button'
import { DecorationType, Cone, Atmosphere } from '@prisma/client'
import { useState, useMemo } from 'react'
import { ImageDropzone } from '@/components/ui/forms/image-dropzone'
import { sortCones } from '@/lib/utils/sort-cones'

interface DecorationFormProps {
  initialData?: DecorationWithRelations
  action: (formData: FormData) => Promise<void>
  submitButtonText?: string
  decorationTypes: DecorationType[]
  cones: Array<Cone>
  atmospheres: Array<Atmosphere>
}

export function DecorationForm({
  initialData,
  action,
  submitButtonText = 'Create Decoration',
  decorationTypes,
  cones,
  atmospheres
}: DecorationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string>('')
  const defaultValues: Partial<DecorationFormData> = initialData
    ? {
      ...initialData,
      coneIds: initialData.cone.map(c => c.id),
      atmosphereIds: initialData.atmosphere.map(a => a.id)
    }
    : {}

  const sortedCones = useMemo(() => sortCones(cones), [cones])

  const {
    register,
    control,
    watch,
    formState: { errors },
    setValue
  } = useForm<DecorationFormData>({
    resolver: zodResolver(decorationSchema),
    defaultValues
  })

  const handleSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true)

      // Get the current form values
      const values = watch()

      // Ensure the ID is included in the form data for updates
      if (initialData?.id) {
        formData.set('id', initialData.id)
      }

      // Convert form data to a regular object while preserving arrays
      const formDataObj = Array.from(formData.entries()).reduce((acc, [key, value]) => {
        if (key === 'coneIds' || key === 'atmosphereIds') {
          if (!acc[key]) {
            acc[key] = formData.getAll(key);
          }
        } else {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);

      // Now add the cone values from the form state
      if (values.coneIds?.length) {
        formDataObj.coneIds = values.coneIds;
      }

      // Add atmosphere values from form state
      if (values.atmosphereIds?.length) {
        formDataObj.atmosphereIds = values.atmosphereIds;
      }

      // Add imageUrl values from form state
      if (values.imageUrl?.length) {
        formDataObj.imageUrl = values.imageUrl;
      }

      // Convert back to FormData
      const newFormData = new FormData();
      Object.entries(formDataObj).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(v => newFormData.append(key, v));
        } else if (value !== null && value !== undefined) {
          newFormData.append(key, value);
        }
      });

      setError('')
      await action(newFormData)
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message)
      } else {
        setError('An unexpected error occurred')
      }
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-7 bg-sand-light p-8 space-y-6 rounded-2xl">
          <h2 className="mb-10 text-2xl font-semibold text-clay-800">Decoration details</h2>
          {error && (
            <div className="mb-4 rounded-md border border-red-500 bg-red-50 p-4 text-sm text-red-500">
              {error}
            </div>
          )}
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
              { value: 'Studio', label: 'Studio' },
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
              options={sortedCones.map(cone => ({
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

          
        </div>
        <div className="col-span-5 bg-sand-light p-8 rounded-2xl">
          <div>
          <h3 className="mb-10 text-2xl font-semibold text-clay-800">Decoration images</h3>
            <ImageDropzone
              currentImageUrl={initialData?.imageUrl}
              onImagesSelected={(urls) => {
                setValue('imageUrl', urls, { shouldValidate: true });
              }}
              label="Images"
              inputClasses="h-60"
            />
            {errors.imageUrl && (
              <p className="mt-1 text-sm text-red-600">{errors.imageUrl.message}</p>
            )}
          </div>
        </div>
        <div className="col-span-12 flex justify-end space-x-4">
            <CancelButton
              hasUnsavedChanges={() => {
                const values = watch();
                return (
                  !!values.name ||
                  !!values.manufacturer ||
                  !!values.source ||
                  !!values.typeId ||
                  (values.coneIds?.length ?? 0) > 0 ||
                  (values.atmosphereIds?.length ?? 0) > 0 ||
                  !!values.notes ||
                  !!values.imageUrl
                );
              }}
              route="/decorations"
              type="button"
            />
            <ActionButton
              type="submit"
              disabled={isSubmitting}
              isLoading={isSubmitting}
            >
              {submitButtonText}
            </ActionButton>
          </div>
      </div>
    </Form>
  )
}