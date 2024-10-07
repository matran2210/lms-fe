import { isEmpty } from 'lodash'
import NoData from 'src/common/NoData'
import { ANIMATION, TEST_TYPE } from 'src/constants'
import { IMyCourseDetail } from 'src/type/courses'
import Part from './Part'
import PartMiddleTest from './PartFailed'

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
  return (
    <div
      className={`${
        isEmpty(courses)
          ? 'flex min-h-[calc(100vh-15rem)] items-center justify-center'
          : 'mb-10 grid grid-cols-2 gap-6 2xl-min:grid-cols-3'
      }`}
    >
      {!isEmpty(courses) ? (
        courses?.map((coursePart, index: number) => {
          return (
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
          )
        })
      ) : (
        <NoData />
      )}
    </div>
  )
}

export default CourseParts
