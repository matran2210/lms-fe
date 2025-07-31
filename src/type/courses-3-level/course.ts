import { ICourse } from '../courses'

export const allTypes = ['section', 'subsection', 'activity'] as const

export type SectionField = (typeof allTypes)[number]

export interface Courses3LevelProps {
  courses: ICourse[]
  lastElementRef: (node: HTMLDivElement) => void
  refetch: () => void
  isFetching: boolean
  isFetchingNextPage: boolean
}

export type ICourseAction = {
  determineButtonToShow: string
  isActiveStudent: boolean
  courseAction: () => void
}

export type ICourseClassDay = {
  course: ICourse
  enableCourse: boolean
  daysDifference: number
  determineButtonToShow: string
}

export type ICourseDescription = {
  course: ICourse
  enableCourse: boolean
}

export type ICourseProgress = {
  enableCourse: boolean
  iconType: string
  showStatus: string
  progressPart: number
}

export type ICourseTitle = {
  course: ICourse
  enableCourse: boolean
  isActiveStudent: boolean
  courseAction: () => void
}

export interface CourseDetail {
  id: string
  title: string
  description: string
}

export const getTypeName = {
  section: 'Section',
  subsection: 'Subsection',
  activity: 'Activity',
} as Record<SectionField, string>

export type SectionDropdownFormValues = {
  section: string | null
  subsection: string | null
  unit: string | null
  activity: string | null
}

export interface IOpenChooseItem {
  isOpen: boolean
  type: SectionField
  name: string
  params?: string
}

export const nextTypeMap = {
  section: 'subsection',
  subsection: 'activity',
} as Record<SectionField, SectionField>

export const backTypeMap = {
  activity: 'subsection',
  subsection: 'section',
} as Record<SectionField, SectionField>
