import React from 'react'
import { Arrows, SpinIcon } from '@components/courses/icons'
import { IButtonNextPrevProps } from 'src/type/courses-3-level/button'
import BaseButtonIconFlip from '@components/courses/buttons/BaseButtonIconFlip'

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
    <div className="flex w-full justify-between lg:w-auto lg:justify-start">
      {showPrev && (
        <button
          className={`mr-4 rounded-md text-center text-[0.875rem] font-medium leading-4 ${classNamePrev}`}
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
          <BaseButtonIconFlip
            className={classNameNext}
            variant="primary"
            title={titleNext}
            onClick={nextClick}
            disabled={disabled}
            loading={loading}
            size="small"
            icon={<Arrows />}
          />
        </div>
      )}
    </div>
  )
}
