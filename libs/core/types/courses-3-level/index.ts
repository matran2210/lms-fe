import { DrawerProps } from "antd";
import { TooltipPlacement } from "antd/es/tooltip";
import { Dispatch, ForwardedRef, ReactNode, SetStateAction } from "react";
import { FieldValues, UseFormSetValue } from "react-hook-form";
import { IBreadcrumb, IButtonProps, IExhibit, ITabs } from "..";
import { IMetaData } from "../api-response";
import {
  CourseSectionLinkParent,
  LearningProgress,
  RemindChoosingExam
} from "../course/my-course";
import { CourseProgram, IQuestion, IStorylineDetail, IVideo } from "../course";
import {
  ICourseAll,
  ICourseSection,
  ILearningOutcome,
  IQuizSetting,
} from "../courses";
import { ExaminationSubject } from "../exam-infomation";
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from "react-query";

export interface ICourseOutcomes {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  description: string;
}

export interface INeighborActivity {
  id: string;
  display_icon: string;
  name: string;
  is_preview_locked: boolean;
  course_section_type?: string;
  storyline?: IStorylineDetail;
  learning_progress?: LearningProgress;
}

export interface ICourseTabDocument {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  type: "TEXT" | "VIDEO" | "QUIZ";
  text_editor_content?: string;
  course_section_id?: string;
  files?: File[];
  videos?: IVideo[];
  quiz?: {
    attempt: {
      status: string;
      id: string;
      grading_status: string;
    };
    id?: string;
    name?: string;
    constructed_questions: IQuestion[];
    multiple_choice_questions: IQuestion[];
    grading_preference: "AFTER_EACH_QUESTION" | "AFTER_ALL_QUESTIONS";
    is_graded?: boolean;
    quiz_setting?: IQuizSetting;
    grading_method?: string;
  };
}

type CourseSectionType = "ACTIVITY" | "UNIT" | "CHAPTER_TEST" | "STORY";

export interface ITimeLine {
  time: string;
  text: string;
}

export interface ISubSection {
  id: string;
  name: string;
  children: IActivity3Level[];
  activity_count: number;
  course_section_type: string;
  learning_progress: {
    duration: number;
    time_spent: number;
    total_course_sections: number;
    total_course_sections_completed: number;
  };
  quiz: {
    id: string;
    attempt: IAttempt;
    quiz_timed: number;
    is_graded: boolean;
    required_percent_score: number;
    is_limited: boolean;
    limit_count: number;
    grading_method: string;
    quiz_question_instances: {
      id: string;
      question_id: string;
    }[];
    case_study_story?: {
      id: string;
      instances: Array<{
        id: string;
        created_at: string;
        position: number;
        question_topic_id: string;
        question_topic: {
          id: string;
          name: string;
          number_of_multiple_choice_questions: number;
          number_of_essay_questions: number;
        };
      }>;
    };
  };
  duration: number | null;
  course_learning_outcome?: ILearningOutcome;
  course_section_link_parents: CourseSectionLinkParent[];
}

export interface IAttempt {
  id: string;
  ratio_score: string;
  status: string;
  name: string;
  number_of_attempts?: number;
  grading_status?: string;
  score: number;
  total_attempt_time: number;
}

interface Data {
  id: string;
  course_sections_with_progress: ICourseSection[];
  name: string;
  program: CourseProgram;
  course_type: string;
}
export interface ShortCourseDetail {
  metadata: IMetaData;
  class_user_id: string;
  code: string;
  is_passed: boolean;
  passed_at: string;
  user_certificate_id: string;
  user_certificate_url: string;
  remind_choosing_exam: RemindChoosingExam;
  exam: ExaminationSubject | null;
  data: Data;
  class_type: string;
}

export interface ITooltip {
  showTooltip?: boolean;
  color?: string;
  children: ReactNode;
  title: ReactNode;
  placement?: TooltipPlacement;
  className?: string;
  arrow?: boolean;
  rootClassName?: string;
}

