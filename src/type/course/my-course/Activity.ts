import { IFile, IVideo, IQuestion } from '../Question'

export interface IActivity {
  id: string
  created_at: string
  updated_at: string
  deleted_at: null
  course_id: string
  name: string
  code: string
  description: string
  status: string
  is_public: boolean
  duration: number
  is_peer_review: boolean
  is_graded: boolean
  course_section_type: string
  activity_type: string
  position: string
  parent_id: string
  display_icon: string
  course_outcomes: {
    id: string
    created_at: string
    updated_at: string
    deleted_at: string
    description: string
  }[]
  course_learning_outcome: {
    id: string
    created_at: string
    updated_at: string
    deleted_at: string
    name: string
    description: string
  }
  files: File[]
  tabs?: ITab[]
}

export interface ITab {
  id: string
  created_at: string
  updated_at: string
  deleted_at: string
  course_id: string
  name: string
  code: string
  description: string
  status: string
  is_public: string
  duration: string
  is_peer_review: boolean
  is_graded: boolean
  course_section_type: string
  activity_type: string
  position: string
  display_icon: string
  course_tab_documents: {
    id: string
    created_at: string
    updated_at: string
    deleted_at: string
    type: 'TEXT' | 'VIDEO' | 'QUIZ'
    text_editor_content?: string
    course_section_id?: string
    files?: IFile[]
    videos?: IVideo[]
    quiz?: {
      constructed_questions: IQuestion[]
      multiple_choice_questions: IQuestion[]
    }
  }[]
}
