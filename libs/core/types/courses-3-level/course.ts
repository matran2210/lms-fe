import { ICourse } from '../courses'

export const allTypes3Level = ['section', 'subsection', 'activity'] as const

export type SectionField3Level = (typeof allTypes3Level)[number]

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
  determineButtonToShow?: string
  daysDifference?: number
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

export interface CourseDetail3Level {
  id: string
  title: string
  description: string
}

export const getTypeName3Level = {
  section: 'Section',
  subsection: 'Subsection',
  activity: 'Activity',
} as Record<SectionField3Level, string>


export interface IOpenChooseItem3Level {
  isOpen: boolean
  type: SectionField3Level
  name: string
  params?: string
}

export const nextTypeMap3Level = {
  section: 'subsection',
  subsection: 'activity',
} as Record<SectionField3Level, SectionField3Level>

export const backTypeMap3Level = {
  activity: 'subsection',
  subsection: 'section',
} as Record<SectionField3Level, SectionField3Level>
