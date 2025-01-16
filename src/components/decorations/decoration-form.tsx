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
import { sortAtmospheres } from '@/lib/utils/sort-atmospheres'
import { sortDecorationTypes } from '@/lib/utils/sort-decoration-types'
import { FormColorPicker } from '../ui/forms/form-color-picker'
import { useRouter } from 'next/navigation'
import { Switch } from '@headlessui/react'

interface DecorationFormProps {
  initialData?: DecorationWithRelations
  action: (formData: FormData) => Promise<void>
  submitButtonText?: string
  decorationTypes: DecorationType[]
  cones: Array<Cone>
  atmospheres: Array<Atmosphere>
  isInModal?: boolean
  onCancel?: () => void
}

export function DecorationForm({
  initialData,
  action,
  submitButtonText = 'Create decoration',
  decorationTypes,
  cones,
  atmospheres,
  isInModal = false,
  onCancel
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
  const sortedAtmospheres = useMemo(() => sortAtmospheres(atmospheres), [atmospheres])
  const sortedDecorationTypes = useMemo(() => sortDecorationTypes(decorationTypes), [decorationTypes])

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

  const router = useRouter()

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

      // Add colour values from form state
      if (values.colour?.length) {
        formDataObj.colour = values.colour;
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
        <div className={`${isInModal ? 'col-span-12' : 'col-span-12 md:col-span-7 p-8'} bg-sand-light space-y-6 rounded-2xl`}>
          <h2 className={`${isInModal ? 'mb-2 text-xl font-medium' : 'mb-10 text-2xl font-semibold'} text-clay-800`}>Decoration details</h2>
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
            options={sortedDecorationTypes.map(type => ({
              value: type.id,
              label: type.name
            }))}
            error={errors.typeId}
            required
          />



          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
            <FormField
              label="Manufacturer"
              name="manufacturer"
              register={register}
              error={errors.manufacturer}
            />
          </div>

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

          <FormMultiSelect
            label="Atmosphere"
            name="atmosphereIds"
            control={control}
            options={sortedAtmospheres.map(atm => ({
              value: atm.id,
              label: atm.name
            }))}
            error={errors.atmosphereIds}
          />

          <FormSelect
            label="Surface"
            name="surface"
            control={control}
            options={[
              { value: 'Matte', label: 'Matte' },
              { value: 'Semi-matte', label: 'Semi-matte' },
              { value: 'Satin', label: 'Satin' },
              { value: 'Semi-gloss', label: 'Semi-gloss' },
              { value: 'Gloss', label: 'Gloss' },
            ]}
            error={errors.surface}
          />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <FormColorPicker
              label="Colour"
              name="colour"
              control={control}
              error={errors.colour}
            />
            <FormSelect
              label="Transparency"
              name="transparency"
              control={control}
              options={[
                { value: 'Opaque', label: 'Opaque' },
                { value: 'Semi-opaque', label: 'Semi-opaque' },
                { value: 'Translucent', label: 'Translucent' },
                { value: 'Transparent', label: 'Transparent' }
              ]}
              error={errors.transparency}
            />
          </div>

          <FormField
            label="Glazy URL"
            name="glazyUrl"
            register={register}
            error={errors.glazyUrl}
          />

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

          <div className="flex items-center justify-between p-4 border border-solid border-clay-300 rounded-md">
            <div>
              <h4 className="font-medium text-clay-800">Make decoration public</h4>
              <p className="text-sm text-clay-600 mb-[2px]">Public decorations are visible to all Test Tile Tracker visitors.</p>
            </div>
            <input
              type="hidden"
              {...register('isPublic')}
            />
            <Switch
              checked={watch('isPublic') ?? false}
              onChange={(checked) => setValue('isPublic', checked)}
              className={`${watch('isPublic') ? 'bg-brand' : 'bg-clay-300'
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-clay-600 focus:ring-offset-2`}
            >
              <span
                className={`${watch('isPublic') ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>


        </div>
        <div className={`${isInModal ? 'col-span-12' : 'col-span-12 md:col-span-5 p-8'} bg-sand-light rounded-2xl`}>
          <div>
            <h3 className={`${isInModal ? 'mb-2 text-xl font-medium' : 'mb-10 text-2xl font-semibold'} text-clay-800`}>Decoration images</h3>
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
                !!values.imageUrl ||
                !!values.glazyUrl ||
                !!values.recipe ||
                !!values.colour ||
                !!values.surface ||
                !!values.transparency ||
                !!values.isPublic

              );
            }}
            type="button"
            onCancel={() => {
              if (isInModal) {
                onCancel?.()
              } else {
                router.push('/decorations')
              }
            }}
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