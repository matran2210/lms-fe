import React, { useState, useRef } from 'react'
import SappButton from '@components/base/button/SappButton'
import ButtonText from '@components/base/button/ButtonText'

type Props = {
  content: string
  index: number
  total: number
  handleNext?: () => void
  handleCancel?: () => void
  showCancel?: boolean
  className?: string
  titleButtonNext?: string
}

const PopupStep = ({
  content,
  index,
  total,
  handleNext,
  handleCancel,
  showCancel = true,
  className = 'top-0 left-0',
  titleButtonNext,
}: Props) => {
  const confirmDialogRef = useRef<HTMLDivElement>(null)

  const handleClose = () => {
    if (confirmDialogRef.current) {
      confirmDialogRef.current.classList.add('animate-jump-out')
      confirmDialogRef.current.classList.add('pointer-events-none')
    }
    // Remove hidden scroll when close user guide
    document.body.style.removeProperty('padding-right')
    document.body.classList.remove('overflow-hidden')
    setTimeout(() => {
      handleCancel && handleCancel()
    }, 50)
  }

  return (
    <>
      <div
        ref={confirmDialogRef}
        className={`animate-jump-in bg-primary p-7.5 absolute z-50 ${className}`}
      >
        <span className="text-base font-normal text-white">{content}</span>
        <div className="flex items-center justify-between mt-5">
          <div className="text-white text-medium-sm font-normal">
            {index}/{total}
          </div>
          <div className="flex">
            {showCancel && (
              <SappButton
                title={'Exit'}
                className="px-5 py-2"
                size="small"
                isPadding={false}
                childClass="text-medium-sm"
                onClick={handleClose}
              />
            )}
            <SappButton
              title={titleButtonNext ? titleButtonNext : 'Next'}
              className="bg-primary-3 px-5 py-2 ml-3"
              size="small"
              isPadding={false}
              childClass="text-medium-sm"
              onClick={handleNext}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default PopupStep
