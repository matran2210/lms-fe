import { ArrowLeft } from '@lms/assets'
import { useCourseContext } from '@lms/contexts'
import { IStoryline } from '@lms/core'
import NextStorylineModal from '@lms/feature-courses/src/components/learning/storyline/modal/NextStorylineModal'
import { ButtonPrimary, ButtonText } from '@lms/ui'
import { motion } from 'framer-motion'
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
        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200" fill="none">
          <path d="M80.7045 41.172L90.6586 69.3248C92.9274 75.7471 98.021 80.7906 104.487 83.041L132.869 92.9145C137.703 95.0849 137.703 101.89 132.869 104.06L104.056 114.752C97.8416 117.056 92.9632 121.957 90.7213 128.157L80.7135 155.803C78.5254 160.597 71.6652 160.597 69.4771 155.803L59.5231 127.65C57.2543 121.227 52.1607 116.184 45.6951 113.934L17.3126 104.06C12.4791 101.89 12.4791 95.0849 17.3126 92.9145L45.6951 83.041C52.1697 80.7906 57.2543 75.7382 59.5231 69.3248L69.4771 41.172C71.6652 36.3776 78.5254 36.3776 80.7135 41.172H80.7045Z" fill="#FFB700" />
          <path d="M152.854 15.839L158.826 32.7307C160.189 36.5823 163.238 39.6066 167.121 40.9587L184.15 46.8828C187.047 48.1814 187.047 52.2643 184.15 53.5718L166.861 59.9852C163.13 61.3728 160.207 64.3082 158.862 68.0263L152.854 84.6156C151.544 87.4887 147.428 87.4887 146.11 84.6156L140.137 67.7239C138.774 63.8723 135.725 60.848 131.842 59.4959L114.813 53.5718C111.916 52.2732 111.916 48.1903 114.813 46.8828L131.842 40.9587C135.725 39.6066 138.774 36.5823 140.137 32.7307L146.11 15.839C147.419 12.9659 151.535 12.9659 152.854 15.839Z" fill="#FFB700" />
          <path d="M139.355 126.191L144.421 140.503C145.578 143.767 148.161 146.338 151.452 147.477L165.881 152.502C168.338 153.605 168.338 157.066 165.881 158.169L151.228 163.603C148.062 164.778 145.587 167.268 144.448 170.417L139.355 184.48C138.243 186.917 134.754 186.917 133.642 184.48L128.576 170.168C127.419 166.903 124.836 164.333 121.545 163.194L107.116 158.169C104.659 157.066 104.659 153.605 107.116 152.502L121.545 147.477C124.836 146.329 127.428 143.767 128.576 140.503L133.642 126.191C134.754 123.754 138.243 123.754 139.355 126.191Z" fill="#FFB700" />
        </svg>
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
