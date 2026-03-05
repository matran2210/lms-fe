import { ArrowLeft } from '@lms/assets'
import { useCourseContext } from '@lms/contexts'
import { IStoryline } from '@lms/core'
import NextStorylineModal from '@lms/feature-courses/src/components/learning/storyline/modal/NextStorylineModal'
import { ButtonPrimary, ButtonText } from '@lms/ui'
import { motion } from 'framer-motion'
import Image from 'next/image'
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
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        duration: 0.6,
        type: 'spring',
        stiffness: 80,
      }}
      className="m-auto flex h-[calc(100vh-100px)] w-full max-w-7xl flex-col items-center justify-center gap-22"
    >
      <div className="inline-flex flex-col items-center justify-start gap-14">
        <Image
          width={176}
          height={176}
          className="h-44 w-44"
          src="/assets/images/ClapIcon.png"
          alt="clap image"
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
      {open && (
        <NextStorylineModal
          open={open}
          setOpen={setOpen}
          next_activity={listStorylineData?.next_activity}
          course_section_id={course_section_id as string}
        />
      )}
    </motion.div>
  )
}
