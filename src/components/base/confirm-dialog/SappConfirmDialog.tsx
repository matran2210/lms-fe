// ConfirmDialog.tsx
import router from 'next/router'
import { FC, useEffect } from 'react'
import SappModal from '../modal/SappModal'

// define the props for the confirm dialog component
export type SappConfirmDialogProps = {
  open: boolean
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
  message,
  okButtonTitle,
  cancelButtonTitle,
  onCancel,
  onConfirm,
  closeConfirmation,
}) => {
  const handleCancel = async () => {
    onCancel && (await onCancel())
  }
  const handleConfirm = async () => {
    await onConfirm()
  }
  useEffect(() => {
    // on route change start - hide dialog
    if (open) {
      router.events.on('routeChangeComplete', closeConfirmation)
    } else {
      router.events.off('routeChangeComplete', closeConfirmation)
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
        setOpen={closeConfirmation}
        // refClass="md:p-8 p-5 flex flex-col animate-jump-in relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8"
        footerButtonClassName="justify-center flex flex-row-reverse gap-4"
        color="danger"
        showHeader={false}
        zIndex="z-[9999999]"
        position="center"
      >
        <div className="">
          <div className="mx-auto mb-7 flex w-fit h-fit flex-shrink-0 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-[100px] w-[100px] text-state-error"
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
          <div className="mt-3 text-center">
            <h3
              className="text-base font-semibold leading-6 text-gray-900"
              id="modal-title"
            ></h3>
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
