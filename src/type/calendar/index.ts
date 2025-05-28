export interface ICalendarList {
  calendars?: ICalendar[]
  courses?: ICourse[]
}

export interface ICourse {
  id: string
  name?: string
  description?: string
  subject?: {
    id: string
    name: string
    code: string
  }
}

export interface ICalendar {
  id: string
  mode: string
  course_sections: any[]
  is_test: boolean
  is_case_study: boolean
  subject: string
  is_holiday: boolean
  name: string
  description: string
  start_date: string
  end_date: string
  start_time: string
  end_time: string
  is_key_before_content: boolean
  is_key_after_content: boolean
  course_id: string
}

export interface ICalendarDetail {
  id: string
  mode: string
  name: string
  is_test: boolean
  is_case_study: boolean
  status: string
  class: {
    id: string
    name: string
    code: string
    link_meeting: string
  }
  subject: {
    id: string
    created_at: Date
    updated_at: Date
    deleted_at: Date
    course_category_id: string
    name: string
    code: string
  }
  link_study: string
  schedule: {
    id: string
    created_at: Date
    updated_at: Date
    deleted_at: Date | null
    start_date: string
    end_date: string
    start_time: string
    end_time: string
    is_holiday: boolean
    description: string | null
    name: string
    recurring_pattern_id: string | null
    is_review_allowed: boolean
  }
  room: {
    id: string
    created_at: Date
    updated_at: Date
    deleted_at: Date | null
    description: string
    capacity: string
    facility_id: string
    status: string
    deferred_student: number
    new_student: number
    address: string | null
    name: string
    code: string
    type: string
    order: number
    mode: string
    virtual_metadata: string
  }
  key_before_contents: [
    {
      id: string
      name: string
      current: boolean
    },
  ]
  sections: ISectionData[]
}

export interface ISectionData {
  id: string
  created_at: Date
  updated_at: Date
  course_id: Date
  course_section_id: string
  course_section_parent_id: string | null
  is_original: boolean
  position: number
  course_section: {
    id: string
    created_at: Date
    updated_at: Date
    name: string
    code: string
    course_section_type: string
  }
}
