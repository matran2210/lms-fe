import React, { useState } from 'react'
import SappModal from 'src/components/base/modal/SappModal'
import SappButton from '@components/base/button/SappButton'
import ButtonText from '@components/base/button/ButtonText'
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
        size="max-w-sm"
        position="center"
        showHeader={false}
        showFooter={false}
        childClass={'text-start'}
        overlayClass={'!opacity-55'}
        isContentFull={true}
        refClass={
          'p-7 flex flex-col animate-jump-in relative transform overflow-hidden bg-primary text-left shadow-xl transition-all'
        }
        parentChildClass={'!bg-primary'}
      >
        <span className="text-base font-normal text-white">{content}</span>
        <div className="flex items-center justify-between mt-5">
          <div className="text-white text-medium-sm font-normal">
            {index}/{total}
          </div>
          <div className="flex">
            <SappButton
              title={'Exit'}
              className="px-5 py-2"
              size="small"
              isPadding={false}
              childClass="text-medium-sm"
              onClick={handleNext}
            />
            <SappButton
              title={'Next'}
              className="bg-primary-3 px-5 py-2 ml-3"
              size="small"
              isPadding={false}
              childClass="text-medium-sm"
              onClick={handleNext}
            />
          </div>
        </div>
      </SappModal>
    </>
  )
}

export default PopupStep
