'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TrashIcon } from '@heroicons/react/24/outline'
import { Modal } from '@/components/ui/modal'
import { baseButtonStyles, buttonSizes, buttonVariants } from '@/components/ui/buttons/action-button'

interface DeleteButtonProps {
  onDelete: () => Promise<void>
  itemName: string
}

export function DeleteButton({ onDelete, itemName }: DeleteButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await onDelete()
    } catch (error) {
      console.error('Error deleting item:', error)
      // You might want to add error handling UI here
    } finally {
      setIsDeleting(false)
      setIsOpen(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-base font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
      >
        <TrashIcon className="h-4 w-4 mr-2" />
        Delete
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={`Delete ${itemName}`}
      >
        <div className="mt-2">
          <p className="text-base text-clay-800">
            Are you sure you want to delete this {itemName.toLowerCase()}? This action cannot be undone.
          </p>
        </div>

        <div className="mt-4 flex justify-end space-x-3">
          <button
            type="button"
            className= {baseButtonStyles + " " + buttonSizes.default + " " + buttonVariants.secondary }
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className= {baseButtonStyles + " " + buttonSizes.default + " " + buttonVariants.danger }
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </Modal>
    </>
  )
} 