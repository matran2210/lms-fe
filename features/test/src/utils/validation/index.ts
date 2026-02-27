import {
  AnswerItem,
  DEFAULT_EDITOR_VALUE,
  IDataQuestion,
  QUESTION_TYPES,
  Requirement,
  RESPONSE_OPTION,
} from "@lms/core";
import { checkSheetAnswered } from "@lms/utils";
import { isEmpty } from "lodash";

// Validate các câu hỏi xem đã trả lời chưa
export const validateAnswer = (item: {
  answer: string | AnswerItem[] | string[];
  answer_file?: { file_key?: string; file_name?: string };
}) => {
  if (item.answer_file?.file_key) return true;

  if (typeof item.answer === "string") {
    return item.answer.trim().length > 0;
  }

  if (!Array.isArray(item.answer) || item.answer.length === 0) {
    return false;
  }

  for (const el of item.answer) {
    // case: string in array
    if (typeof el === "string") {
      if (!el) return false;
      continue;
    }

    // case: AnswerItem
    if (Object.hasOwn(el, "idAnswer") && !el.idAnswer) return false;
    if (Object.hasOwn(el, "answer_id") && !el.answer_id) return false;
  }

  return true;
};

// validate essay question with requirement
export const validateEssayAnswerWithRequirement = (data: IDataQuestion) => {
  if (data?.requirements?.length > 0) {
    return data?.requirements?.some(
      (el: Requirement) => !!el?.answer_text || !!el?.answer_file?.file_key,
    );
  } else {
    return false;
  }
};

export interface CheckAnsweredInput {
  qType: QUESTION_TYPES;
  answer?: any;
  dragDropAnswer?: any[];
  fillWordAnswer?: string[];
  selectWordAnswer?: string[];
  essay?: {
    requirements?: Array<{
      id?: string;
      answer_text?: string;
      answer_file?: { file_key?: string };
    }>;
    answer_file?: { file_key?: string };
    response_option?: RESPONSE_OPTION;
    response_type?: number;
    editorValues?: any[];
  };
  isSubmit?: boolean;
}
export function checkAnsweredPure(input: CheckAnsweredInput): boolean {
  const { qType } = input;

  switch (qType) {
    case QUESTION_TYPES.ONE_CHOICE:
    case QUESTION_TYPES.TRUE_FALSE:
    case QUESTION_TYPES.MATCHING:
    case QUESTION_TYPES.MULTIPLE_CHOICE:
      console.log(
        "answer của one choice",
        !isEmpty(input.answer) && input.answer.length > 0,
      );
      return !isEmpty(input.answer) && input.answer.length > 0;

    case QUESTION_TYPES.DRAG_DROP:
      return (
        input.dragDropAnswer?.some((e) => e?.idAnswer && e?.value !== "") ??
        false
      );

    case QUESTION_TYPES.SELECT_WORD:
      return (
        input.selectWordAnswer?.some((e: string) => e && e !== "") ?? false
      );

    case QUESTION_TYPES.FILL_WORD:
      return input.fillWordAnswer?.some((e: string) => !!e) ?? false;

    case QUESTION_TYPES.ESSAY: {
      const essay = input.essay;
      if (!essay) return false;

      // File level
      if (essay.answer_file?.file_key) return true;

      // Requirement level
      if (Array.isArray(essay.requirements)) {
        for (const req of essay.requirements) {
          if (req.answer_file?.file_key || req.answer_text) {
            return true;
          }
        }
      }

      // Editor values
      if (essay.editorValues?.length) {
        return essay.editorValues.some((v: string) =>
          essay.response_option === RESPONSE_OPTION.SHEET
            ? checkSheetAnswered(v)
            : v && v !== DEFAULT_EDITOR_VALUE,
        );
      }

      return false;
    }

    default:
      return false;
  }
}
