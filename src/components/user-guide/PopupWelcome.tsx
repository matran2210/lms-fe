import React, { useState } from 'react'
import SappModal from 'src/components/base/modal/SappModal'
import Icon from 'src/components/icons'
import SappButton from '@components/base/button/SappButton'
import { UserGuide } from 'src/constants'
import { useAppDispatch } from 'src/redux/hook'
import { increment } from 'src/redux/slice/Course/UserGuide'

type Props = {}

const PopupWelcome = ({}: Props) => {
  const dispatch = useAppDispatch()
  const handleNextStep = () => {
    dispatch(increment())
  }

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
        overlayClass={'!hidden'}
        isContentFull={true}
        refClass={
          'md:px-6 py-8 flex flex-col animate-jump-in relative transform overflow-hidden bg-white text-left shadow-xl transition-all'
        }
      >
        <div className="p-8 rounded-full bg-secondary flex items-center justify-center w-max mx-auto">
          <Icon type="play-circle-sharp" className="text-primary" />
        </div>
        <h2 className="text-4xl font-bold pt-6 text-bw-1">
          {UserGuide.TITLE_WELCOME}
        </h2>
        <span className="pt-4 text-medium-sm text-gray-1">
          {UserGuide.CONTENT_WELCOME}
        </span>
        <SappButton
          title={UserGuide.CONTENT_BUTTON}
          full={true}
          className="mt-16"
          size="lager"
          onClick={() => handleNextStep()}
        />
      </SappModal>
    </>
  )
}

export default PopupWelcome
