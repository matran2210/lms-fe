import {
  CourseSectionLinkParent,
  IQuestion,
  LearningProgress,
  QUESTION_TYPES,
  QuestionTopic,
  Resource,
} from '@lms/core'
import React from 'react'

export type QuizOption = {
  id: string
  label: string
}

export type Block = {
  id: string
  type: 'text' | 'image' | 'quiz' | 'video' | QUESTION_TYPES
  reveal?: 'auto' | 'continue'
  text?: string
  src?: string
  question?: IQuestion
}

export type StoryStep = {
  id: string
  title?: string
  blocks: Block[]
}
export interface IStorylineData {
  id: string
  title: string
  steps: StoryStep[]
}
export interface IStoryline {
  id: string
  name: string
  short_name: any
  description: any
  duration: number
  is_graded: boolean
  course_section_type: string
  display_icon: any
  storyline_id: string
  course_section_link_parents: ICourseSectionLinkParent[]
  quiz: any
  storyline: IStorylineDetail
  learning_progress: LearningProgress
  position: number
  parent_id: string
  children: any[]
  is_linked_section: boolean
  is_linked_section_child: boolean
  section_root: {
    id: string
    name: string
  }
}

export interface ICourseSectionLinkParent extends CourseSectionLinkParent {
  course_id: string
  course_section_parent_id: string
}

export interface IStorylineDetail {
  id: string
  created_at: string
  updated_at: string
  deleted_at: any
  name: string
  description: string
  duration: number
  items: IStorylineItem[]
}

export interface IStorylineItem {
  id: string
  created_at: string
  updated_at: string
  deleted_at: any
  name: string
  description: string
  storyline_id: string
  position: number
  total_document: number
  item_progress: ItemProgress
}

export interface ItemProgress {
  total_document: number
  total_document_completed: number
}

export interface DocumentItem {
  id: string
  created_at: string
  updated_at: string
  deleted_at: any
  name: string
  type: 'TEXT' | 'VIDEO' | 'QUIZ'
  content: string
  storyline_item_id: string
  position: number
  videos?: VideoItem[]
  quiz?: IQuiz
}

export interface VideoItem {
  file: IVideoFile
  quiz: IQuiz
}

export interface IVideoFile {
  id: string
  created_at: string
  updated_at: string
  deleted_at: any
  dom_id: string
  type: string
  object_id: string
  resource_id: string
  context_id: any
  for_editor: boolean
  created_by_staff_id: any
  created_by_user_id: any
  resource: Resource
}

export interface IQuiz {
  id: string
  created_at: string
  updated_at: string
  deleted_at: any
  name: string
  description: string
  quiz_question_mode: string
  status: string
  number_of_multiple_choice_questions: any
  number_of_essay_questions: any
  is_published: boolean
  is_public: boolean
  password: any
  is_graded: boolean
  grading_method: string
  multiple_choice_multiplier: any
  essay_multiplier: any
  required_percent_score: any
  minimum_score: any
  is_limited: boolean
  limit_count: any
  is_tutor: boolean
  quiz_timed: any
  setting: any
  quiz_question_type: string
  quiz_type: string
  grading_preference: string
  created_by: any
  created_from: string
  published_at: any
  started_at: any
  finished_at: any
  case_study_story_id: any
  course_category_id: any
  subject_id: any
  event_id: any
  is_auto_pass_point: boolean
  quiz_question_instances: any[]
  course_tab_document: any[]
  course_category: any
  sections: any[]
  course_section: any
  constructed_questions: IMultiChoiceQuestion[]
  multiple_choice_questions: IMultiChoiceQuestion[]
}
export interface IMultiChoiceQuestion {
  id: string
  question_content: string
  qType: string
  question_topic: QuestionTopic
  setting_grade: any
  time: any
}
