import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { differenceInDays, parseISO, startOfDay } from 'date-fns'
import {
  COURSES_STATUS_BADGE,
  ROUTES,
} from 'src/constants/courses3level/courses'
import { CLASS_USER_STATUS, ICourse } from 'src/type/courses'
import { CoursesAPI } from 'src/pages/api/courses'
import { useCourseContext } from '@contexts/index'
import { ANIMATION, COURSE_TYPE } from 'src/constants'
import PopupExtend from '@components/mycourses/PopupExtend'
import PopupActive from '@components/mycourses/PopupActive'
import PopupLesson from '@components/mycourses/PopupLesson'
import PopupOpenClass from '@components/mycourses/PopupOpenClass'
import Badge from './Badge'
import CourseTitle from './course/CourseTitle'
import CourseClass from './course/CourseClass'
import CourseDescription from './course/CourseDescription'
import CourseProgress from './course/CourseProgress'
import CourseAction from './course/CourseAction'
import { useCourseStatus } from 'src/hooks/useCourseStatus'

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
  const [openExtend, setOpenExtend] = useState(false)
  const [openActive, setOpenActive] = useState(false)
  const [timeActive, setTimeActive] = useState<number>()
  const [openLesson, setOpenLesson] = useState(false)
  const [openClass, setOpenClass] = useState(false)

  const {
    student,
    classInstance,
    daysDifference,
    percentProgress,
    determineButtonToShow,
    isActiveStudent,
    currentDate,
  } = useCourseStatus(course)

  const { courseType } = useCourseContext()

  useEffect(() => {
    if (course?.course_type === 'TRIAL_COURSE') {
      localStorage.setItem('daysDifference', '')
    } else {
      localStorage.removeItem('daysDifference')
    }
  }, [courseType])

  const activeCourse = async () => {
    try {
      await CoursesAPI.activeCourse({ classId: classInstance?.id })
      refetch()
      toast.success('Active thành công!')
    } catch (error) {}
  }

  const extendCourse = async () => {
    try {
      const res = await CoursesAPI.extendCourse({ classId: classInstance?.id })
      if (res?.success) {
        refetch()
        toast.success('Gia hạn thành công!')
      }
    } catch (error) {}
  }

  const handleCourseDetail = () => {
    const isRedirectDashboard =
      course?.course_type == COURSE_TYPE.NORMAL_COURSE ||
      course?.course_type == COURSE_TYPE.PRACTICE_COURSE

    router.push(ROUTES.COURSE_DETAIL(classInstance?.id))

    if (isRedirectDashboard) {
      localStorage.setItem(
        'courseInfo',
        JSON.stringify({
          name: course.name,
          courseType: course.course_type,
          category: course.course_categories[0]?.name,
        }),
      )
    } else {
      localStorage.removeItem('courseInfo')
    }

    localStorage.setItem(
      'courseDetail',
      `${ROUTES.MY_COURSES}${classInstance?.id}`,
    )

    if (course?.course_type === 'TRIAL_COURSE') {
      localStorage.setItem('daysDifference', String(daysDifference))
      localStorage.setItem('showPinTrial', 'true')
    } else {
      localStorage.removeItem('daysDifference')
      localStorage.removeItem('showPinTrial')
    }
  }

  const courseAction = () => {
    if (classInstance?.type === 'LESSON' && student?.is_passed === false) {
      setOpenLesson(true)
    } else if (determineButtonToShow === 'Active') {
      if (classInstance?.duration_type === 'FLEXIBLE') {
        setTimeActive(Number(classInstance?.flexible_days))
      } else {
        const classFinishedAt = parseISO(
          String(classInstance?.finished_at),
        ).setUTCHours(0, 0, 0, 0)
        const getDateActive = differenceInDays(
          startOfDay(new Date(classFinishedAt)),
          startOfDay(currentDate),
        )
        setTimeActive(Number(getDateActive + 1))
      }
      setOpenActive(true)
    } else if (determineButtonToShow === 'Extend') {
      setOpenExtend(true)
    } else if (!classInstance?.class_user_instances?.[0]?.is_opened) {
      setOpenClass(true)
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

  return (
    <>
      {determineButtonToShow !== 'Hidden' && (
        <div
          key={index}
          className={`item flex flex-col rounded-xl bg-white p-8 shadow-search`}
          data-aos={ANIMATION.DATA_AOS}
          ref={lastElementRef}
        >
          <div className="flex min-h-352 flex-col">
            <div className="mb-3">{renderBadge(course)}</div>
            <CourseTitle
              course={course}
              enableCourse={enableCourse}
              isActiveStudent={isActiveStudent}
              courseAction={courseAction}
            />
            <CourseClass
              course={course}
              enableCourse={enableCourse}
              daysDifference={daysDifference}
              determineButtonToShow={determineButtonToShow}
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
      )}

      <PopupExtend
        open={openExtend}
        setOpen={setOpenExtend}
        extendCourse={extendCourse}
        extend_count={student?.extend_count}
      />
      <PopupActive
        time={timeActive}
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
