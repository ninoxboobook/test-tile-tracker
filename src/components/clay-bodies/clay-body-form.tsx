'use client'

import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { clayBodySchema, type ClayBodyFormData } from '@/lib/schemas/clay-body'
import { Form } from '@/components/ui/forms/form'
import { FormField } from '@/components/ui/forms/form-field'
import { FormTextarea } from '@/components/ui/forms/form-textarea'
import { FormSelect } from '@/components/ui/forms/form-select'
import { FormMultiSelect } from '@/components/ui/forms/form-multi-select'
import { ActionButton } from '@/components/ui/buttons/action-button'
import { CancelButton } from '@/components/ui/buttons/cancel-button'
import { ClayBodyType, Cone } from '@prisma/client'
import { ImageDropzone } from '@/components/ui/forms/image-dropzone'
import { sortCones } from '@/lib/utils/sort-cones'
import { sortClayTypes } from '@/lib/utils/sort-clay-types'

interface ClayBodyFormProps {
  initialData?: any
  action: (formData: FormData) => Promise<void>
  submitButtonText?: string
  clayBodyTypes: ClayBodyType[]
  cones: Array<Cone>
}

export function ClayBodyForm({
  initialData,
  action,
  submitButtonText = 'Create Clay Body',
  clayBodyTypes,
  cones
}: ClayBodyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const sortedCones = useMemo(() => sortCones(cones), [cones])
  const sortedClayTypes = useMemo(() => sortClayTypes(clayBodyTypes), [clayBodyTypes])
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors }
  } = useForm<ClayBodyFormData>({
    resolver: zodResolver(clayBodySchema),
    defaultValues: {
      ...initialData,
      cone: initialData?.coneIds || []
    }
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
        if (key === 'cone' || key === 'imageUrl') {
          if (!acc[key]) {
            acc[key] = formData.getAll(key);
          }
        } else {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);

      // Add cone values from form state
      if (values.cone?.length) {
        formDataObj.cone = values.cone;
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

      await action(newFormData)
    } catch (error) {
      if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
        return
      }
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-7 bg-sand-light p-8 space-y-6 rounded-2xl">
          <h2 className="mb-10 text-2xl font-semibold text-clay-800">Clay body details</h2>
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
            options={sortedClayTypes.map(type => ({
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
              options={sortedCones.map(cone => ({
                value: cone.id,
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
                { value: 'Very smooth', label: 'Very smooth' },
                { value: 'Smooth', label: 'Smooth' },
                { value: 'Medium', label: 'Medium' },
                { value: 'Coarse', label: 'Coarse' },
                { value: 'Very Coarse', label: 'Very coarse' },
              ]}
              error={errors.texture}
            />

            <FormSelect
              label="Plasticity"
              name="plasticity"
              control={control}
              options={[
                { value: 'Very Plastic', label: 'Very plastic' },
                { value: 'Plastic', label: 'Plastic' },
                { value: 'Slightly Plastic', label: 'Slightly plastic' },
                { value: 'Non-Plastic', label: 'Non-plastic' }
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

          <FormTextarea
            label="Notes"
            name="notes"
            register={register}
            error={errors.notes}
            placeholder="Add any additional notes about this clay body..."
          />

        </div>
        <div className="col-span-5 bg-sand-light p-8 rounded-2xl">
          <div>
            <h3 className="mb-10 text-2xl font-semibold text-clay-800">Clay body images</h3>
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
                !!values.typeId ||
                (values.cone?.length ?? 0) > 0 ||
                !!values.shrinkage ||
                !!values.absorption ||
                !!values.meshSize ||
                !!values.notes ||
                !!values.imageUrl
              );
            }}
            type="button"
            route="/clay-bodies"
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
