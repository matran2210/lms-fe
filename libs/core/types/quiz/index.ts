import { IMeta } from "../courses";
import { IMetaData } from "..";
import { IQuestion } from "../course";
import { QUESTION_TYPES } from "../../enums";

export interface IAnswerQuizLastestAttempt {
  next: Next;
  previous: Previous;
  index: number;
  total_question: number;
  answer: AnswerData;
  program: string;
}
export interface AnswerData {
  id: string;
  question_id: string;
  question_answer_id: any;
  short_answer: any;
  answer_file: any;
  answer: AnswerItemQuestion[];
  response_option: any;
  is_correct: boolean;
  time_spent: number;
  active: any;
  requirement_id: any;
  question: IQuestion;
  quiz_attempt: QuizAttempt;
  topic_attempt: any;
  answer_matching_mapping: any[];
  answer_position_mapping: AnswerPositionMapping;
}
export interface QuizAttempt {
  id: string;
  quiz_position_mapping: any[];
  class_user_id: string;
  quiz: ISimpleQuiz;
}

export interface ISimpleQuiz {
  id: string;
  quiz_type: string;
}

export interface AnswerPositionMapping {
  question_id: string;
  answer: AnswerItemQuestion[];
}

export interface AnswerItemQuestion {
  answer_position?: number;
  answer_id?: string;
  answer_text?: string;
  question_id?: string;
}

export interface Next {
  id: string;
  quiz_attempt_id: string;
  question_id: string;
  question_answer_id: any;
}

export interface Previous {
  id: string;
  quiz_attempt_id: string;
  question_id: string;
  question_answer_id: any;
}
export interface IScoreDetails {
  metadata: IMeta;
  answers: IAnswer[];
  activity_info: ActivityInfo;
  attempt_info: {
    is_graded: boolean;
    score: number;
  };
  result_answer: {
    total_correct_answers: number;
    total_question: number;
  };
}

export interface ActivityInfo {
  activity_id: string;
  class_id: string;
  class_user_id: string;
}

export interface IAnswer {
  id: string;
  quiz_attempt_id: string;
  question_id: string;
  answer_file: any;
  is_correct: boolean;
  time_spent: number;
  active: any;
  topic_attempt_id: any;
  requirement_id: any;
  question: Question;
  index: number;
  belong_to: BelongTo;
}

interface BelongTo {
  id: string;
  name: string;
}

interface QuestionFilter {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  context: string | null;
  course_id: string;
  part_id: string;
  chapter_id: string | null;
  unit_id: string | null;
  activity_id: string | null;
  quiz_id: string | null;
  part: {
    id: string;
    name: string;
    short_name: string;
  };
  chapter: {
    id: string;
    name: string;
    short_name: string;
  };
}

interface QuestionReport {
  ratio: number;
  average_time: number;
}

interface Question {
  id: string;
  question_filter: QuestionFilter;
  question_content: string;
  level: string;
  qType: QUESTION_TYPES;
  solution: string;
  question_report: QuestionReport;
}

export interface IQuizResult {
  created_at: string;
  finished_at: Date;
  id: string;
  is_graded: boolean;
  ratio_score: string;
  score: number;
  total_attempt_time: number;
  name: string;
  status: string;
  quiz: {
    id: string;
    is_graded: boolean;
    required_percent_score: number;
    is_limited: boolean;
    limit_count?: number;
    grading_method?: string;
  };
}

export interface IQuizResultList {
  metadata: IMetaData;
  data: IQuizResult[];
}

export interface IFocusQuiz {
  open: boolean;
  id: string;
}
export interface VideoStateClicked {
  course_tab_document_id: string;
  videos: {
    file_id: string;
    is_click: boolean;
  }[];
}
export interface MultipleQuestionsData {
  quizAttempt?: {
    grading_status?: string
    status?: string
  }
  selectedResponseAnswers?: IAnswer[]
  constructedResponseAnswers?: IAnswer[]
}
export * from "./StatusActionCell";
