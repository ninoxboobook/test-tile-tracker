import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect, notFound } from 'next/navigation'
import { DecorationForm } from '@/components/decorations/decoration-form'
import { FormLayout } from '@/components/ui/layout/form-layout'
import { updateDecoration } from './actions'
import type { DecorationFormData } from '@/lib/schemas/decoration'

export default async function EditDecorationPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const decoration = await prisma.decoration.findUnique({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  })

  if (!decoration) {
    return notFound()
  }

  const formData: DecorationFormData = {
    name: decoration.name,
    category: decoration.category,
    type: decoration.type,
    manufacturer: decoration.manufacturer || null,
    cone: decoration.cone || null,
    atmosphere: decoration.atmosphere || null,
    colour: decoration.colour || null,
    surface: decoration.surface || null,
    transparency: decoration.transparency || null,
    glazyUrl: decoration.glazyUrl || null,
    imageUrl: decoration.imageUrl || null,
    recipe: decoration.recipe || null,
    notes: decoration.notes || null,
  }

  return (
    <FormLayout 
      title="Edit Decoration"
      description={`Editing ${decoration.name}`}
      backHref={`/decorations/${params.id}`}
    >
      <DecorationForm 
        action={updateDecoration}
        initialData={formData}
        submitButtonText="Update Decoration"
      />
    </FormLayout>
  )
} 