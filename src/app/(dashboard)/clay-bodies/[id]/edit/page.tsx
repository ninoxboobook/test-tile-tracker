import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect, notFound } from 'next/navigation'
import { ClayBodyForm } from '@/components/clay-bodies/clay-body-form'
import { FormLayout } from '@/components/ui/layout/form-layout'
import { updateClayBody } from './actions'
import { ClayBodyFormData } from '@/lib/schemas/clay-body'

// Helper function to convert nullable string to enum or undefined
function convertNullableToEnum<T extends string>(
  value: string | null,
  validValues: readonly T[]
): T | undefined {
  return value && validValues.includes(value as T) ? value as T : undefined
}

// Helper function to convert number to string or undefined
function numberToString(value: number | null): string | undefined {
  return value?.toString() || undefined
}

// Helper function to convert JSON to string or undefined
function jsonToString(value: any): string | undefined {
  if (!value) return undefined
  return typeof value === 'string' ? value : JSON.stringify(value)
}

// Define valid values as const arrays
const PLASTICITY_VALUES = [
  'Very Low',
  'Low',
  'Medium',
  'High',
  'Very High'
] as const

const TEXTURE_VALUES = [
  'Smooth',
  'Fine grog',
  'Medium grog',
  'Coarse grog'
] as const

export default async function EditClayBodyPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const clayBody = await prisma.clayBody.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  })

  if (!clayBody) {
    return notFound()
  }

  const formData: ClayBodyFormData = {
    name: clayBody.name,
    type: clayBody.type,
    cone: clayBody.cone || '',
    manufacturer: clayBody.manufacturer || undefined,
    firing_temperature: clayBody.firingTemperature || undefined,
    plasticity: convertNullableToEnum(clayBody.plasticity, PLASTICITY_VALUES),
    texture: convertNullableToEnum(clayBody.texture, TEXTURE_VALUES),
    colour_oxidation: clayBody.colourOxidation || undefined,
    colour_reduction: clayBody.colourReduction || undefined,
    shrinkage: numberToString(clayBody.shrinkage),
    absorption: numberToString(clayBody.absorption),
    notes: clayBody.notes || undefined,
  }

  return (
    <FormLayout 
      title="Edit Clay Body"
      description={`Editing ${clayBody.name}`}
      backHref={`/clay-bodies/${params.id}`}
    >
      <ClayBodyForm 
        action={updateClayBody}
        initialData={formData}
        submitButtonText="Update Clay Body"
      />
    </FormLayout>
  )
}