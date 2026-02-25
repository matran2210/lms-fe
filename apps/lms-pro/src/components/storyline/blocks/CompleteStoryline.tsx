import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { ButtonPrimary, ButtonText } from '@lms/ui'
import { ArrowLeft, PreviousIcon } from '@lms/assets'
import { motion } from 'framer-motion'
export default function CompleteStoryline() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const class_id = searchParams.get('class_id')
  const course_section_id = searchParams.get('course_section_id')

  const backToCourse = () => {
    router.push(`/courses/${class_id}/section/${course_section_id}`)
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
      className="mx-auto flex h-[calc(100vh-200px)] w-full max-w-7xl flex-col items-center justify-center gap-22 py-22"
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
        <ButtonPrimary size="medium" onClick={backToCourse}>
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
    </motion.div>
  )
}
