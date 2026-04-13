import { SappModal } from '@lms/ui'
import Image from 'next/image'
import React from 'react'

type Props = {
  src?: string
  setSrc: React.Dispatch<React.SetStateAction<string | undefined>>
}

function SappModalCertificate({ src, setSrc }: Props) {
  const handleClose = () => {
    setSrc(undefined)
  }

  return (
    <div>
      <SappModal
        open={!!src}
        okButtonCaption={'Yes'}
        cancelButtonCaption={'No'}
        handleCancel={handleClose}
        size="max-w-[1144px]"
        position="center"
        showFooter={false}
        isContentFull={false}
        title="Preview image"
        refClass="md:px-6 w-full md:w-fit px-5 py-5 flex flex-col animate-jump-in relative transform overflow-hidden bg-white text-left shadow-xl transition-all"
      >
        <div className="mx-auto w-full min-w-[100%] max-w-full md:min-h-[350px]">
          {src && (
            <Image
              src={src}
              width="500"
              height="1000"
              className="h-full max-h-[800px] w-full object-contain md:min-h-[500px] md:w-auto"
              alt={'image'}
              loading={'eager'}
              priority={true}
            />
          )}
        </div>
      </SappModal>
    </div>
  )
}

export default SappModalCertificate
