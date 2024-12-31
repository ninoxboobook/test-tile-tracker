'use client'

import { DeleteButton } from '@/components/ui/buttons/delete-button'
import { deleteDecorationType } from './actions'

interface DeleteDecorationTypeButtonProps {
  id: string
}

export function DeleteDecorationTypeButton({ id }: DeleteDecorationTypeButtonProps) {
  return (
    <DeleteButton
      itemName="Decoration Type"
      onDelete={async () => {
        const formData = new FormData()
        formData.append('id', id)
        await deleteDecorationType(formData)
      }}
    />
  )
}
