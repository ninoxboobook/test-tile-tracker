import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect, notFound } from 'next/navigation'
import { ClayBodyForm } from '@/components/clay-bodies/clay-body-form'
import { FormLayout } from '@/components/ui/layout/form-layout'
import { updateClayBody } from './actions'
import { ClayBodyFormData } from '@/lib/schemas/clay-body'

export default async function EditClayBodyPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const clayBody = await prisma.clayBody.findUnique({
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
    manufacturer: clayBody.manufacturer || null,
    cone: clayBody.cone || null,
    firingTemperature: clayBody.firingTemperature || null,
    texture: clayBody.texture || null,
    plasticity: clayBody.plasticity || null,
    colourOxidation: clayBody.colourOxidation || null,
    colourReduction: clayBody.colourReduction || null,
    shrinkage: clayBody.shrinkage,
    absorption: clayBody.absorption,
    meshSize: clayBody.meshSize,
    imageUrl: clayBody.imageUrl || null,
    notes: clayBody.notes || null,
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