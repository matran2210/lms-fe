import { ArrowLeft, ExpandIcon, BlinkStartAnimation } from '@lms/assets'
import { useCourseContext } from '@lms/contexts'
import { IStoryline } from '@lms/core'
import NextStorylineModal from '@lms/feature-courses/src/components/learning/storyline/modal/NextStorylineModal'
import { ButtonPrimary, ButtonText } from '@lms/ui'
import { motion } from 'framer-motion'
import Lottie from 'lottie-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
interface IProps {
  listStorylineData: IStoryline | undefined
}
export default function CompleteStoryline({ listStorylineData }: IProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const class_id = searchParams.get('class_id')
  const course_section_id = searchParams.get('course_section_id')
  const nextActivity = listStorylineData?.next_activity
  const { setOpenPopupCTA, openPopupCTA } = useCourseContext()

  const [open, setOpen] = useState(false)
  const backToCourse = () => {
    router.push(`/courses/${class_id}/section/${course_section_id}`)
  }
  const handleActivityNavigation = () => {
    if (!!nextActivity?.is_preview_locked) {
      // Nếu hoạt động bị khóa, hiển thị popup thông báo
      setOpenPopupCTA({
        lockSection: true,
        ctaUpgrade: false,
        thankYou: false,
        thankYouLater: false,
      })
    } else if (!!nextActivity?.id) {
      // Nếu hoạt động không bị khóa, điều hướng đến hoạt động và ghi nhận sự kiện
      router.push(
        `/courses/${class_id}/activity/${nextActivity?.id}?course_section_id=${course_section_id}`,
      )
    }
  }
  const continueStudy = () => {
    if (!nextActivity) {
      backToCourse()
      return
    }
    switch (listStorylineData?.next_activity?.course_section_type) {
      case 'STORY_LINE':
        setOpen(true)
        break
      case 'ACTIVITY':
        handleActivityNavigation()
        break
      default:
        break
    }
  }
  return (
    <div className="relative flex items-center justify-center overflow-hidden h-screen w-full"
    >
      <div
        className="absolute inset-0 bg-[url('/assets/images/finish_storyline_bg.png')] bg-gray-300 bg-center bg-cover bg-no-repeat opacity-40"
      ></div>
      <div className='m-auto w-full max-w-7xl flex flex-col items-center justify-center mt-[90px]'>

        <div className='flex items-end mb-40'>
          <ExpandIcon
            type="logo-default"
            className={`!opacity-100 h-[75px] w-[64px]`}
          /> <ExpandIcon type="logo-full" className='!opacity-100 w-[85px] h-[54px]' />
        </div>
        <div className="inline-flex flex-col items-center justify-start gap-14 mb-20">
          <Lottie
            animationData={BlinkStartAnimation}
            loop
            autoplay
            className='w-[200px] h-[200px]'
          />
          <div className="justify-start text-center font-['Roboto'] text-4xl font-semibold leading-[50px] text-slate-800">
            Congratulation,
            <br />
            You have finished the Story!
          </div>
        </div>
        <div className="inline-flex w-52 flex-col items-center justify-start gap-4">
          <ButtonPrimary size="medium" onClick={continueStudy}>
            Continue to study
          </ButtonPrimary>
          <ButtonText
            size="medium"
            onClick={backToCourse}
            startIcon={<ArrowLeft />}
          >
            Back to course
          </ButtonText>
        </div>
      </div>

      {open && (
        <NextStorylineModal
          open={open}
          setOpen={setOpen}
          next_activity={listStorylineData?.next_activity}
          course_section_id={course_section_id as string}
        />
      )}
    </div>
  )
}
