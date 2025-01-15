'use client'

import { Fragment } from 'react'
import { Dialog as HeadlessDialog, Transition } from '@headlessui/react'
import { ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/solid'
import { ActionButton } from './buttons/action-button'

interface DialogProps {
  open: boolean
  onClose: () => void
  variant?: 'danger' | 'info'
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
}

export function Dialog({
  open,
  onClose,
  variant = 'danger',
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
}: DialogProps) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <HeadlessDialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-clay-900 bg-opacity-30 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <HeadlessDialog.Panel className={`relative transform overflow-hidden rounded-lg bg-sand-light border-t-4 ${variant === 'danger' ? 'border-red-600' : 'border-blue-600'} px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-6`}>
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  {variant === 'danger' ? <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" /> : <InformationCircleIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />}
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mt-4">
                    <HeadlessDialog.Title as="h3" className="text-xl font-display font-semibold text-clay-800">
                      {title}
                    </HeadlessDialog.Title>
                    <div className="mt-2">
                      <p className="text-clay-900">
                        {description}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-8 sm:flex sm:flex-row-reverse gap-3">
                  <ActionButton variant={variant === 'danger' ? 'danger' : 'primary'} onClick={onConfirm}>
                    {confirmLabel}
                  </ActionButton>
                  <ActionButton variant="secondary" onClick={onClose}>
                    {cancelLabel}
                  </ActionButton>
                </div>
              </HeadlessDialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </HeadlessDialog>
    </Transition.Root>
  )
}
