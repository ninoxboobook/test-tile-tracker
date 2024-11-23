'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { clayBodySchema, type ClayBodyFormData } from '@/lib/schemas/clay-body'
import { useRouter } from 'next/navigation'

interface ClayBodyFormProps {
  initialData?: ClayBodyFormData
  action: (formData: FormData) => Promise<void>
  submitButtonText?: string
}

export function ClayBodyForm({
  initialData,
  action,
  submitButtonText = 'Create Clay Body',
}: {
  initialData?: ClayBodyFormData
  action: (formData: FormData) => Promise<void>
  submitButtonText?: string
}) {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ClayBodyFormData>({
    resolver: zodResolver(clayBodySchema),
    defaultValues: initialData,
  })

  const type = watch('type')

  const onSubmit = async (data: ClayBodyFormData) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, value.toString())
      }
    })
    await action(formData)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 divide-y divide-gray-200">
      <div className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <input
              type="text"
              {...register('name')}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-clay-500 focus:ring-clay-500 sm:text-sm"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Type <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <select
              {...register('type')}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-clay-500 focus:ring-clay-500 sm:text-sm"
            >
              <option value="">Select a type</option>
              <option value="Raku">Raku</option>
              <option value="Earthenware">Earthenware</option>
              <option value="Stoneware">Stoneware</option>
              <option value="Bone_China">Bone China</option>
              <option value="Porcelain">Porcelain</option>
              <option value="Wild">Wild</option>
            </select>
            {errors.type && (
              <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
            )}
          </div>
        </div>

        {type && type !== 'Wild' && (
          <div>
            <label htmlFor="manufacturer" className="block text-sm font-medium text-gray-700">
              Manufacturer
            </label>
            <div className="mt-1">
              <input
                type="text"
                {...register('manufacturer')}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-clay-500 focus:ring-clay-500 sm:text-sm"
              />
            </div>
          </div>
        )}

        <div>
          <label htmlFor="cone" className="block text-sm font-medium text-gray-700">
            Cone <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <input
              type="text"
              {...register('cone')}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-clay-500 focus:ring-clay-500 sm:text-sm"
            />
            {errors.cone && (
              <p className="mt-1 text-sm text-red-600">{errors.cone.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="firing_temperature" className="block text-sm font-medium text-gray-700">
            Firing Temperature (°C)
          </label>
          <div className="mt-1">
            <input
              type="text"
              {...register('firing_temperature')}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-clay-500 focus:ring-clay-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="colour_oxidation" className="block text-sm font-medium text-gray-700">
            Colour (Oxidation)
          </label>
          <div className="mt-1">
            <input
              type="text"
              {...register('colour_oxidation')}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-clay-500 focus:ring-clay-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="colour_reduction" className="block text-sm font-medium text-gray-700">
            Colour (Reduction)
          </label>
          <div className="mt-1">
            <input
              type="text"
              {...register('colour_reduction')}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-clay-500 focus:ring-clay-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="shrinkage" className="block text-sm font-medium text-gray-700">
            Shrinkage (%)
          </label>
          <div className="mt-1">
            <input
              type="number"
              step="0.1"
              {...register('shrinkage', { valueAsNumber: true })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-clay-500 focus:ring-clay-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="absorption" className="block text-sm font-medium text-gray-700">
            Absorption (%)
          </label>
          <div className="mt-1">
            <input
              type="number"
              step="0.1"
              {...register('absorption', { valueAsNumber: true })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-clay-500 focus:ring-clay-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="plasticity" className="block text-sm font-medium text-gray-700">
            Plasticity
          </label>
          <div className="mt-1">
            <select
              {...register('plasticity')}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-clay-500 focus:ring-clay-500 sm:text-sm"
            >
              <option value="">Select plasticity</option>
              <option value="very low">Very Low</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="very high">Very High</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="texture" className="block text-sm font-medium text-gray-700">
            Texture
          </label>
          <div className="mt-1">
            <select
              {...register('texture')}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-clay-500 focus:ring-clay-500 sm:text-sm"
            >
              <option value="">Select texture</option>
              <option value="smooth">Smooth</option>
              <option value="fine grog">Fine grog</option>
              <option value="medium grog">Medium grog</option>
              <option value="coarse grog">Coarse grog</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <div className="mt-1">
            <textarea
              {...register('notes')}
              rows={4}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-clay-500 focus:ring-clay-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-clay-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-clay-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-clay-700 focus:outline-none focus:ring-2 focus:ring-clay-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : submitButtonText}
          </button>
        </div>
      </div>
    </form>
  )
}
