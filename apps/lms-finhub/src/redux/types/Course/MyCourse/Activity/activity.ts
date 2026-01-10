export interface ICreateDiscussionRequest {
  course_section_id: string
  class_id: string
  parent_id?: string
  content: string
}
export interface ICreateDiscussionUploadRequest {
  discussion_id: string
  new_discussion_file: File[]
  discussion_file_ids?: string[]
}
export interface ICreateDiscussionResReact {
  course_discussion_id: string
  is_like: boolean
}
