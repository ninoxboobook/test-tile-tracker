import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ClayBodyForm } from '@/components/clay-bodies/clay-body-form'
import { prisma } from '@/lib/db'
import type { ClayBodyFormData } from '@/lib/schemas/clay-body'

export default async function NewClayBodyPage() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/login')
  }

  async function createClayBody(data: ClayBodyFormData) {
    'use server'

    const session = await getServerSession(authOptions)
    if (!session) {
      throw new Error('Unauthorized')
    }

    const clayBody = await prisma.clayBody.create({
      data: {
        ...data,
        userId: session.user.id,
      },
    })

    redirect(`/clay-bodies/${clayBody.id}`)
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">New Clay Body</h1>
      <div className="mt-8">
        <ClayBodyForm action={createClayBody} />
      </div>
    </div>
  )
}
