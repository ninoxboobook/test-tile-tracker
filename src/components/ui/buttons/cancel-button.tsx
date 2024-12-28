'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ActionButton, ActionButtonProps } from './action-button'
import { Dialog } from '../dialog'

interface CancelButtonProps extends Omit<ActionButtonProps, 'variant' | 'onClick'> {
  /**
   * Function to check if there are unsaved changes
   * Should return true if there are unsaved changes
   */
  hasUnsavedChanges: () => boolean
  /**
   * Function to call when cancel is confirmed
   * This will be called either when there are no unsaved changes,
   * or after the user confirms discarding changes
   */
  onCancel: () => void
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
  onCancel,
  dialogTitle = 'Discard changes?',
  dialogDescription = 'Any unsaved changes will be lost.',
  children = 'Cancel',
  ...props
}: CancelButtonProps) {
  const [showDialog, setShowDialog] = useState(false)

  const handleCancel = (e?: React.MouseEvent) => {
    e?.preventDefault()
    if (hasUnsavedChanges()) {
      setShowDialog(true)
    } else {
      onCancel()
    }
  }

  const handleConfirm = () => {
    setShowDialog(false)
    onCancel()
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
