'use client'

import { useState, useEffect, useMemo } from 'react'
import { useForm, FieldError, Merge, Control, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { testTileSchema, type TestTileFormData } from '@/lib/schemas/test-tile'
import { Form } from '@/components/ui/forms/form'
import { FormField } from '@/components/ui/forms/form-field'
import { FormTextarea } from '@/components/ui/forms/form-textarea'
import { FormSelect } from '@/components/ui/forms/form-select'
import { FormMultiSelect } from '@/components/ui/forms/form-multi-select'
import { ActionButton } from '@/components/ui/buttons/action-button'
import { CancelButton } from '@/components/ui/buttons/cancel-button'
import { Modal } from '@/components/ui/modal'
import { Switch } from '@headlessui/react'
import { ClayBodyForm } from '@/components/clay-bodies/clay-body-form'
import { DecorationForm } from '@/components/decorations/decoration-form'
import { ClayBody, Collection, Decoration, DecorationType } from '@prisma/client'
import { ClayBodyType } from '@prisma/client'
import { Atmosphere } from '@prisma/client'
import { Cone } from '@prisma/client'
import { ImageDropzone } from '@/components/ui/forms/image-dropzone'
import { sortCones } from '@/lib/utils/sort-cones'
import { sortAtmospheres } from '@/lib/utils/sort-atmospheres'
import { createClayBody } from '@/app/(dashboard)/clay-bodies/new/actions'
import { createDecoration } from '@/app/(dashboard)/decorations/new/actions'

interface DecorationLayer {
  order: number
  decorationIds: string[]
}

interface TestTileFormProps {
  initialData?: TestTileFormData & { id?: string }
  action: (formData: FormData) => Promise<void>
  submitButtonText?: string
  clayBodies: Array<ClayBody>
  decorations: Array<Decoration>
  collections: Array<Collection>
  cones: Array<Cone>
  atmospheres: Array<Atmosphere>
  clayBodyTypes: Array<ClayBodyType>
  decorationTypes: Array<DecorationType>
}

export function TestTileForm({
  initialData,
  action,
  submitButtonText = 'Create test tile',
  clayBodies: initialClayBodies,
  decorations: initialDecorations,
  collections,
  cones,
  atmospheres,
  clayBodyTypes,
  decorationTypes
}: TestTileFormProps) {
  const router = useRouter()
  const [isClayBodyModalOpen, setIsClayBodyModalOpen] = useState(false)
  const [isDecorationModalOpen, setIsDecorationModalOpen] = useState(false)
  const [clayBodies, setClayBodies] = useState(initialClayBodies)
  const [decorations, setDecorations] = useState(initialDecorations)
  const [decorationLayers, setDecorationLayers] = useState<DecorationLayer[]>([
    { order: 1, decorationIds: [] }
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const sortedCones = useMemo(() => sortCones(cones), [cones])
  const sortedAtmospheres = useMemo(() => sortAtmospheres(atmospheres), [atmospheres])
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors }
  } = useForm<TestTileFormData>({
    resolver: zodResolver(testTileSchema),
    defaultValues: {
      ...initialData,
      decorationLayers: initialData?.decorationLayers?.length ? initialData.decorationLayers : [
        {
          order: 1,
          decorationIds: []
        }
      ]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "decorationLayers"
  });

  const watchFieldArray = watch("decorationLayers");
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index]
    };
  });

  const canAddLayer = controlledFields[controlledFields.length - 1]?.decorationIds?.length > 0;

  const addLayer = () => {
    append({ order: controlledFields.length + 1, decorationIds: [] });
  };

  const handleClayBodySubmit = async (formData: FormData) => {
    try {
      const clayBody = await createClayBody(formData, false)
      // Update the clay bodies list with the new clay body
      setClayBodies(prevBodies => [...prevBodies, clayBody])
      // Set the selected value to the new clay body
      setValue('clayBodyId', clayBody.id, { shouldValidate: true })
      // Close the modal
      setIsClayBodyModalOpen(false)
    } catch (error) {
      console.error('Error creating clay body:', error)
      throw error
    }
  }

  const handleLayerChange = (order: number, decorationIds: string[]) => {
    setDecorationLayers(prevLayers => {
      const layerIndex = prevLayers.findIndex(layer => layer.order === order)
      if (layerIndex === -1) return prevLayers

      const newLayers = [...prevLayers]
      newLayers[layerIndex] = { order, decorationIds }
      return newLayers
    })
  }

  const handleDecorationSubmit = async (formData: FormData) => {
    try {
      const decoration = await createDecoration(formData, false)
      setDecorations(prevDecorations => [...prevDecorations, decoration])

      // Add the new decoration to the current layer
      const currentLayerIndex = controlledFields.length - 1
      const currentLayer = controlledFields[currentLayerIndex]
      
      // Update the form state
      const newDecorationIds = [...(currentLayer.decorationIds || []), decoration.id]
      setValue(`decorationLayers.${currentLayerIndex}.decorationIds`, newDecorationIds)
      
      // Update the local state
      handleLayerChange(currentLayer.order, newDecorationIds)

      setIsDecorationModalOpen(false)
    } catch (error) {
      console.error('Error creating decoration:', error)
      throw error
    }
  }

  const handleSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true)

      // Get the current form values
      const values = watch()

      // Ensure the ID is included in the form data for updates
      if (initialData?.id) {
        formData.set('id', initialData.id)
      }

      // Add decoration layers to form data
      values.decorationLayers?.forEach((layer, index) => {
        console.log(`Adding layer ${index + 1}:`, layer)
        formData.append(`decorationLayers[${index}][order]`, (index + 1).toString())
        layer.decorationIds?.forEach(id => {
          formData.append(`decorationLayers[${index}][decorationIds][]`, id)
        })
      })

      // Add collections to form data
      values.collectionIds?.forEach(collection => {
        formData.append('collectionIds', collection)
      })

      // Add imageUrl values from form state
      if (values.imageUrl?.length) {
        values.imageUrl.forEach(url => {
          formData.append('imageUrl', url)
        })
      }

      // Add isPublic value from form state
      formData.append('isPublic', String(watch('isPublic')))

      console.log('Form data before submission:', Object.fromEntries(formData.entries()))
      await action(formData)
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
    <>
      <Form onSubmit={handleSubmit}>
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-7 bg-sand-light p-8 space-y-6 rounded-2xl">
            <h2 className="mb-10 text-2xl font-semibold text-clay-800">Test tile details</h2>
            {initialData?.id && (
              <input type="hidden" name="id" value={initialData.id} />
            )}
            <div className="space-y-6">
              <div className="pb-4 space-y-6">
                <FormField
                  label="Name"
                  name="name"
                  register={register}
                  error={errors.name}
                  required
                />

                <FormField
                  label="Stamp"
                  name="stamp"
                  register={register}
                  error={errors.stamp}
                />

                <div className="space-x-3 flex">
                  <div className="grow">
                    <FormSelect
                      name="clayBodyId"
                      label="Clay body"
                      control={control}
                      options={clayBodies.map(body => ({ value: body.id, label: body.name }))}
                      error={errors.clayBodyId}
                      required
                    />
                  </div>
                  <div className="self-end">
                    <ActionButton
                      type="button"
                      variant="secondary"
                      onClick={() => setIsClayBodyModalOpen(true)}
                    >
                      Add new clay body
                    </ActionButton>
                  </div>
                </div>

                <FormSelect
                  name="coneId"
                  label="Cone"
                  control={control}
                  options={sortedCones.map(cone => ({ value: cone.id, label: cone.name }))}
                  error={errors.coneId}
                  required
                />

                <FormSelect
                  name="atmosphereId"
                  label="Atmosphere"
                  control={control}
                  options={sortedAtmospheres.map(atmosphere => ({ value: atmosphere.id, label: atmosphere.name }))}
                  error={errors.atmosphereId}
                  required
                />
              </div>
              <div className="space-y-4 border-y border-clay-200 pt-5 pb-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-clay-800 mt-2">Decorations</h3>
                    <p className="text-clay-900 mb-2">Add layers of decorations to your test tile</p>
                  </div>
                  <ActionButton
                      type="button"
                      variant="secondary"
                      onClick={() => setIsDecorationModalOpen(true)}
                      className="mt-1"
                  >
                      Add new decoration
                  </ActionButton>
                </div>

                {controlledFields.map((field, index) => (
                  <div key={field.id} className="flex items-end gap-3">
                    <FormMultiSelect
                      label={`Layer ${index + 1}`}
                      name={`decorationLayers.${index}.decorationIds`}
                      control={control}
                      options={decorations.map(d => ({
                        label: d.name,
                        value: d.id
                      }))}
                      error={errors.decorationLayers?.[index]?.decorationIds}
                      onChange={(values) => handleLayerChange(index + 1, values)}
                      className="w-full"
                    />
                    {index > 0 && (

                      <ActionButton
                        type="button"
                        variant="tertiaryDanger"
                        onClick={() => remove(index)}
                      >
                        Remove
                      </ActionButton>

                    )}
                  </div>
                ))}

                <ActionButton
                  type="button"
                  variant="secondary"
                  size="compact"
                  onClick={addLayer}
                  disabled={!canAddLayer}
                >
                  Add layer
                </ActionButton>
              </div>
              <div className="space-y-6 pt-2">
              <FormMultiSelect
                name="collectionIds"
                label="Collections"
                control={control}
                options={collections.map(collection => ({
                  value: collection.id,
                  label: collection.name
                }))}
                error={errors.collectionIds as FieldError | Merge<FieldError, (FieldError | undefined)[]>}
              />

              <FormTextarea
                label="Notes"
                name="notes"
                register={register}
                error={errors.notes}
                placeholder="Add any additional notes about this test tile..."
              />

              <div className="flex items-center justify-between p-4 border border-solid border-clay-300 rounded-md">
                <div>
                  <h4 className="font-medium text-clay-800">Make test tile public</h4>
                  <p className="text-sm text-clay-600 mb-[2px]">Public test tiles are visible to all Test Tile Tracker visitors.</p>
                </div>
                <input
                  type="hidden"
                  {...register('isPublic')}
                />
                <Switch
                  checked={watch('isPublic') ?? false}
                  onChange={(checked) => setValue('isPublic', checked)}
                  className={`${
                    watch('isPublic') ? 'bg-brand' : 'bg-clay-300'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-clay-600 focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      watch('isPublic') ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
              </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 md:col-span-5 bg-sand-light p-8 rounded-2xl">
            <div>
              <h3 className="mb-10 text-2xl font-semibold text-clay-800">Test tile images</h3>
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
                  !!values.clayBodyId ||
                  !!values.coneId ||
                  !!values.atmosphereId ||
                  (values.decorationLayers?.length ?? 0) > 0 ||
                  !!values.notes ||
                  !!values.imageUrl
                );
              }}
              onCancel={() => window.location.href = '/test-tiles'}
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

      <Modal
        isOpen={isClayBodyModalOpen}
        onClose={() => setIsClayBodyModalOpen(false)}
        title="Add new clay body"
      >
        <ClayBodyForm
          action={handleClayBodySubmit}
          clayBodyTypes={clayBodyTypes}
          cones={cones}
          isInModal={true}
          onCancel={() => setIsClayBodyModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isDecorationModalOpen}
        onClose={() => setIsDecorationModalOpen(false)}
        title="Add new decoration"
      >
        <DecorationForm
          action={handleDecorationSubmit}
          decorationTypes={decorationTypes}
          cones={cones}
          atmospheres={atmospheres}
          isInModal={true}
          onCancel={() => setIsDecorationModalOpen(false)}
        />
      </Modal>
    </>
  )
}