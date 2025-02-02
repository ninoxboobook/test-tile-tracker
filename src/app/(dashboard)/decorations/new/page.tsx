import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { DecorationForm } from '@/components/decorations/decoration-form'
import { FormLayout } from '@/components/ui/layout/form-layout'
import { createDecorationAndRedirect } from './actions'

export default async function NewDecorationPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const [decorationTypes, cones, atmospheres] = await Promise.all([
    prisma.decorationType.findMany({
      orderBy: { name: 'asc' }
    }),
    prisma.cone.findMany({
      orderBy: { name: 'asc' }
    }),
    prisma.atmosphere.findMany({
      orderBy: { name: 'asc' }
    })
  ])

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { publicClayBodies: true }
  })

  return (
    <FormLayout 
      title="Add new decoration"
      backHref="/decorations"
    >
      <DecorationForm 
        action={createDecorationAndRedirect}
        decorationTypes={decorationTypes}
        cones={cones}
        atmospheres={atmospheres}
        initialData={{
          id: '',
          name: '',
          typeId: '',
          type: {
            id: '',
            name: ''
          },
          cone: [],
          atmosphere: [],
          userId: session.user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
          decorationLayers: [],
          isPublic: user?.publicClayBodies ?? false
        }}
      />
    </FormLayout>
  )
}
