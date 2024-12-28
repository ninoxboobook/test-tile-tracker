import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { ClayBodyForm } from '@/components/clay-bodies/clay-body-form'
import { FormLayout } from '@/components/ui/layout/form-layout'
import { createClayBodyAndRedirect } from './actions'

export default async function NewClayBodyPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const [clayBodyTypes, cones] = await Promise.all([
    prisma.clayBodyType.findMany({
      orderBy: { name: 'asc' }
    }),
    prisma.cone.findMany({
      orderBy: { name: 'asc' }
    })
  ])

  return (
    <FormLayout 
      title="Add new clay body"
      backHref="/clay-bodies"
    >
      <ClayBodyForm 
        action={createClayBodyAndRedirect}
        clayBodyTypes={clayBodyTypes}
        cones={cones}
      />
    </FormLayout>
  )
}
