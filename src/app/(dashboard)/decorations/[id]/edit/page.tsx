import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect, notFound } from 'next/navigation'
import { DecorationForm } from '@/components/decorations/decoration-form'
import { FormLayout } from '@/components/ui/layout/form-layout'
import { updateDecoration } from './actions'
import type { DecorationFormData } from '@/lib/schemas/decoration'

// Helper function to convert JSON to string
function jsonToString(value: any): string | undefined {
  if (!value) return undefined
  return typeof value === 'string' ? value : JSON.stringify(value)
}

export default async function EditDecorationPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const decoration = await prisma.decorations.findFirst({
    where: {
      id: params.id,
      user_id: session.user.id,
    },
  })

  if (!decoration) {
    return notFound()
  }

  // Helper function to convert database type to form type
  function convertDecorationType(type: string): DecorationFormData['type'] {
    return type as DecorationFormData['type']
  }

  const formData: DecorationFormData = {
    name: decoration.name,
    type: convertDecorationType(decoration.type),
    description: decoration.description || undefined,
    color: decoration.color || undefined,
    color_reaction: decoration.color_reaction || undefined,
    cone: decoration.cone || undefined,
    firing_atmosphere: decoration.firing_atmosphere || undefined,
    firing_temperature: decoration.firing_temperature || undefined,
    food_safe: decoration.food_safe || undefined,
    ingredients: jsonToString(decoration.ingredients),
    manufacturer: decoration.manufacturer || undefined,
    surface: decoration.surface || undefined,
    transparency: decoration.transparency || undefined,
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