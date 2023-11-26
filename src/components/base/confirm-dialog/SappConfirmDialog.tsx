// ConfirmDialog.tsx
import { FC, useEffect } from 'react'
import SappModal from '../modal/SappModal'
import router from 'next/router'

// define the props for the confirm dialog component
export type SappConfirmDialogProps = {
  open: boolean
  title?: string
  message: string
  loading?: boolean
  cancelButtonTitle?: string
  okButtonTitle?: string
  onCancel: () => Promise<void> | void
  onConfirm: () => Promise<void> | void
  closeConfirmation: () => any
}

// create the confirm dialog component
const SappConfirmDialog: FC<SappConfirmDialogProps> = ({
  open,
  title,
  message,
  okButtonTitle,
  cancelButtonTitle,
  onCancel,
  onConfirm,
  closeConfirmation,
}) => {
  const handleCancel = async () => {
    onCancel && (await onCancel())
    closeConfirmation()
  }
  const handleConfirm = async () => {
    await onConfirm()
    closeConfirmation()
  }

  useEffect(() => {
    // on route change start - hide dialog
    if (open) {
      router.events.on('routeChangeComplete', closeConfirmation)
    }
    // unsubscribe from events in useEffect return function
    return () => {
      router.events.off('routeChangeComplete', closeConfirmation)
    }
  }, [open])

  return (
    <>
      <SappModal
        open={open}
        okButtonCaption={okButtonTitle || 'Yes'}
        cancelButtonCaption={cancelButtonTitle || 'No'}
        handleCancel={handleCancel}
        handleSubmit={handleConfirm}
        title={''}
      >
        <div className="sm:flex sm:items-start">
          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
            <svg
              className="h-6 w-6 text-state-error"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
          <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
            <h3
              className="text-base font-semibold leading-6 text-gray-900"
              id="modal-title"
            >
              {title || 'Warning!'}
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">{message}</p>
            </div>
          </div>
        </div>
      </SappModal>
    </>
  )
}

export default SappConfirmDialog
