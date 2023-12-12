import React, { useState } from 'react'
import SappModal from 'src/components/base/modal/SappModal'
import SappButton from '@components/base/button/SappButton'
import { UserGuide } from 'src/constants'

type Props = {
  content: string
  index: number
  total: number
  handleNext: () => void
  showCancel?: boolean
}

const PopupStep = ({
  content,
  index,
  total,
  handleNext,
  showCancel = true,
}: Props) => {
  return (
    <>
      <SappModal
        open={true}
        okButtonCaption={'Yes'}
        cancelButtonCaption={'No'}
        size="max-w-dl"
        position="center"
        showHeader={false}
        showFooter={false}
        childClass={'text-center py-12 px-14'}
        overlayClass={'!opacity-55'}
        isContentFull={true}
      >
        <span className="pt-4 text-medium-sm text-gray-1">{content}</span>
        <div className="flex">
          <div>
            {index}/{total}
          </div>
          <div></div>
        </div>
        <SappButton
          title={'asdasd'}
          full={true}
          className="mt-16"
          size="lager"
          onClick={handleNext}
        />
      </SappModal>
    </>
  )
}

export default PopupStep
