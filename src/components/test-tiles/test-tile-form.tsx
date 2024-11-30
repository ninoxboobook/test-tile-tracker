'use client'

import { useState, useEffect } from 'react'
import { useForm, FieldError, Merge, Control } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { testTileSchema, type TestTileFormData } from '@/lib/schemas/test-tile'
import { Form } from '@/components/ui/forms/form'
import { FormField } from '@/components/ui/forms/form-field'
import { FormTextarea } from '@/components/ui/forms/form-textarea'
import { FormSelect } from '@/components/ui/forms/form-select'
import { FormMultiSelect } from '@/components/ui/forms/form-multi-select'
import { ActionButton } from '@/components/ui/buttons/action-button'
import { Modal } from '@/components/ui/modal'
import { ClayBodyForm } from '@/components/clay-bodies/clay-body-form'
import { DecorationForm } from '@/components/decorations/decoration-form'

interface DecorationLayer {
  order: number
  decorationIds: string[]
}

interface TestTileFormProps {
  initialData?: TestTileFormData
  action: (formData: FormData) => Promise<void>
  submitButtonText?: string
  clayBodies: Array<{ id: string; name: string }>
  decorations: Array<{ id: string; name: string }>
  collections: Array<{ id: string; name: string }>
}

interface FormMultiSelectProps {
  name: string
  label: string
  control: Control<TestTileFormData>
  options: Array<{ value: string; label: string }>
  error?: FieldError | Merge<FieldError, (FieldError | undefined)[]>
}

export function TestTileForm({
  initialData,
  action,
  submitButtonText = 'Create Test Tile',
  clayBodies: initialClayBodies,
  decorations: initialDecorations,
  collections
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
  const {
    register,
    setValue,
    watch,
    control,
    formState: { errors }
  } = useForm<TestTileFormData>({
    resolver: zodResolver(testTileSchema),
    defaultValues: initialData
  })

  // Watch the clayBodyId to make the select controlled
  const selectedClayBodyId = watch('clayBodyId')

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
    setClayBodies(prevBodies => [...prevBodies, { id: clayBody.id, name: clayBody.name }])
    // Set the selected value to the new clay body
    setValue('clayBodyId', clayBody.id, { shouldValidate: true })
    setIsClayBodyModalOpen(false)
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
    // Update the decorations list with the new decoration
    setDecorations(prevDecorations => [...prevDecorations, { id: decoration.id, name: decoration.name }])
    
    // Add the new decoration to the current layer
    const currentLayer = decorationLayers[decorationLayers.length - 1]
    handleLayerChange(currentLayer.order, [...currentLayer.decorationIds, decoration.id])
    
    setIsDecorationModalOpen(false)
  }

  const canAddLayer = decorationLayers[decorationLayers.length - 1].decorationIds.length > 0

  const handleLayerChange = (order: number, decorationIds: string[]) => {
    setDecorationLayers(layers =>
      layers.map(layer =>
        layer.order === order ? { ...layer, decorationIds } : layer
      )
    )
    // Update the form value
    setValue(`decorationLayers.${order - 1}.decorationIds`, decorationIds)
  }

  // Watch decoration layers to keep local state in sync
  const formDecorationLayers = watch('decorationLayers')
  
  // Update local state when form values change
  useEffect(() => {
    if (formDecorationLayers) {
      setDecorationLayers(
        formDecorationLayers.map((layer, index) => ({
          order: index + 1,
          decorationIds: layer.decorationIds || []
        }))
      )
    }
  }, [formDecorationLayers])

  const addLayer = () => {
    if (canAddLayer) {
      setDecorationLayers(layers => [
        ...layers,
        { order: layers.length + 1, decorationIds: [] }
      ])
    }
  }

  const removeLayer = (order: number) => {
    setDecorationLayers(layers => {
      const newLayers = layers.filter(layer => layer.order !== order)
      // Reorder remaining layers
      return newLayers.map((layer, index) => ({
        ...layer,
        order: index + 1
      }))
    })
  }

  const handleSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true)
      
      // Add decoration layers to form data
      decorationLayers.forEach((layer, index) => {
        if (layer.decorationIds.length > 0) {
          formData.append(`decorationLayers[${index}][order]`, layer.order.toString())
          layer.decorationIds.forEach(id => {
            formData.append(`decorationLayers[${index}][decorationIds][]`, id)
          })
        }
      })

      await action(formData)
    } catch (error) {
      // If it's a redirect error, we don't need to handle it
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
        <div className="space-y-6">
          {initialData?.id && (
            <input 
              type="hidden" 
              name="id" 
              value={initialData.id} 
            />
          )}
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

            {decorationLayers.map((layer) => (
              <div key={layer.order} className="flex items-start gap-2">
                <FormMultiSelect
                  label={`Layer ${layer.order}`}
                  name={`decorationLayers.${layer.order - 1}.decorationIds`}
                  control={control}
                  options={decorations.map(d => ({
                    label: d.name,
                    value: d.id
                  }))}
                  error={errors.decorationLayers?.[layer.order - 1]?.decorationIds}
                />
                {layer.order > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLayer(layer.order)}
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
              className="mt-2 text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400"
            >
              Add Layer
            </button>
          </div>

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
            placeholder="Add any notes about this test tile..."
          />

          <ActionButton type="submit" isLoading={isSubmitting}>
            {submitButtonText}
          </ActionButton>
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
        />
      </Modal>
    </>
  )
}