import React, { useEffect, useRef } from 'react'
import Part from './Part'
import PartMiddleTest from './PartFailed'
import { ANIMATION, TEST_TYPE } from 'src/constants'
import { IMyCourseDetail } from 'src/type/courses'
import { isEmpty } from 'lodash'
import NoData from 'src/common/NoData'
import { useRouter } from 'next/router'
import clsx from 'clsx'

const CourseParts = ({
  courses,
  class_user_id,
  is_passed_course,
  lastElementRef,
  isTrial = false,
}: {
  courses: IMyCourseDetail[] | undefined
  class_user_id?: string
  is_passed_course: boolean
  lastElementRef: (node: HTMLDivElement) => void
  isTrial?: boolean
}) => {
  const router = useRouter()

  const cardRefs = useRef<any>([]) // Để lưu ref của các thẻ card

  // Scroll đến phần tử có id khớp với router.query.type
  useEffect(() => {
    const courseId = router.query.focus_id as string // Chuyển đổi giá trị query thành số (giả sử id là số)
    const selectedCard = cardRefs.current[courseId]
    if (selectedCard) {
      selectedCard.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [router?.query?.focus_id])

  return (
    <div
      className={`${
        isEmpty(courses)
          ? 'flex min-h-[calc(100vh-15rem)] items-center justify-center'
          : 'mb-10 grid gap-6 md:grid-cols-2 2xl:grid-cols-3'
      }`}
    >
      {!isEmpty(courses) ? (
        courses?.map((coursePart, index) => {
          const isFocused = router?.query?.focus_id === coursePart?.id
          const isMiddleTest = [
            TEST_TYPE.MID_TERM_TEST,
            TEST_TYPE.FINAL_TEST,
            TEST_TYPE.MOCK_TEST,
          ].includes(coursePart?.course_section_type as TEST_TYPE)

          const content = isMiddleTest ? (
            <PartMiddleTest
              coursePart={coursePart}
              is_passed_course={is_passed_course}
              class_user_id={class_user_id}
            />
          ) : (
            <Part course={coursePart} />
          )

          const cardClass = clsx(
            'item aspect-h-16 relative flex h-[412px] flex-col justify-between bg-white shadow-sidebar rounded-xl lg:p-8 md:p-6',
            {
              'p-[32px]': isFocused,
              'card active-section': isFocused,
            },
          )

          return (
            <div
              key={coursePart?.id}
              ref={(el) => (cardRefs.current[coursePart.id] = el)}
            >
              <div
                className={cardClass}
                ref={lastElementRef}
                data-aos={ANIMATION.DATA_AOS}
                style={{ zIndex: courses.length - index }}
              >
                {content}
              </div>
            </div>
          )
        })
      ) : (
        <NoData />
      )}
    </div>
  )
}

export default CourseParts
