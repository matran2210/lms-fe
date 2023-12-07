import React, { useState } from 'react'
import SappModal from './SappModal'
import SAPPVideo from '../video/SAPPVideo'
import Image from 'next/image'

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
      >
        {src && <Image height={500} width={500} src={src}></Image>}
      </SappModal>
    </div>
  )
}

export default SappModalImage
