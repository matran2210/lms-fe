import PinnedNotificationsV2 from '@components/layout/PinnedNotifications/PinnedNotificationsV2'
import React from 'react'
import continue_learning from '@assets/images/book-continue-learning.svg'
import Image from 'next/image'
import { PageLink } from 'src/constants'
import { useRouter } from 'next/router'
import { ArrowRightV2Icon } from '@assets/icons'

const ContinueLearning = () => {
  const router = useRouter()
  const goToCourseContent = () => {
    router.push(
      PageLink.COURSE_DETAIL.replace(
        '[courseId]',
        router.query.courseId as string,
      ),
    )
  }

  return (
    <div className="z-2 sticky inset-x-0 bottom-4">
      <div className="flex w-full flex-col gap-4">
        <PinnedNotificationsV2
          bgColor="bg-primary-200"
          borderColor="border-primary"
          classPinned="bottom-5 flex flex-col gap-0 md:flex-row md:items-center md:justify-between md:gap-4"
        >
          {/* Nội dung chính bên trái */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Hình ảnh */}
            <div className="h-6 w-6 md:size-10">
              <Image src={continue_learning} alt="pinned-completed-course" />
            </div>

            {/* Text */}
            <div className="flex flex-col">
              <div className="text-base font-semibold text-gray-800 md:text-xl">
                Continue your learning journey!
              </div>

              {/* Desktop text */}
              <div className="hidden text-base text-gray-800 md:block">
                <InstructionText onClick={() => goToCourseContent()} />
              </div>
            </div>
          </div>

          {/* Mobile text */}
          <div className="mt-2 block text-sm text-gray-800 md:hidden">
            <InstructionText onClick={() => goToCourseContent()} />
          </div>

          {/* Link bên phải */}
          <div
            className="mt-2 hidden cursor-pointer items-center justify-start gap-2 md:mt-0 lg:flex lg:justify-end"
            onClick={() => goToCourseContent()}
          >
            <span className="text-red-800 text-sm font-semibold underline md:text-base">
              Course Content
            </span>
            <ArrowRightV2Icon />
          </div>
        </PinnedNotificationsV2>
      </div>
    </div>
  )
}

const InstructionText = ({ onClick }: { onClick: () => void }) => (
  <>
    <span className="font-normal">Click on</span>{' '}
    <span className="cursor-pointer font-semibold underline" onClick={onClick}>
      Course Content
    </span>{' '}
    <span className="font-normal">to resume your lessons.</span>
  </>
)

export default ContinueLearning
