import {
  CourseSectionLinkParent,
  IQuestion,
  LearningProgress,
  QUESTION_TYPES,
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
  type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'QUIZ'
  content: string
  storyline_item_id: string
  position: number
}
