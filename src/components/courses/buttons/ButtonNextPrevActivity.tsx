import React from 'react'
import { Arrows, SpinIcon } from '@components/courses/icons'
import { IButtonNextPrevProps } from 'src/type/courses-3-level/button'
import BaseButtonIconFlip from '@components/courses/buttons/BaseButtonIconFlip'
import ButtonPrimaryV2 from '@components/base/button/ButtonPrimaryV2'

export default function NextPrevActivityButton({
  nextClick,
  prevClick,
  titlePrev,
  titleNext,
  disabled,
  showNext = true,
  showPrev = true,
  loading,
  classNameNext,
  classNamePrev,
}: IButtonNextPrevProps) {
  return (
    <div className="flex w-full justify-between lg:w-auto lg:justify-end">
      {showPrev && (
        <button
          className={`mr-4 rounded-md text-center text-[0.875rem] font-medium leading-4 lg:mr-6 ${classNamePrev}`}
          onClick={prevClick}
          disabled={disabled || loading}
        >
          {!loading ? (
            <span className="flex gap-3">
              <Arrows />
              {titlePrev}
            </span>
          ) : (
            <>
              <SpinIcon /> Loading...
            </>
          )}
        </button>
      )}

      {showNext && (
        <div className="w-100">
          <ButtonPrimaryV2
            className={classNameNext}
            title={titleNext}
            onClick={nextClick}
            disabled={disabled}
            loading={loading}
            size="small"
          />
        </div>
      )}
    </div>
  )
}
