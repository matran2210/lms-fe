import React from 'react'
import { Arrows } from '@components/courses/icons'
import clsx from 'clsx'
import { LockClosedIcon } from '@lms/assets'
import { ButtonPrimary, SpinIcon } from '@lms/ui'
import { IButtonNextPrevProps } from '@lms/core'

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
  isLockedNext,
  isLockPrevious,
}: IButtonNextPrevProps) {
  return (
    <div
      className={clsx('flex w-full lg:w-auto lg:justify-end', {
        'justify-end': showNext && !showPrev,
        'justify-between': showNext && showPrev,
        'justify-start': !showNext && showPrev,
      })}
    >
      {showPrev && (
        <button
          className={`mr-4 rounded-md text-center text-[0.875rem] font-medium leading-4 lg:mr-6 ${classNamePrev}`}
          onClick={prevClick}
          disabled={disabled || loading}
        >
          {!loading ? (
            <span className="flex items-center gap-2">
              <Arrows />
              {titlePrev}
              {isLockPrevious ? <LockClosedIcon /> : null}
            </span>
          ) : (
            <>
              <SpinIcon /> Loading...
            </>
          )}
        </button>
      )}

      {showNext && (
        <div className="w-full">
          <ButtonPrimary
            className={classNameNext}
            title={titleNext}
            onClick={nextClick}
            disabled={disabled}
            loading={loading}
            size="medium"
            endIcon={isLockedNext ? <LockClosedIcon /> : null}
          />
        </div>
      )}
    </div>
  )
}
