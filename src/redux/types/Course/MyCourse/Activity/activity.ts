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

interface ICourseSection {
  id: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  name: string
  code: string
  description: string | null
  status: string
  is_public: boolean
  duration: number
  is_peer_review: boolean
  is_graded: boolean
  course_section_type: string
  activity_type: string | null
  position: number | null
  display_icon: string
  quiz_id: string | null
}

export interface IDiscussion {
  course_discussion_files: {
    course_discussion_id: string
    url: string
    id: string
  }[]
  id: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  content: string
  course_section_id: string
  user_id: string
  course_section: ICourseSection
  parent_id: string | null

  username: string
  full_name: string
  avatar: { [key: string]: string }
  is_like: boolean
  children: IDiscussion[]
	is_staff_support: boolean  
}

export interface ICreateDiscussionResReact {
  course_discussion_id: string
  is_like: boolean
}
export interface ICreateDiscussionRepReact {
  is_like: boolean
  course_discussion_id: string
  user_id: string
  deleted_at: null
  id: string
  created_at: string
  updated_at: string
}