export interface IActivityResource {
  title: string;
  items: { title: string; download: () => void; url?: string }[];
  setDataModal: (value: {
    title: string;
    download: () => void;
    url?: string;
  }) => void;
  setIsOpen: (value: boolean) => void;
}
export interface IActivityResourceProps {
  title: string;
  items: { title: string; download: () => void }[];
  visible: boolean;
  onClose: () => void;
  setDataModal: (value: {
    title: string;
    download: () => void;
    url?: string;
  }) => void;
  setIsOpen: (value: boolean) => void;
}

export interface BreadcrumbProps {
  tabs?: ITabs[];
  currentPage: string;
  className?: string;
}

export interface IFilterProps {
  courses: ICourseAll;
  setPage?: Dispatch<SetStateAction<number>>;
}

export interface DesktopFilter3LevelProps {
  courses: ICourseAll;
  filterType: { label: string; value: string };
  filterStatus: { label: string; value: string };
  setFilterType: (value: { label: string; value: string }) => void;
  setFilterStatus: (value: { label: string; value: string }) => void;
  totalResults: number;
}

export interface MobileFilter3LevelProps {
  courses: ICourseAll;
  filterType: { label: string; value: string };
  filterStatus: { label: string; value: string };
  tempType: { label: string; value: string };
  tempStatus: { label: string; value: string };
  setTempType: (value: { label: string; value: string }) => void;
  setTempStatus: (value: { label: string; value: string }) => void;
  openDrawer: boolean;
  setOpenDrawer: (value: boolean) => void;
  confirmFilter: () => void;
}

export interface ILearningOutcomeProps {
  title: string;
  items: { title: string }[];
  visible: boolean;
  onClose: () => void;
}

export interface ISearchFormProps {
  placeholder: string;
  formStyle?: string;
  setPage?: Dispatch<SetStateAction<number>>;
  className?: string;
}

export type IBadge = {
  label?: string | React.ReactNode;
  badgeType?: string;
  isBold?: boolean;
};

export interface DetailCourseProps {
  class_user_id: string;
  data: ICourseSection[];
  loading: boolean;
}

export interface CourseInfo {
  name: string;
  courseType: string;
  category: string;
}

export type SectionContentProps = {
  title?: string;
  sections: ISubSection[];
  class_user_id: string;
  refetch?: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined,
  ) => Promise<QueryObserverResult<IActivity3Level, unknown>>;
};

export type SectionContentModalProp = {
  sections: ISubSection[];
  visible: boolean;
  onClose: () => void;
  class_user_id: string;
};

export type TimeLineProp = {
  items: {
    text: string;
    time: number;
  }[];
  visible: boolean;
  onClose: () => void;
  onGoTimeline?: (time: number) => void;
};

export interface ActivityBarProps {
  activeTab: string;
  onTabChange: (key: string) => void;
}

export type IActivityTab = {
  key: string;
  icon: ReactNode;
};

export type Courses3LevelMenuProps = {
  openDrawer?: boolean;
};

export interface BaseModalProps {
  title?: ReactNode;
  visible: boolean;
  onClose: (
    e?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
  ) => void;
  footer?: boolean | ReactNode;
  closable?: boolean;
  centered?: boolean;
  width?: number | string;
  style?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
  wrapClassName?: string;
  children: React.ReactNode;
}

export interface BaseDrawerProps extends DrawerProps {
  title?: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  height?: string | number;
  className?: string;
}

export interface EmptyCourseProps {
  description?: string;
}
export type ICourseAttemptProps = {
  class_user_id: string;
  section: ICourseSection;
};

export type ICourseSectionProps = {
  section: ICourseSection;
  class_user_id: string;
};

export type ICourseSectionButtonProps = {
  section: ICourseSection;
  class_user_id: string;
  setOpenTest: Dispatch<SetStateAction<boolean>>;
};

