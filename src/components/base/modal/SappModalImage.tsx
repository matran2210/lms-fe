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
    <SappModalV2
      open={!!src}
      okButtonCaption={'Yes'}
      cancelButtonCaption={'No'}
      handleCancel={handleClose}
      position="center"
      showFooter={false}
      isContentFull={false}
      title=""
      onOk={() => {}}
      classNameModal="sapp-preview--image"
      width="65%"
    >
      <div className="mx-auto w-fit min-w-[100%] max-w-full md:min-h-[350px]">
        {src && (
          <Image
            src={src}
            width="1000"
            height="1000"
            className="h-full max-h-[550px] w-full object-contain md:min-h-[500px] "
            alt={'image'}
            loading={'eager'}
            priority={true}
          />
        )}
      </div>
    </SappModalV2>
  )
}

export default SappModalImage
