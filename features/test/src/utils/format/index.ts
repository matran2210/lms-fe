import { QUESTION_TYPES } from "@lms/core"

export interface FormatAnswerInput {
  question: any
  isAnswered: boolean
  timeSpent: number // seconds
  totalAttemptTime?: number // seconds
  scratchPads?: string
}

export function formatSubmitAnswer({
  question,
  isAnswered,
  timeSpent,
  totalAttemptTime,
  scratchPads,
}: FormatAnswerInput) {
  const baseAnswer = {
    question_id: question.id,
    time_spent: timeSpent,
  }

  if (question.qType === QUESTION_TYPES.ESSAY) {
    if (!isAnswered) return null

    const requirements = question?.data?.requirements ?? []

    if (requirements.length > 0) {
      return {
        question_id: question.id,
        total_attempt_time: totalAttemptTime,
        scratch_pads: scratchPads ?? [],
        answer: requirements.map((req: any) => ({
          question_id: question.id,
          requirement_id: req?.id ?? null,
          short_answer: req?.answer_text ?? '',
          response_option:
            question?.data?.response_option ??
            (question?.response_type === 0 ? 'WORD' : 'SHEET'),
          time_spent: timeSpent,
          ...(!!(req?.answer_text || req?.answer_file) && {
            active: 'SUBMITED',
          }),
          answer_file: req?.answer_file ?? null,
        })),
      }
    }

    return {
      ...baseAnswer,
      short_answer: question?.answer ?? '',
      requirement_id: null,
      response_option:
        question?.data?.response_option ??
        (question?.response_type === 0 ? 'WORD' : 'SHEET'),
      ...(!!(question?.answer || question?.answer_file) && {
        active: 'SUBMITED',
      }),
      answer_file: question?.answer_file ?? null,
    }
  }

  if ([QUESTION_TYPES.ONE_CHOICE, QUESTION_TYPES.TRUE_FALSE].includes(question.qType)) {
    return question?.answer
      ? { ...baseAnswer, question_answer_id: question.answer }
      : baseAnswer
  }

  if (question.qType === QUESTION_TYPES.MULTIPLE_CHOICE) {
    return {
      ...baseAnswer,
      answer: (question.answer ?? []).map((id: string) => ({ answer_id: id })),
    }
  }

  if (question.qType === QUESTION_TYPES.MATCHING) {
    return { ...baseAnswer, answer: question.answer }
  }

  if (question.qType === QUESTION_TYPES.DRAG_DROP) {
    return {
      ...baseAnswer,
      answer: (question.answer ?? [])
        .filter((i: any) => i?.idAnswer)
        .map((i: any) => ({
          answer_id: i.idAnswer,
          answer_position: i.position,
        })),
    }
  }

  if (question.qType === QUESTION_TYPES.SELECT_WORD) {
    return { ...baseAnswer, answer: question.answer }
  }

  if (question.qType === QUESTION_TYPES.FILL_WORD) {
    return {
      ...baseAnswer,
      answer: (question.answer ?? [])
        .filter((t: string) => t)
        .map((t: string, i: number) => ({
          answer_text: t,
          answer_position: i + 1,
        })),
    }
  }

  return null
}

export function buildQuestionResult(
  qType: QUESTION_TYPES,
  response: any,
) {
  let corrects: any = {}

  if (
    qType === QUESTION_TYPES.ONE_CHOICE ||
    qType === QUESTION_TYPES.TRUE_FALSE ||
    qType === QUESTION_TYPES.MULTIPLE_CHOICE
  ) {
    corrects =
      response?.answers?.reduce(
        (acc: Record<string, boolean>, cur: any) => {
          acc[cur.id] = cur.is_correct
          return acc
        },
        {},
      ) ?? {}
  } else if (
    qType === QUESTION_TYPES.FILL_WORD ||
    qType === QUESTION_TYPES.SELECT_WORD
  ) {
    corrects = { corrects: [...(response?.answers ?? [])] }
  } else if (qType === QUESTION_TYPES.MATCHING) {
    corrects = { corrects: [...(response?.question_matchings ?? [])] }
  } else if (qType === QUESTION_TYPES.DRAG_DROP) {
    corrects = {
      corrects: [...(response?.answers ?? [])].sort(
        (a: any, b: any) => a.answer_position - b.answer_position,
      ),
    }
  }

  return {
    corrects,
    solution: response?.solution,
    isSelfReflection: response?.is_self_reflection,
    requirements: response?.requirements,
    dragDropAnswers:
      qType === QUESTION_TYPES.DRAG_DROP
        ? response?.drag_drop_answers
        : undefined,
  }
}
