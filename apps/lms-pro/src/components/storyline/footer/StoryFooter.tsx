import { RestartIcon } from '@lms/assets'
import { ButtonPrimary } from '@lms/ui'
import clsx from 'clsx'

const StoryFooter = ({ onClick }: { onClick: () => void }) => {
  return (
    <div
      className={clsx(
        'fixed bottom-0 flex w-full justify-center border-t border-t-success bg-success-50 px-8 py-6',
      )}
    >
      <div
        className={clsx(
          'mx-auto flex w-full max-w-5xl items-center justify-between',
        )}
      >
        <div className="justify-start text-xl font-semibold leading-7 text-gray-800">
          You have finished this section!
        </div>
        <div className="flex items-center justify-start gap-4">
          <div className="flex items-center justify-center gap-2">
            <RestartIcon className="h-6 w-6" />
            <div className="text-base font-semibold leading-6 text-gray-800">
              Redo Item
            </div>
          </div>
          <ButtonPrimary size="medium" onClick={onClick}>
            Next Item
          </ButtonPrimary>
        </div>
      </div>
    </div>
  )
}

export default StoryFooter
