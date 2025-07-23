import React, { useMemo } from 'react'
import { ICourseSectionButtonProps } from 'src/type/courses-3-level'
import BaseButton from '@components/courses/buttons/BaseButton'
import { useRouter } from 'next/router'
import { ROUTES } from 'src/constants'
import { TEST_TYPE_ENUM } from '@utils/constants'
import ButtonIcon from '@components/courses/buttons/ButtonIcon'

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
      <BaseButton
        variant="secondary"
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
      <div className="flex justify-end gap-4">
        <ButtonIcon
          className="text-base font-medium text-bw-15 hover:underline"
          onClick={() => {
            router.push(
              `/short-course/test-result/${section?.quiz?.attempt?.id}`,
            )
          }}
          title={'Results'}
        />
        <BaseButton
          variant="primary"
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
