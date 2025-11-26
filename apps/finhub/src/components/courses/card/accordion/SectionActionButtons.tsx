import React, { useMemo } from 'react'
import { ICourseSectionButtonProps } from 'src/type/courses-3-level'
import { useRouter } from 'next/router'
import { TEST_TYPE_ENUM } from '@lms/core'
import { ButtonPrimary, ButtonSecondary, ButtonText } from '@lms/ui'

export default function SectionActionButtons({
  section,
  class_user_id,
  setOpenTest,
}: ICourseSectionButtonProps) {
  const router = useRouter()
  const courseId = router.query.courseId
  const checkFinished = useMemo(() => {
    if (section?.quiz?.attempt) {
      return true
    }
    return false
  }, [section?.quiz?.attempt])

  if (
    !checkFinished &&
    (section?.course_section_type == TEST_TYPE_ENUM.FINAL_TEST ||
      section?.course_section_type == TEST_TYPE_ENUM.MID_TERM_TEST)
  ) {
    return (
      <ButtonSecondary
        title={'Start'}
        full={false}
        size="medium"
        onClick={(e) => {
          e.stopPropagation()
          setOpenTest(true)
        }}
      />
    )
  }

  if (
    checkFinished &&
    (section?.course_section_type == TEST_TYPE_ENUM.FINAL_TEST ||
      section?.course_section_type == TEST_TYPE_ENUM.MID_TERM_TEST)
  ) {
    return (
      <div className="flex items-center justify-end gap-4">
        <ButtonText
          size="medium"
          onClick={() => {
            router.push(
              `/short-course/test-result/${section?.quiz?.attempt?.id}`,
            )
          }}
          title={'Result'}
        />
        <ButtonPrimary
          title={'Retake'}
          full={false}
          size="medium"
          onClick={(e) => {
            e.stopPropagation()
            setOpenTest(true)
          }}
        />
      </div>
    )
  }

  return null
}
