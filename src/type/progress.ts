import { IMetaData } from './index'
import { Dayjs } from 'dayjs'

export interface IProgressList {
  metadata: IMetaData
  formattedClassTeachingProgresses: IProgress[]
}

export interface IProgress {
  id: string
  lesson_name: string
  lesson_start_date: string
  section?: string
  progress: number
  teacher: { id: string; full_name: string }
  staff_creator: { id: string; full_name: string }
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
}
export interface ICatchUpContent {
  compensation_id: string
  compensated_progress: string
  compensated_lesson_name: string
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
}

export interface IProgressFilterForm {
  progress: string
  rangeDate: [Dayjs, Dayjs]
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
  schedule: ISchedule
}
export interface ISchedule {
  id: string
  lesson_name: string
  start_time: string
  start_date: string
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
