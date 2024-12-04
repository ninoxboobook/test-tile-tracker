import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect, notFound } from 'next/navigation'
import { ClayBodyForm } from '@/components/clay-bodies/clay-body-form'
import { FormLayout } from '@/components/ui/layout/form-layout'
import { updateClayBody } from './actions'
import type { ClayBodyFormData } from '@/lib/schemas/clay-body'

export default async function EditClayBodyPage(
  props: {
    params: Promise<{ id: string }>
  }
) {
  const params = await props.params;
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const [clayBody, clayBodyTypes, cones] = await Promise.all([
    prisma.clayBody.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        type: true,
        cone: true
      }
    }),
    prisma.clayBodyType.findMany({
      orderBy: { name: 'asc' }
    }),
    prisma.cone.findMany({
      orderBy: { name: 'asc' }
    })
  ])

  if (!clayBody) {
    return notFound()
  }

  const formData: ClayBodyFormData & { id: string } = {
    id: clayBody.id,
    name: clayBody.name,
    typeId: clayBody.typeId,
    manufacturer: clayBody.manufacturer || null,
    cone: clayBody.cone.map(c => c.name),
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
      description="Update your clay body details"
      backHref={`/clay-bodies/${clayBody.id}`}
    >
      <ClayBodyForm 
        action={updateClayBody} 
        initialData={formData}
        submitButtonText="Update Clay Body"
        clayBodyTypes={clayBodyTypes}
        cones={cones}
      />
    </FormLayout>
  )
}