export type ISubSectionProps = {
  sub: ISubSection;
  index: number;
  sectionIndex: number;
  class_user_id: string;
};

export type SectionCourseProp = {
  class_user_id: string;
  section: ICourseSection;
  sectionIndex: number;
};

export interface IBaseButtonProps extends IButtonProps {
  variant?: "primary" | "secondary" | "black" | "black-border";
  isSecondaryButton?: boolean;
}

export interface BreadcrumbItem {
  id: string | number;
  name: string;
  course_section_type: string;
}

export interface BreadcrumbResponse {
  data: BreadcrumbItem[];
}

export interface ActivityFileResource {
  name: string;
  url: string;
  file_key: string;
}

export interface ActivityFile {
  resource: ActivityFileResource;
}

export interface CourseDetailActivity {
  activities: Array<{
    id: string;
    name: string;
    type: string;
  }>;
  sectionId: string;
  course_section_tree: ISubSection[];
}

export interface ModalResizeableProps {
  open: boolean;
  title?: string | ReactNode;
  children: ReactNode;
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
  dragHandleClassName?: string;
  header?: ReactNode;
  onClose: () => void;
  position?: string;
}

export interface IPdfModal {
  open: boolean;
  title: string;
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
  dragHandleClassName?: string;
  header?: ReactNode;
  onClose: () => void;
  fileUrl: string;
  position?:
    | "top left"
    | "top middle"
    | "top right"
    | "bottom left"
    | "bottom middle"
    | "bottom right"
    | "center left"
    | "center right"
    | "center";
}

export type ScratchPadItem = {
  id: string;
  type: string;
  file?: string;
  fileName?: string;
};

export interface QuizDetail {
  id: string;
  name: string;
  is_graded: boolean;
  grading_method: string;
  is_limited: boolean;
  limit_count: string;
  is_tutor: boolean;
  quiz_timed: number | null;
  quiz_type: string;
  grading_preference: string;
}

export type QuestionTab = {
  id: string;
  question_topic_id: string;
  qType: string;
};

export interface UploadState {
  status: boolean;
  question_id: string | number;
  requirementIndex?: number;
}
export interface TimerRefType {
  handleGetTime: () => number;
}

export interface RefType {
  handleReset: () => void;
}

export interface EditorRefType {
  reset: () => void;
}

export interface Tab {
  id: string;
  qType: string;
  viewed: boolean;
  flag: boolean;
  done: boolean;
  index: number;
  response_type: number;
  data?: IQuestion;
  topicDescription?: {
    description?: string;
    files?: { resource: { url: string; name: string } }[];
    exhibits?: IExhibit[];
    questions?: { exhibits?: IExhibit[] }[];
  };
  answer?: TabAnswer;
  corrects?:
    | Record<string, boolean>
    | {
        corrects: {
          id: string;
          answer: string;
          is_correct: boolean;
          answer_position: number;
        }[];
      }
    | undefined;
  solution?: string;
  hightlight?: string;
  hightlightTopic?: string;
  timeSpent?: number;
  attempted?: boolean;
  answer_file?: {
    file_key?: string;
    file_name?: string;
  };
  is_viewed_answer: boolean;
}

export type MatchingAnswer = {
  question_id: string;
  answer_id?: string;
}[];

export type DragDropAnswer = {
  id: string;
  value: string;
  idAnswer?: string;
}[];

export type OneChoiceAnswer = string;
export type MultipleChoiceAnswer =
  | string
  | { question_id: string; answer_id?: string }
  | { id: string; value: string; idAnswer?: string };

export type SelectWordAnswer = string[];
export type FillWordAnswer = string[];
export type TabAnswer =
  | OneChoiceAnswer
  | MultipleChoiceAnswer[]
  | MatchingAnswer
  | DragDropAnswer
  | SelectWordAnswer
  | FillWordAnswer;

