import Image from 'next/image'
import React, { PropsWithChildren } from 'react'
import SappModalV2 from './SappModalV2'

type Props = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function PreviewImageModal({ open, setOpen, children }: PropsWithChildren<Props>) {
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <SappModalV2
      open={open}
      handleCancel={handleClose}
      position="center"
      showFooter={false}
      isContentFull={false}
      title="Preview Image"
      onOk={() => undefined}
      classNameModal="sapp-preview--certificate"
      closeIcon
    >
      <div className="mx-auto w-fit min-w-[100%] max-w-full md:min-h-[350px]">
        {children}
      </div>
    </SappModalV2>
  )
}

export default PreviewImageModal
