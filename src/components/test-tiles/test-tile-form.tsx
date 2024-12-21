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
import { ClayBodyForm } from '@/components/clay-bodies/clay-body-form'
import { DecorationForm } from '@/components/decorations/decoration-form'
import { ClayBody, Collection, Decoration, DecorationType } from '@prisma/client'
import { ClayBodyType } from '@prisma/client'
import { Atmosphere } from '@prisma/client'
import { Cone } from '@prisma/client'
import { ImageDropzone } from '@/components/ui/forms/image-dropzone'
import { sortCones } from '@/lib/utils/sort-cones'

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
  submitButtonText = 'Create Test Tile',
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
      decorationLayers: initialData?.decorationLayers || [{
        order: 1,
        decorationIds: []
      }]
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
    const response = await fetch('/api/clay-bodies', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error('Failed to create clay body')
    }

    const clayBody = await response.json()
    // Update the clay bodies list with the new clay body
    setClayBodies(prevBodies => [...prevBodies, clayBody])
    // Set the selected value to the new clay body
    setValue('clayBodyId', clayBody.id, { shouldValidate: true })
    setIsClayBodyModalOpen(false)
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
    const response = await fetch('/api/decorations', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error('Failed to create decoration')
    }

    const decoration = await response.json()
    setDecorations(prevDecorations => [...prevDecorations, decoration])

    // Add the new decoration to the current layer
    const currentLayer = decorationLayers[decorationLayers.length - 1]
    handleLayerChange(currentLayer.order, [...currentLayer.decorationIds, decoration.id])

    setIsDecorationModalOpen(false)
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
        {initialData?.id && (
          <input type="hidden" name="id" value={initialData.id} />
        )}
        <div className="space-y-6">
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

          <div className="space-y-2">
            <FormSelect
              name="clayBodyId"
              label="Clay Body"
              control={control}
              options={clayBodies.map(body => ({ value: body.id, label: body.name }))}
              error={errors.clayBodyId}
              required
            />
            <div className="flex justify-end">
              <ActionButton
                type="button"
                variant="secondary"
                onClick={() => setIsClayBodyModalOpen(true)}
              >
                Add New Clay Body
              </ActionButton>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Decorations</h3>
              <button
                type="button"
                onClick={() => setIsDecorationModalOpen(true)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Add New Decoration
              </button>
            </div>

            {controlledFields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-2">
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
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="mt-8 text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addLayer}
              disabled={!canAddLayer}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800 disabled:text-clay-400"
            >
              Add Layer
            </button>
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
            options={atmospheres.map(atmosphere => ({ value: atmosphere.id, label: atmosphere.name }))}
            error={errors.atmosphereId}
            required
          />

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

          <div>
            <label className="block text-sm font-medium text-clay-700">Images</label>
            <ImageDropzone
              currentImageUrl={initialData?.imageUrl}
              onImagesSelected={(urls) => {
                setValue('imageUrl', urls, { shouldValidate: true });
              }}
            />
            {errors.imageUrl && (
              <p className="mt-1 text-sm text-red-600">{errors.imageUrl.message}</p>
            )}
          </div>

          <FormTextarea
            label="Notes"
            name="notes"
            register={register}
            error={errors.notes}
            placeholder="Add any additional notes about this test tile..."
          />

          <div className="mt-6 flex justify-end gap-3">
            <CancelButton
              hasUnsavedChanges={() => Object.keys(errors).length > 0 || 
                watch('name') !== initialData?.name || 
                watch('clayBodyId') !== initialData?.clayBodyId || 
                watch('coneId') !== initialData?.coneId || 
                watch('atmosphereId') !== initialData?.atmosphereId || 
                watch('decorationLayers') !== initialData?.decorationLayers || 
                watch('notes') !== initialData?.notes || 
                watch('imageUrl') !== initialData?.imageUrl
              }
              route="/test-tiles"
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
        title="Add New Clay Body"
      >
        <ClayBodyForm
          action={handleClayBodySubmit}
          submitButtonText="Create Clay Body"
          clayBodyTypes={clayBodyTypes}
          cones={cones}
        />
      </Modal>

      <Modal
        isOpen={isDecorationModalOpen}
        onClose={() => setIsDecorationModalOpen(false)}
        title="Add New Decoration"
      >
        <DecorationForm
          action={handleDecorationSubmit}
          submitButtonText="Create Decoration"
          decorationTypes={decorationTypes}
          cones={cones}
          atmospheres={atmospheres}
        />
      </Modal>
    </>
  )
}