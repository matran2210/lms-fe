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
        showHeader={false}
      >
        <div className="w-[600px] max-w-full h-full">
          {src && (
            <Image
              src={src}
              width="0"
              height="800"
              sizes="100%"
              className="w-fit h-full"
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