export interface IHeaderTestProps {
  quizDetail: {
    name: string;
    quiz_timed?: number | null;
    quiz_type: string;
    is_limited: boolean;
  };
  quizAttempt: {
    id: string;
    number_of_attempts: number;
    is_limited: boolean;
    created_at?: string;
    quiz_timed?: number;
  };
  openLimit: boolean;
  handleSubmitQuestion: (type_submit: "timeout" | "submit") => Promise<void>;
  timeRef: ForwardedRef<unknown>;
  quizAttempId: {
    id: string;
    number_of_attempts: number;
    is_limited: boolean;
  };
  setUnSubmitAnswer: Dispatch<SetStateAction<boolean>>;
  checkUnSubmitAnswer: () => number[];
  setOpenQuit: Dispatch<SetStateAction<boolean>>;
  setSubmitEventTest: Dispatch<SetStateAction<boolean>>;
  type: string | string[] | undefined;
  submited: boolean;
  setOpenSubmit: Dispatch<SetStateAction<boolean>>;
}

export interface CountDownProps {
  remainTime: number;
  onTimeOut?: () => void;
}

export interface CountDownRef {
  handleGetTime: () => number;
}

export interface PageLinkProps {
  active?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
  arrow?: boolean;
  type?: string;
  isViewedProp?: boolean;
  isFlagedProp?: boolean;
}

export interface IQuestionTab {
  id: string;
  index: number;
  qType: string;
  attempted?: boolean;
  done?: boolean;
  flag?: boolean;
}

export interface ITabSlideProps {
  data: IQuestionTab[];
  setCurrentTab?: (id: string) => void;
  currentTab: string;
  handleChangeTab?: (id: string) => void;
  activeShowAll: boolean;
  setActiveShowAll: (value: boolean) => void;
  setValueFilter: UseFormSetValue<FieldValues>;
  isScrollCenter?: boolean;
}

export interface IProps {
  id: string | undefined;
  content: string;
  uuid: string | number;
  count: number;
  isActiveTab: boolean;
  handleCloseTab: () => void;
  countNote: number;
}

export type CalcState = {
  total: string | null;
  next: string | null;
  operation: string | null;
};

export type NoteFormData = {
  [key: string]: string;
};
export interface IActivity3Level {
  id: string;
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
  children: any;
  activity_type: string;
  position: string;
  parent_id: string;
  total_activity: number;
  activity_count: number;
  course_section_type: "ACTIVITY" | "UNIT" | "CHAPTER_TEST" | "STORY";
  display_icon: "TEXT" | "VIDEO";
  learning_progress: {
    duration: number;
    time_spent: number;
    total_course_sections: number;
    total_course_sections_completed: number;
  };
  type: "video" | "text" | "list";
  course_outcomes: {
    id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string;
    description: string;
  }[];
  files: ActivityFile[];
  quiz: {
    id: string;
    case_study_story?: {
      id: string;
      instances: Array<{
        id: string;
        created_at: string;
        position: number;
        question_topic_id: string;
        question_topic: {
          id: string;
          name: string;
          number_of_multiple_choice_questions: number;
          number_of_essay_questions: number;
        };
      }>;
    };
    attempt: IAttempt[];
    quiz_timed: number;
    required_percent_score: number;
    is_limited: boolean;
    limit_count: number;
    grading_method: string;
    is_graded: boolean;
    quiz_question_instances?: {
      id: string;
      question_id: string;
    }[];
  };
  course_tab_documents: ICourseTabDocument[];
  class_id?: string;
  class_user_id?: string;
  next_activity: INeighborActivity;
  previous_activity: INeighborActivity;
  breadcumb?: IBreadcrumb[];
  user_course_section_progress: {
    id: string;
    total_course_sections: number;
    total_course_sections_completed: number;
  }[];
  is_preview_locked?: boolean;
  course_section_link_parents: CourseSectionLinkParent[];
  section_root: {
    id: string;
    name: string;
  };
  course: {
    name: string;
  };
}

export * from "./course"
export * from "./button"