import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import { ClayBodyForm } from '@/components/clay-bodies/clay-body-form'
import { FormLayout } from '@/components/ui/layout/form-layout'
import { updateClayBody } from './actions'

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

  // Transform data to match form expectations
  const formData = {
    ...clayBody,
    coneIds: clayBody.cone.map(c => c.id), // Transform cone array to array of IDs
  }

  return (
    <FormLayout 
      title={`Edit ${clayBody.name}`}
      backHref={`/clay-bodies/${clayBody.id}`}
    >
      <ClayBodyForm 
        action={updateClayBody}
        initialData={formData}
        submitButtonText="Update clay body"
        clayBodyTypes={clayBodyTypes}
        cones={cones}
      />
    </FormLayout>
  )
}