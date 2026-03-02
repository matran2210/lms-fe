import { RestartIcon } from '@lms/assets'
import { ButtonPrimary, ButtonText } from '@lms/ui'
import clsx from 'clsx'
import Image from 'next/image'

const StoryFooter = ({ onClick }: { onClick: () => void }) => {
  return (
    <div
      className={clsx(
        'fixed bottom-0 z-[201] flex w-full justify-center border-t border-t-success bg-success-50 px-8 py-6',
      )}
    >
      <div
        className={clsx(
          'mx-auto flex w-full max-w-5xl items-center justify-between',
        )}
      >
        <div className="flex justify-start gap-3">
          <Image
            src="/assets/images/fire.png"
            alt="check"
            width={24}
            height={24}
            className="shrink-0"
          />
          <div className=" text-xl font-semibold leading-7 text-gray-800">
            You have finished this item!
          </div>
        </div>
        <div className="flex items-center justify-start gap-4">
          {/* <ButtonText
            isUnderLine={false}
            size="medium"
            startIcon={<RestartIcon className="h-6 w-6" />}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Redo Item
          </ButtonText> */}
          <ButtonPrimary size="medium" onClick={onClick}>
            Next Item
          </ButtonPrimary>
        </div>
      </div>
    </div>
  )
}

export default StoryFooter
