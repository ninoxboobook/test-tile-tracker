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

  const decoration = await prisma.decoration.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
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
    cone: decoration.cone || undefined,
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