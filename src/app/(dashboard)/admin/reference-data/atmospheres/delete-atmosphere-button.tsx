'use client'

import { DeleteButton } from '@/components/ui/buttons/delete-button'
import { deleteAtmosphere } from './actions'

interface DeleteAtmosphereButtonProps {
  id: string
}

export function DeleteAtmosphereButton({ id }: DeleteAtmosphereButtonProps) {
  return (
    <DeleteButton
      itemName="Atmosphere"
      onDelete={async () => {
        const formData = new FormData()
        formData.append('id', id)
        await deleteAtmosphere(formData)
      }}
    />
  )
}
