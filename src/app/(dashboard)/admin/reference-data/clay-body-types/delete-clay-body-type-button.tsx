'use client'

import { DeleteButton } from '@/components/ui/buttons/delete-button'
import { deleteClayBodyType } from './actions'

interface DeleteClayBodyTypeButtonProps {
  id: string
}

export function DeleteClayBodyTypeButton({ id }: DeleteClayBodyTypeButtonProps) {
  return (
    <DeleteButton
      itemName="Clay Body Type"
      onDelete={async () => {
        const formData = new FormData()
        formData.append('id', id)
        await deleteClayBodyType(formData)
      }}
    />
  )
}
