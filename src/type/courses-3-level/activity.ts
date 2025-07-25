export interface ICourseSectionPathItem {
  id: string
  name: string
  type: string
}

export interface ICourseSectionNoteItem {
  id: string
  created_at: string
  updated_at: string
  deleted_at: string
  name: string
  description: string
  course_section_id: string
  user_id: string
  course_section_path: ICourseSectionPathItem[]
}

export interface INotesListResponse {
  notes: ICourseSectionNoteItem[]
  meta: {
    page_index: number
    page_size: number
    total_pages: number
    total_records: number
  }
}
