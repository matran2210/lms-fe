import { IQuestion, QUESTION_TYPES } from '@lms/core'
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
