// ConfirmDialog.tsx
import ButtonCancelSubmit from '@components/base/button/ButtonCancelSubmit'
import router from 'next/router'
import { FC, useEffect, useRef } from 'react'

// define the props for the confirm dialog component
export type ConfirmDialogProps = {
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
const ConfirmDialog: FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  loading,
  okButtonTitle,
  cancelButtonTitle,
  onCancel,
  onConfirm,
  closeConfirmation,
}) => {
  const confirmDialogRef = useRef<HTMLDivElement>(null)
  const confirmDialogOverLayRef = useRef<HTMLDivElement>(null)
  // define a function to close the popup and reset the state

  const handleClose = () => {
    if (loading) {
      return
    }
    // call the onCancel prop to reset the state
    if (confirmDialogRef.current) {
      confirmDialogRef.current.classList.add('animate-jump-out')
    }
    if (confirmDialogOverLayRef.current) {
      confirmDialogOverLayRef.current.classList.add('animate-fade-out-overlay')
    }
    setTimeout(() => {
      closeConfirmation()
    }, 150)
  }

  const handleCancel = async () => {
    await onCancel()
    handleClose()
  }
  const handleConfirm = async () => {
    await onConfirm()
    handleClose()
  }
  useEffect(() => {
    // on route change start - hide dialog
    if (open) {
      router.events.on('routeChangeComplete', handleClose)
    }
    // unsubscribe from events in useEffect return function
    return () => {
      router.events.off('routeChangeComplete', handleClose)
    }
  }, [open])

  return (
    <>
      {open && (
        // add an onClick handler to the outer div to close the popup when clicking outside
        <div
          className="fixed z-50 w-screen flex justify-center"
          role="dialog"
          aria-modal="true"
        >
          <div
            ref={confirmDialogOverLayRef}
            onClick={handleCancel}
            className="fade-in-overlay fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          ></div>
          <div className="inset-0 z-10 overflow-y-auto mt-5 w-[500px] max-w-full">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-start sm:p-0">
              <div
                ref={confirmDialogRef}
                className="animate-jump-in w-full relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
              >
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
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
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <ButtonCancelSubmit
                    submit={{
                      title: `${okButtonTitle || 'Yes'}`,
                      size: 'small',
                      loading: loading,
                      onClick: handleConfirm,
                    }}
                    cancel={{
                      title: `${cancelButtonTitle || 'No'}`,
                      size: 'small',
                      loading: loading,
                      onClick: handleCancel,
                    }}
                  ></ButtonCancelSubmit>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ConfirmDialog
