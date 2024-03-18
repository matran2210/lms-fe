import Image from 'next/future/image'
import React from 'react'
import SappModalV2 from './SappModalV2'

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
      <SappModalV2
        open={!!src}
        okButtonCaption={'Yes'}
        cancelButtonCaption={'No'}
        handleCancel={handleClose}
        size="max-w-xxl"
        position="center"
        showFooter={false}
        isContentFull={false}
        title=""
        onOk={() => {}}
        classNameModal="sapp-preview--image"
      >
        <div className="bg-white md:pb-5 pb-5 relative">
          <div className="flex">
            <div className="text-xl font-bold text-bw-1">Preview image</div>
          </div>
        </div>
        <div className="w-fit max-w-full min-w-[100%] mx-auto md:min-h-[350px]">
          {src && (
            <Image
              src={src}
              width="1000"
              height="1000"
              className="md:w-auto w-auto max-h-[550px] object-contain h-full md:min-h-[500px] "
              alt={'image'}
              loading={'eager'}
              priority={true}
            />
          )}
        </div>
      </SappModalV2>
    </div>
  )
}

export default SappModalImage
