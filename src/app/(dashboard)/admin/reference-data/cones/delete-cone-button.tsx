'use client'

import { DeleteButton } from '@/components/ui/buttons/delete-button'
import { deleteCone } from './actions'

interface DeleteConeButtonProps {
  id: string
}

export function DeleteConeButton({ id }: DeleteConeButtonProps) {
  return (
    <DeleteButton
      itemName="Cone"
      onDelete={async () => {
        const formData = new FormData()
        formData.append('id', id)
        await deleteCone(formData)
      }}
    />
  )
}
