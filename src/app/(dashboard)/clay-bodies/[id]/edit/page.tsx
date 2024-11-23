import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { notFound, redirect } from 'next/navigation'
import { ClayBodyForm } from '@/components/clay-bodies/clay-body-form'
import { updateClayBody } from './actions'
import { type ClayBodyFormData } from '@/lib/schemas/clay-body'

export default async function EditClayBodyPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const clayBody = await prisma.clayBodies.findFirst({
    where: {
      id: params.id,
      user_id: session.user.id,
    },
  })

  if (!clayBody) {
    return notFound()
  }

  // Convert the Prisma model data to match the form schema
  const formData: ClayBodyFormData = {
    name: clayBody.name,
    type: clayBody.type === 'Bone_China' ? 'Bone China' : clayBody.type,
    cone: clayBody.cone || '',
    description: clayBody.description || undefined,
    cone_range: clayBody.cone_range || undefined,
    manufacturer: clayBody.manufacturer || undefined,
    firing_temperature: clayBody.firing_temperature || undefined,
    plasticity: clayBody.plasticity,
    texture: clayBody.texture,
    composition: clayBody.composition || undefined,
    colour_oxidation: clayBody.colour_oxidation || undefined,
    colour_reduction: clayBody.colour_reduction || undefined,
    shrinkage: clayBody.shrinkage || undefined,
    absorption: clayBody.absorption || undefined,
    notes: clayBody.notes || undefined,
  }

  async function action(formData: FormData) {
    'use server'
    formData.append('id', params.id)
    await updateClayBody(formData)
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Edit Clay Body</h1>
        </div>

        <div className="mt-8">
          <ClayBodyForm
            initialData={formData}
            action={action}
            submitButtonText="Save Changes"
          />
        </div>
      </div>
    </div>
  )
}