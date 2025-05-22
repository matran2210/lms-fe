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
        color="danger-2"
        colorCancel="cancel"
        showHeader={false}
        zIndex="z-[9999999]"
        position="center"
        className="rounded-lg !p-8"
        okButtonClass="rounded-md h-[45px]"
        cancelButtonClass="rounded-md h-[45px]"
      >
        <div className="">
          <div className="flex items-center justify-center">
            <div className="flex h-[100px] w-[100px] items-center justify-center rounded-full bg-secondary">
              <svg
                width="68"
                height="68"
                viewBox="0 0 68 68"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M34 6.375C18.7677 6.375 6.375 18.7677 6.375 34C6.375 49.2323 18.7677 61.625 34 61.625C49.2323 61.625 61.625 49.2323 61.625 34C61.625 18.7677 49.2323 6.375 34 6.375ZM36.6562 48.863H31.3438V43.5505H36.6562V48.863ZM36.125 40.375H31.875L31.0781 19.125H36.9219L36.125 40.375Z"
                  fill="#FFB800"
                />
              </svg>
            </div>
          </div>
          <div className="mb-3 mt-6">
            <p className="text-center text-sm font-medium text-bw-11">
              {message}
            </p>
          </div>
        </div>
      </SappModal>
    </>
  )
}

export default SappConfirmDialog
