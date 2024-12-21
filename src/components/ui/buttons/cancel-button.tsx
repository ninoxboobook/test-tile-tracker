'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ActionButton, ActionButtonProps } from './action-button'
import { Dialog } from '../dialog'

interface CancelButtonProps extends Omit<ActionButtonProps, 'variant'> {
  /**
   * Function to check if there are unsaved changes
   * Should return true if there are unsaved changes
   */
  hasUnsavedChanges: () => boolean
  /**
   * Optional route to navigate to
   * If not provided, will navigate to previous page
   */
  route?: string
  /**
   * Optional dialog title
   * @default "Discard changes?"
   */
  dialogTitle?: string
  /**
   * Optional dialog description
   * @default "Any unsaved changes will be lost."
   */
  dialogDescription?: string
}

export function CancelButton({
  hasUnsavedChanges,
  route,
  dialogTitle = 'Discard changes?',
  dialogDescription = 'Any unsaved changes will be lost.',
  children = 'Cancel',
  ...props
}: CancelButtonProps) {
  const router = useRouter()
  const [showDialog, setShowDialog] = useState(false)

  const handleCancel = () => {
    if (hasUnsavedChanges()) {
      setShowDialog(true)
    } else {
      route ? router.push(route) : router.back()
    }
  }

  const handleConfirm = () => {
    setShowDialog(false)
    route ? router.push(route) : router.back()
  }

  return (
    <>
      <ActionButton variant="secondary" onClick={handleCancel} {...props}>
        {children}
      </ActionButton>

      <Dialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        title={dialogTitle}
        description={dialogDescription}
        confirmLabel="Discard"
        onConfirm={handleConfirm}
      />
    </>
  )
}
