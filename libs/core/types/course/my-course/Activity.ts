import { IQuizSetting } from '../../courses'
import { INeighborActivity } from '../../courses-3-level';
import { IFile, IQuestion, IVideo } from '../Question'

export interface IActivity {
  id: string[] | undefined | string;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  course_id: string;
  name: string;
  code: string;
  description: string;
  status: string;
  is_public: boolean;
  duration: number;
  is_peer_review: boolean;
  is_graded: boolean;
  course_section_notes: {
    name: string;
    description: string;
  }[];
  course_section_type: string;
  activity_type: string;
  position: string;
  parent_id: string;
  display_icon: string;
  total_activity: number;
  course_outcomes: {
    id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string;
    description: string;
  }[];
  course_learning_outcome: {
    id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string;
    name: string;
    description: string;
  };
  files: File[];
  tabs?: ITab[];
  class_id?: string;
  class_user_id?: string;
  next_activity: INeighborActivity;
  previous_activity: INeighborActivity;
  breadcumb?: IActivityBreadcrumb[];
  user_course_section_progress: {
    id: string;
    total_course_sections: number;
    total_course_sections_completed: number;
  }[];
  is_preview_locked: boolean;
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
      attempt: {
        status: string
        id: string
        grading_status: string
        number_of_attempts?: number
      }
      is_limited?: boolean
      limit_count?: number
      id?: string
      name?: string
      constructed_questions: IQuestion[]
      multiple_choice_questions: IQuestion[]
      grading_preference: 'AFTER_EACH_QUESTION' | 'AFTER_ALL_QUESTIONS'
      is_graded?: boolean
      quiz_setting?: IQuizSetting
      grading_method?: string
    }
  }[]
}

type CourseSectionType = 'PART' | 'CHAPTER' | 'UNIT' | 'ACTIVITY'
export interface IActivityBreadcrumb {
  id: string
  name: string
  course_section_type: CourseSectionType
  parent_id?: string
  url?: string
}

export interface IQuestionResultResponse {
  data: IActivityQuestionResult[]
  meta: {
    total_pages: number
    total_records: number
    page_index: number
    page_size: number
  }
  attempt_info: {
    is_graded: boolean
    score: number
  }
}

export interface IActivityQuestionResult {
  active?: string;
  question?: {
    quiz_question_instances?: {
      section: {
        name: string;
      };
    };
    question_filter?: {
      part: {
        name: string;
      };
    };
    qType?: string;
    question_report: {
      average_time: number;
      ratio: number;
    };
    question_topic?: {
      id: string;
      name: string;
    };
  };
  id: string;
  content: string;
  section: string;
  type: string;
  is_correct: boolean;
  time_spent: number;
}
