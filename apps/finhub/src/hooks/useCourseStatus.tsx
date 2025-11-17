import { round } from 'lodash'
import { useMemo } from 'react'
import {
  BUTTON_STATUS,
  CLASS_STATUS,
  CLASS_USER_TYPES,
  COURSE_STATUS,
} from '@lms/core'
import { CLASS_USER_STATUS, ICourse } from 'src/type/courses'

export const useCourseStatus = (course: ICourse) => {
  const student = course?.classes?.[0]?.class_user_instances?.[0]
  const classInstance = course?.classes?.[0]
  const currentDate = useMemo(() => new Date(), [])

  const percentProgress =
    round(
      (Number(
        student?.learning_progress?.total_course_sections_completed ?? 0,
      ) /
        Number(student?.learning_progress?.total_course_sections ?? 0)) *
        100,
      2,
    ) || 0

  const disabledCourseByClassType = [
    CLASS_USER_TYPES.RESERVED,
    CLASS_USER_TYPES.RETOOK,
    CLASS_USER_TYPES.TRANSFERED_TO,
    CLASS_USER_TYPES.MOVED_OUT,
    CLASS_USER_TYPES.CANCELED,
  ]

  const checkStatusCourse = () => {
    const courseStatus = course?.status
    const classStatus = classInstance?.status
    const classUserType = classInstance?.class_user_instances?.[0]?.type
    const studentStatus = student?.status
    const startedAt = student?.started_at
    const finishedAt = student?.finished_at
    const formattedDate = new Date()
    if (
      courseStatus === COURSE_STATUS.PUBLISH ||
      courseStatus === COURSE_STATUS.LOCK
    ) {
      if (
        classUserType === CLASS_USER_TYPES.TRANSFERED_TO &&
        classInstance?.type === 'LESSON'
      ) {
        return BUTTON_STATUS.Disabled
      }

      if (
        classStatus === CLASS_STATUS.PUBLIC ||
        classStatus === CLASS_STATUS.ENDED
      ) {
        if (course?.course_type === 'TRIAL_COURSE' && !student) {
          if (classInstance?.duration_type === 'FLEXIBLE')
            return BUTTON_STATUS.Active
          if (
            classInstance?.duration_type === 'FIXED' &&
            classInstance?.finished_at
          ) {
            const classFinish = new Date(classInstance?.finished_at as any)
            if (classFinish <= formattedDate) return BUTTON_STATUS.Extend
            if (classFinish > formattedDate) return BUTTON_STATUS.Active
          }
        }
        if (startedAt && finishedAt) {
          const finishedAtDate = new Date(student?.finished_at as any)
          if (
            course?.course_type === 'TRIAL_COURSE' &&
            finishedAtDate <= formattedDate
          )
            return BUTTON_STATUS.Extend
          if (finishedAtDate <= formattedDate) return BUTTON_STATUS.Disabled
          if (finishedAtDate > formattedDate) {
            if (studentStatus === 'READY_TO_LEARN') return BUTTON_STATUS.Begin
            if (studentStatus === 'IN_PROGRESS') return BUTTON_STATUS.Resume
            if (studentStatus === 'COMPLETED') return BUTTON_STATUS.Review
          } else return BUTTON_STATUS.Disabled
        }
        if (!startedAt) {
          return BUTTON_STATUS.Active
        } else {
          if (studentStatus === CLASS_USER_STATUS.READY_TO_LEARN)
            return BUTTON_STATUS.Begin
          if (studentStatus === CLASS_USER_STATUS.IN_PROGRESS)
            return BUTTON_STATUS.Resume
          if (studentStatus === CLASS_USER_STATUS.COMPLETED)
            return BUTTON_STATUS.Review
        }

        return BUTTON_STATUS.Disabled
      }

      if (
        classStatus === CLASS_STATUS.DRAFT ||
        classStatus === CLASS_STATUS.BLOCK
      )
        return BUTTON_STATUS.Hidden

      return BUTTON_STATUS.Hidden
    }

    if (
      courseStatus === COURSE_STATUS.DRAFT ||
      courseStatus === COURSE_STATUS.BLOCK ||
      disabledCourseByClassType.includes(classUserType)
    )
      return BUTTON_STATUS.Hidden

    return BUTTON_STATUS.Hidden
  }

  const determineButtonToShow = checkStatusCourse() as string

  const renderStatusUser = (status: string) => {
    switch (status) {
      case CLASS_USER_TYPES.RESERVED:
      case CLASS_USER_TYPES.TRANSFERED_TO:
      case CLASS_USER_TYPES.CANCELED:
        return false
      default:
        return true
    }
  }

  const isActiveStudent = renderStatusUser(student?.type ?? '')

  return {
    student,
    classInstance,
    percentProgress,
    determineButtonToShow,
    isActiveStudent,
    currentDate,
  }
}
