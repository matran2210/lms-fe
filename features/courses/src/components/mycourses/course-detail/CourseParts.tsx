import { CourseSectionType } from '@lms/core'
import { Badge, Divider, Tag } from 'antd'
import dayjs from 'dayjs'
import { isEmpty } from 'lodash'
import { useEffect, useRef } from 'react'
import { TEST_TYPE } from '@lms/core'
import { IMyCourseDetail } from '@lms/core'
import Part from './Part'
import PartMiddleTest from './PartFailed'
import {NoCoursesAvailable} from '@lms/ui'
import { useFeature } from '@lms/contexts'

const CourseParts = ({
  courses,
  class_user_id,
  is_passed_course,
  lastElementRef,
  isTrial = false,
  isTeacher = false,
  hasCertificate = false,
}: {
  courses: IMyCourseDetail[] | undefined
  class_user_id?: string
  is_passed_course: boolean
  lastElementRef: (node: HTMLDivElement) => void
  isTrial?: boolean
  isTeacher?: boolean
  hasCertificate?: boolean
}) => {
  const {router, query} = useFeature()
  const cardRefs = useRef<any>([]) // Để lưu ref của các thẻ card
  const handleLock = (coursePart: IMyCourseDetail) => {
    return !!(
      coursePart?.course_section_link_parents?.[0]?.is_preview_locked ||
      coursePart?.course_section_link_parents?.[0]?.is_showing_locked
    )
  }

  // Scroll đến phần tử có id khớp với router.query.type
  useEffect(() => {
    const courseId = query.focus_id as string // Chuyển đổi giá trị query thành số (giả sử id là số)
    const selectedCard = cardRefs.current[courseId]
    if (selectedCard) {
      selectedCard.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [query?.focus_id])

  const renderContent = () => {
    const focusSectionIds = query?.focusSectionIds as string | undefined
    const focusSubSectionIds = query?.focusSubSectionIds as
      | string
      | undefined
    const focusUnitIds = query?.focusUnitIds as string | undefined
    const deadline = query?.deadline as string | undefined
    const listFocusSectionIds = focusSectionIds?.split(',') || []
    const isOverdue = dayjs(deadline).isBefore(new Date())
    if (isEmpty(courses)) {
      return (
        <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center">
          <NoCoursesAvailable />
        </div>
      )
    }

    if (isEmpty(listFocusSectionIds) || isOverdue)
      return (
        <div
          className={'mb-10 grid gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-3'}
        >
          {courses?.map((coursePart, index: number) => {
            const content = (
              <div
                key={coursePart?.id}
                ref={(el) => (cardRefs.current[coursePart.id] = el)}
              >
                {query?.focus_id === coursePart.id ? (
                  <>
                    {' '}
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
                        isLock={handleLock(coursePart)}
                        lastElementRef={lastElementRef}
                        isTeacher={isTeacher}
                        hasCertificate={hasCertificate}
                      />
                    ) : (
                      <Part
                        key={index}
                        course={coursePart}
                        lastElementRef={lastElementRef}
                        isLock={handleLock(coursePart)}
                        isTeacher={isTeacher}
                      />
                    )}
                  </>
                ) : (
                  <>
                    {' '}
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
                        isLock={handleLock(coursePart)}
                        lastElementRef={lastElementRef}
                        isTeacher={isTeacher}
                        hasCertificate={hasCertificate}
                      />
                    ) : (
                      <Part
                        key={index}
                        course={coursePart}
                        lastElementRef={lastElementRef}
                        isLock={handleLock(coursePart)}
                        isTeacher={isTeacher}
                      />
                    )}
                  </>
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
        <div className={'grid gap-6 sm:grid-cols-2 xl:grid-cols-3'}>
          {listCourseSectionFocus.map((coursePart, index: number) => {
            const content = (
              <div
                key={coursePart?.id}
                ref={(el) => (cardRefs.current[coursePart.id] = el)}
              >
                <>
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
                      isLock={handleLock(coursePart)}
                      lastElementRef={lastElementRef}
                      isTeacher={isTeacher}
                      hasCertificate={hasCertificate}
                    />
                  ) : (
                    <Part
                      key={index}
                      course={coursePart}
                      focusSubSectionIds={focusSubSectionIds}
                      focusUnitIds={focusUnitIds}
                      deadline={deadline}
                      lastElementRef={lastElementRef}
                      isLock={handleLock(coursePart)}
                      isTeacher={isTeacher}
                    />
                  )}
                </>
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
        <div className={'grid gap-6 sm:grid-cols-2 xl:grid-cols-3'}>
          {listCourseSectionOther?.map((coursePart, index: number) => {
            return (
              <div
                key={coursePart?.id}
                ref={(el) => (cardRefs.current[coursePart.id] = el)}
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
                    isLock={handleLock(coursePart)}
                    lastElementRef={lastElementRef}
                    isTeacher={isTeacher}
                    hasCertificate={hasCertificate}
                  />
                ) : (
                  <Part
                    key={index}
                    course={coursePart}
                    lastElementRef={lastElementRef}
                    isLock={handleLock(coursePart)}
                  />
                )}
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
