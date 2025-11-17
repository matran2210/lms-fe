import { IMetaData } from './index'
import { Dayjs } from 'dayjs'

export interface IProgressList {
  metadata: IMetaData
  formattedClassTeachingProgresses: IProgress[]
}

export enum LearningMode {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  LIVE_ONLINE = 'LIVE_ONLINE',
}

export interface IProgress {
  id: string
  lesson_name: string
  lesson_start_date: string
  section?: string
  progress: number
  teacher: IProgressUser
  staff_creator: IProgressUser
  user_creator: IProgressUser
  start_time: string
  end_time: string
  description: string
  created_at?: Date
  lesson: {
    class_schedule_id: string
    lesson_end_date: Date
    lesson_name: string
  }
  catch_up_content: ICatchUpContent[]
  content_completed: IContentCompleted[]
  section_main?: string
  mode: LearningMode
}
export interface IProgressUser {
  id: string
  full_name: string
}
export interface ICatchUpContent {
  class_teaching_progress_id: string
  class_schedule_id: string
  schedule_name: string
  compensated_class_teaching_progress_id: string
  compensated_progress: number
}
export interface IContentCompleted {
  class_schedule_id: string
  class_schedule_name: string
  course_sections: ICourseSections[]
  is_completed: boolean | undefined
  start_date?: Date
  schedule_name?: string
  main?: boolean
}
export interface ICourseSections {
  key?: string
  course_section_type: string
  id: string
  is_completed: boolean
  name: string
  parent_id: string | null
  children: ICourseSections[]
  type?: string
  position: number
}

export interface IProgressFilterForm {
  progress: string
  rangeDate: [Dayjs, Dayjs]
  section: string
}
export interface IDefaultFormAddProgress {
  lesson: string
  section: string
  note: string
  time: string[]
  checkedNodes: string[]
}
export interface IExplorerNode {
  id: string
  name: string
  code: string
  is_original: boolean
  is_excepted: boolean
  checked: boolean
  parent_id?: string
  process?: number
  children?: IExplorerNode[]
}

export interface ICourseSections {
  key?: string
  course_section_type: string
  id: string
  is_completed: boolean
  name: string
  parent_id: string | null
  children: ICourseSections[]
  type?: string
}

export interface ILesson {
  course_sections: ICourseSections[]
  label: string
  value: string
  teacher_name: { id: string; name: string }
  schedule: ILessonSchedule
}
export interface ILessonSchedule {
  id: string;
  lesson_name: string;
  start_time: string;
  start_date: string;
}

export interface IRequestCreateProgress {
  section?: string
  current_class_schedule_id: string
  start_time: string
  end_time: string
  description?: string
  current_course_sections?: {
    class_schedule_id: string
    course_section_ids: string[]
  }[]
  compensated_course_sections?: {
    class_schedule_id: string
    course_section_ids: string[]
  }[]
}

export interface IClassDetail {
  capacity: number
  code: string
  course: ICourse
  description: string
  examination_subject?: string
  facility?: string
  finished_at?: string
  flexible_days: number
  id: string
  instruction_mode: string
  name: string
  progress: number
  started_at?: string
  status: string
  type: string
}

export interface ICourse {
  id: string
  name: string
  course_categories: { id: string; name: string }[]
}
