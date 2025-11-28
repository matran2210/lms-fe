import PopupActive from '@components/mycourses/PopupActive'
import PopupExtend from '@components/mycourses/PopupExtend'
import PopupLesson from '@components/mycourses/PopupLesson'
import PopupOpenClass from '@components/mycourses/PopupOpenClass'
import {
  ANIMATION,
  CLASS_USER_STATUS,
  COURSES_STATUS_BADGE,
  ICourse,
  ROUTES,
} from '@lms/core'
import { useCourseStatus } from '@lms/hooks'
import { convertHourToDayLeft, convertLocalTimeToUTC } from '@utils/helpers'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { CoursesAPI } from 'src/pages/api/courses'
import Badge from './Badge'
import CourseAction from './course/CourseAction'
import CourseClass from './course/CourseClass'
import CourseDescription from './course/CourseDescription'
import CourseProgress from './course/CourseProgress'
import CourseTitle from './course/CourseTitle'
import { useCourseContext } from '@lms/contexts'

export default function CourseCard({
  course,
  index,
  lastElementRef,
  refetch,
}: {
  course: ICourse
  index: number
  lastElementRef: (node: HTMLDivElement) => void
  refetch: () => void
}) {
  const router = useRouter()
  const { courseType } = useCourseContext()
  const [openActive, setOpenActive] = useState(false)
  const [openLesson, setOpenLesson] = useState(false)
  const [openClass, setOpenClass] = useState(false)
  const [openExtend, setOpenExtend] = useState<boolean>(false)
  const {
    student,
    classInstance,
    percentProgress,
    determineButtonToShow,
    isActiveStudent,
  } = useCourseStatus(course, 'finhub')
  const [daysDifference, setDaysDifference] = useState(365)
  const activeCourse = async () => {
    try {
      await CoursesAPI.activeCourse({ classId: classInstance?.id })
      refetch()
      toast.success('Active thành công!')
    } catch (error) {}
  }

  const handleCourseDetail = () => {
    router.push(ROUTES.COURSE_DETAIL(classInstance?.id))

    localStorage.setItem(
      'courseDetail',
      `${ROUTES.MY_COURSES}${classInstance?.id}`,
    )

    if (course?.course_type === 'TRIAL_COURSE') {
      localStorage.setItem('showPinTrial', 'true')
      localStorage.setItem('daysDifference', daysDifference.toString())
    } else {
      localStorage.removeItem('showPinTrial')
      localStorage.removeItem('daysDifference')
    }
  }

  const courseAction = () => {
    if (classInstance?.type === 'LESSON' && student?.is_passed === false) {
      setOpenLesson(true)
    } else if (determineButtonToShow === 'Active') {
      setOpenActive(true)
    } else if (!classInstance?.class_user_instances?.[0]?.is_opened) {
      setOpenClass(true)
    } else if (determineButtonToShow === 'Extend') {
      setOpenExtend(true)
    } else {
      course.status !== CLASS_USER_STATUS.CANCELED ? handleCourseDetail() : {}
    }
  }

  const statusMap = {
    [CLASS_USER_STATUS.READY_TO_LEARN]: 'Ready to learn',
    [CLASS_USER_STATUS.COMPLETED]: 'Completed',
    [CLASS_USER_STATUS.IN_PROGRESS]: 'In progress',
    [CLASS_USER_STATUS.CANCELED]: '',
  } as const

  const classUserStatus = student?.status as keyof typeof statusMap
  const showStatus = statusMap[classUserStatus]
  const enableCourse =
    determineButtonToShow !== 'Disabled' && determineButtonToShow !== 'Extend'

  const renderStatusIcon = (status: string) => {
    switch (status) {
      case CLASS_USER_STATUS.READY_TO_LEARN:
        return 'like'
      case CLASS_USER_STATUS.IN_PROGRESS:
        return 'hour'
      case CLASS_USER_STATUS.COMPLETED:
        return 'completed'
      default:
        return ''
    }
  }
  const iconType = renderStatusIcon(classUserStatus ?? '')

  const renderBadge = (course: ICourse) => {
    if (determineButtonToShow === 'Extend') {
      return (
        <Badge badgeType={COURSES_STATUS_BADGE['FAILURE']} label={'Expired'} />
      )
    }
    return (
      <Badge
        badgeType={COURSES_STATUS_BADGE['RECEIVED']}
        label={course?.course_categories[0]?.name}
        isBold={true}
      />
    )
  }

  const progressPart = percentProgress > 100 ? 100 : percentProgress

  async function extendCourse() {
    try {
      const res = await CoursesAPI.extendCourse({ classId: classInstance?.id })
      if (res?.success) {
        refetch()
        toast.success('Gia hạn hành công!')
      }
    } catch (error) {}
  }

  useEffect(() => {
    if (course?.course_type === 'TRIAL_COURSE') {
      localStorage.setItem('daysDifference', '')
    } else {
      localStorage.removeItem('daysDifference')
    }
  }, [courseType])

  useEffect(() => {
    if (student?.finished_at) {
      const currentLocalDate = new Date()
      const currentUTCDate = convertLocalTimeToUTC(currentLocalDate)
      const finishDate = new Date(student?.finished_at)
      const finishUTCDate = convertLocalTimeToUTC(finishDate)

      const currentTime = currentUTCDate.getTime()
      const finishTime = finishUTCDate.getTime()

      const theRestHours = (finishTime - currentTime) / 3600000
      const dayLefts = convertHourToDayLeft(theRestHours)

      // Update state with the difference
      setDaysDifference(dayLefts)
    }
  }, [course, student?.finished_at])

  return (
    <>
      {determineButtonToShow !== 'Hidden' && (
        <div data-aos={ANIMATION.DATA_AOS}>
          <div
            key={index}
            className="border-transparent relative flex flex-col rounded-xl border border-white bg-white p-4 shadow-card transition-colors duration-300 ease-in-out hover:border-primary hover:shadow-md md:p-6 lg:rounded-2xl lg:p-8"
            // data-aos={ANIMATION.DATA_AOS}
            ref={lastElementRef}
          >
            <div className="flex min-h-352 flex-col">
              {/* <div className="mb-3">{renderBadge(course)}</div> */}
              <CourseTitle
                course={course}
                enableCourse={enableCourse}
                isActiveStudent={isActiveStudent}
                courseAction={courseAction}
              />
              <CourseClass
                course={course}
                enableCourse={enableCourse}
                determineButtonToShow={determineButtonToShow}
                daysDifference={daysDifference}
              />
              <CourseDescription course={course} enableCourse={enableCourse} />
              <div className="mt-auto">
                {enableCourse && (
                  <CourseProgress
                    enableCourse={enableCourse}
                    iconType={iconType}
                    showStatus={showStatus}
                    progressPart={progressPart}
                  />
                )}
                <CourseAction
                  determineButtonToShow={determineButtonToShow}
                  isActiveStudent={isActiveStudent}
                  courseAction={courseAction}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <PopupExtend
        open={openExtend}
        setOpen={setOpenExtend}
        extendCourse={extendCourse}
        extend_count={student?.extend_count}
      />
      <PopupActive
        open={openActive}
        setOpen={setOpenActive}
        activeCourse={activeCourse}
      />
      <PopupLesson open={openLesson} setOpen={setOpenLesson} />
      <PopupOpenClass
        open={openClass}
        setOpen={setOpenClass}
        started_at={classInstance?.class_user_instances?.[0]?.started_at}
      />
    </>
  )
}
