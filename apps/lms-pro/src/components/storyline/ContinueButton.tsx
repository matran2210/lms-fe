'use client'
import { ButtonPrimary } from '@lms/ui'
import clsx from 'clsx'

export default function ContinueButton({ onClick }: { onClick: () => void }) {
  return (
    <div className={clsx('flex w-full justify-end')}>
      <ButtonPrimary size="medium" onClick={onClick}>
        Continue
      </ButtonPrimary>
    </div>
  )
}
