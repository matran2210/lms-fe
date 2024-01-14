import Image from 'next/future/image'
import React from 'react'
import SappModal from './SappModal'

type Props = {
  src?: string
  setSrc: React.Dispatch<React.SetStateAction<string | undefined>>
}

function SappModalImage({ src, setSrc }: Props) {
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
        size="max-w-xxl"
        position="center"
        showFooter={false}
        isContentFull={false}
        title="Preview image"
        refClass="md:px-6 w-full md:w-fit px-5 py-5 flex flex-col animate-jump-in relative transform overflow-hidden bg-white text-left shadow-xl transition-all"
      >
        <div className="w-full max-w-full min-w-[100%] mx-auto md:min-h-[350px]">
          {src && (
            <Image
              src={src}
              width="1000"
              height="1000"
              className="md:w-auto w-full max-h-[800px] object-contain h-full md:min-h-[500px]"
              alt={'image'}
              loading={'eager'}
            />
          )}
        </div>
      </SappModal>
    </div>
  )
}

export default SappModalImage
