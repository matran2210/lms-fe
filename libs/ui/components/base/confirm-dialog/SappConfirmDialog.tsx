"use client"
// ConfirmDialog.tsx
import { AlertCircleSharp } from '@lms/assets'
import { useFeature } from '@lms/contexts'
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
  const { pathname } = useFeature()
  const handleCancel = async () => {
    onCancel && (await onCancel())
  }
  const handleConfirm = async () => {
    await onConfirm()
  }
  // ✅ Close dialog when route changes
  useEffect(() => {
    if (open) {
      closeConfirmation()
    }
  }, [pathname])

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
        color="okPopup"
        colorCancel="cancelPopup"
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
              <AlertCircleSharp />
            </div>
          </div>
          <div className="mb-3 mt-6">
            <p className="text-center text-sm font-medium text-[#252F4A]">
              {message}
            </p>
          </div>
        </div>
      </SappModal>
    </>
  )
}

export default SappConfirmDialog
