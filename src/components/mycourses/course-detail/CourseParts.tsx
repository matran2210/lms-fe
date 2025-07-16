import React, { useEffect, useRef } from 'react'
import Part from './Part'
import PartMiddleTest from './PartFailed'
import { ANIMATION, TEST_TYPE } from 'src/constants'
import { IMyCourseDetail } from 'src/type/courses'
import { isEmpty } from 'lodash'
import NoData from 'src/common/NoData'
import { useRouter } from 'next/router'
import { Badge, Divider, Tag } from 'antd'
import dayjs from 'dayjs'
import clsx from 'clsx'
import { CourseSectionType } from '@utils/constants'

const CourseParts = ({
  courses,
  class_user_id,
  is_passed_course,
  lastElementRef,
}: {
  courses: IMyCourseDetail[] | undefined
  class_user_id?: string
  is_passed_course: boolean
  lastElementRef: (node: HTMLDivElement) => void
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

  const renderContent = () => {
    const focusSectionIds = router?.query?.focusSectionIds as string | undefined
    const focusSubSectionIds = router?.query?.focusSubSectionIds as
      | string
      | undefined
    const focusUnitIds = router?.query?.focusUnitIds as string | undefined
    const deadline = router?.query?.deadline as string | undefined
    const listFocusSectionIds = focusSectionIds?.split(',') || []
    const isOverdue = dayjs(deadline).isBefore(new Date())
    if (isEmpty(courses)) {
      return (
        <div className="flex min-h-[calc(100vh-15rem)] items-center justify-center">
          <NoData />
        </div>
      )
    }

    if (isEmpty(listFocusSectionIds) || isOverdue)
      return (
        <div className={'mb-10 grid gap-6 md:grid-cols-2 2xl:grid-cols-3'}>
          {courses?.map((coursePart, index: number) => {
            const content = (
              <div
                key={coursePart?.id}
                ref={(el) => (cardRefs.current[coursePart.id] = el)}
              >
                {router?.query?.focus_id === coursePart.id ? (
                  <div
                    className={`item card active-section aspect-h-16 relative flex h-[412px] flex-col justify-between bg-white p-[30px] shadow-sidebar`}
                    data-aos={ANIMATION.DATA_AOS}
                    style={{ zIndex: courses?.length - index }}
                    ref={lastElementRef}
                  >
                    {[
                      TEST_TYPE.MID_TERM_TEST,
                      TEST_TYPE.FINAL_TEST,
                      TEST_TYPE.MOCK_TEST,
                    ].includes(coursePart?.course_section_type as TEST_TYPE) ? (
                      <PartMiddleTest
                        key={index}
                        coursePart={coursePart}
                        is_passed_course={is_passed_course}
                        class_user_id={class_user_id}
                      />
                    ) : (
                      <Part key={index} course={coursePart} />
                    )}
                  </div>
                ) : (
                  <div
                    key={coursePart?.id}
                    className={`item aspect-h-16 relative flex h-[412px] flex-col justify-between bg-white p-[30px] shadow-sidebar`}
                    ref={lastElementRef}
                    data-aos={ANIMATION.DATA_AOS}
                    style={{ zIndex: courses?.length - index }}
                  >
                    {[
                      TEST_TYPE.MID_TERM_TEST,
                      TEST_TYPE.FINAL_TEST,
                      TEST_TYPE.MOCK_TEST,
                    ].includes(coursePart?.course_section_type as TEST_TYPE) ? (
                      <PartMiddleTest
                        key={index}
                        coursePart={coursePart}
                        is_passed_course={is_passed_course}
                        class_user_id={class_user_id}
                      />
                    ) : (
                      <Part key={index} course={coursePart} />
                    )}
                  </div>
                )}
              </div>
            )

            return content
          })}
        </div>
      )

    const listCourseSectionFocus = (courses || []).filter(
      (course) =>
        listFocusSectionIds.includes(course.id) &&
        course.course_section_type !== TEST_TYPE.MOCK_TEST,
    )
    const listCourseSectionOther = (courses || []).filter(
      (course) =>
        !listFocusSectionIds.includes(course.id) ||
        course.course_section_type === TEST_TYPE.MOCK_TEST,
    )
    const hasFoscusSection =
      listCourseSectionFocus &&
      listCourseSectionFocus.length > 0 &&
      listCourseSectionFocus.some(
        (course) => course.course_section_type === CourseSectionType.PART,
      )
    const hasFoscusTest =
      listCourseSectionFocus &&
      listCourseSectionFocus.length > 0 &&
      listCourseSectionFocus.some((course) =>
        [TEST_TYPE.MID_TERM_TEST, TEST_TYPE.FINAL_TEST].includes(
          course.course_section_type as TEST_TYPE,
        ),
      )
    return (
      <div className={'mb-10'}>
        {listCourseSectionFocus && listCourseSectionFocus.length > 0 && (
          <div className="mb-6 flex items-center gap-3">
            {hasFoscusSection && (
              <Tag className="px-3 py-2" closable>
                Today Class{' '}
              </Tag>
            )}
            {hasFoscusTest && (
              <Tag className="px-3 py-2" closable>
                Today Exam{' '}
              </Tag>
            )}
          </div>
        )}
        <div className={'grid gap-6 md:grid-cols-2 2xl:grid-cols-3'}>
          {listCourseSectionFocus.map((coursePart, index: number) => {
            const content = (
              <div
                key={coursePart?.id}
                ref={(el) => (cardRefs.current[coursePart.id] = el)}
              >
                <div
                  key={coursePart?.id}
                  className={`item aspect-h-16 relative flex h-[412px] flex-col justify-between border-2 border-[#3E97FF] bg-white p-[30px] shadow-focus`}
                  ref={lastElementRef}
                  data-aos={ANIMATION.DATA_AOS}
                  style={{ zIndex: listCourseSectionFocus?.length - index }}
                >
                  {[
                    TEST_TYPE.MID_TERM_TEST,
                    TEST_TYPE.FINAL_TEST,
                    TEST_TYPE.MOCK_TEST,
                  ].includes(coursePart?.course_section_type as TEST_TYPE) ? (
                    <PartMiddleTest
                      key={index}
                      coursePart={coursePart}
                      is_passed_course={is_passed_course}
                      class_user_id={class_user_id}
                    />
                  ) : (
                    <Part
                      key={index}
                      course={coursePart}
                      focusSubSectionIds={focusSubSectionIds}
                      focusUnitIds={focusUnitIds}
                      deadline={deadline}
                    />
                  )}
                </div>
              </div>
            )

            return (
              <Badge.Ribbon
                text={`Today Section`}
                key={coursePart?.id}
                color="#3E97FF"
                className="top-0 z-10 flex h-6 flex-col justify-end font-medium"
              >
                {content}
              </Badge.Ribbon>
            )
          })}
        </div>

        {listCourseSectionFocus.length > 0 && <Divider className="my-10" />}
        <div className={'grid gap-6 md:grid-cols-2 2xl:grid-cols-3'}>
          {listCourseSectionOther?.map((coursePart, index: number) => {
            return (
              <div
                key={coursePart?.id}
                ref={(el) => (cardRefs.current[coursePart.id] = el)}
              >
                <div
                  key={coursePart?.id}
                  className={`item aspect-h-16 relative flex h-[412px] flex-col justify-between bg-white p-[30px] shadow-sidebar`}
                  ref={lastElementRef}
                  data-aos={ANIMATION.DATA_AOS}
                  style={{ zIndex: listCourseSectionOther?.length - index }}
                >
                  {[
                    TEST_TYPE.MID_TERM_TEST,
                    TEST_TYPE.FINAL_TEST,
                    TEST_TYPE.MOCK_TEST,
                  ].includes(coursePart?.course_section_type as TEST_TYPE) ? (
                    <PartMiddleTest
                      key={index}
                      coursePart={coursePart}
                      is_passed_course={is_passed_course}
                      class_user_id={class_user_id}
                    />
                  ) : (
                    <Part key={index} course={coursePart} />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
  return <div>{renderContent()}</div>
}

export default CourseParts
