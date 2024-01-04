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
      >
        <div className="min-w-[100px] w-fit max-w-full  mx-auto">
          {src && (
            <Image
              src={src}
              width="0"
              height="0"
              sizes="100%"
              className="w-fit max-h-[500px] h-auto"
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
