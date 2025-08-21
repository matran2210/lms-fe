import { CourseSectionType } from '@utils/constants'
import { Badge, Divider, Tag } from 'antd'
import dayjs from 'dayjs'
import { isEmpty } from 'lodash'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import NoData from 'src/common/NoData'
import { TEST_TYPE } from 'src/constants'
import { IMyCourseDetail } from 'src/type/courses'
import Part from './Part'
import PartMiddleTest from './PartFailed'

const CourseParts = ({
  courses,
  class_user_id,
  is_passed_course,
  lastElementRef,
  isTrial = false,
  isTeacher = false,
}: {
  courses: IMyCourseDetail[] | undefined
  class_user_id?: string
  is_passed_course: boolean
  lastElementRef: (node: HTMLDivElement) => void
  isTrial?: boolean
  isTeacher?: boolean
}) => {
  const router = useRouter()
  const cardRefs = useRef<any>([]) // Để lưu ref của các thẻ card
  const handleLock = (coursePart: IMyCourseDetail) => {
    return !!(
      coursePart?.course_section_link_parents?.[0]?.is_preview_locked ||
      coursePart?.course_section_link_parents?.[0]?.is_showing_locked
    )
  }

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
        <div className={'grid gap-6 md:grid-cols-2 2xl:grid-cols-3'}>
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
        <div className={'grid gap-6 md:grid-cols-2 2xl:grid-cols-3'}>
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
