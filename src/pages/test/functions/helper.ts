import { TestAPI } from '@pages/api/test'
import { QUESTION_TYPES, TEST_TYPE } from 'src/constants'

export const getResult = async (currentTabContent: any) => {
  const res = await TestAPI.getQuestionAnswer(currentTabContent.id)
  let corrects = {} as any
  if (
    currentTabContent.qType === QUESTION_TYPES.ONE_CHOICE ||
    currentTabContent.qType === QUESTION_TYPES.TRUE_FALSE ||
    currentTabContent.qType === QUESTION_TYPES.MULTIPLE_CHOICE
  ) {
    corrects = res?.data?.[0].answers?.reduce(
      (previousValue: any, currentValue: any) => {
        return {
          ...previousValue,
          [currentValue.id]: currentValue.is_correct,
        }
      },
      {} as { [key: string]: boolean },
    )
  } else if (
    currentTabContent.qType === QUESTION_TYPES.FILL_WORD ||
    currentTabContent.qType === QUESTION_TYPES.SELECT_WORD
  ) {
    corrects = { corrects: [...res?.data?.[0]?.answers] }
  } else if (currentTabContent.qType === QUESTION_TYPES.MATCHING) {
    corrects = { corrects: [...res?.data?.[0]?.question_matchings] }
  } else if (currentTabContent.qType === QUESTION_TYPES.DRAG_DROP) {
    corrects = {
      corrects: [
        ...res?.data?.[0]?.answers?.sort(
          (a: any, b: any) => a?.answer_position - b?.answer_position,
        ),
      ],
    }
  }
  return {
    corrects: corrects,
    solution: res?.data?.[0]?.solution,
    isSelfReflection: res?.data?.[0]?.is_self_reflection,
    requirements: res?.data?.[0]?.requirements,
  }
}

export const checkTypeAndRenderTitle = (type: string) => {
  let pageTitle = ''
  switch (type) {
    case TEST_TYPE.MID_TERM_TEST:
      return (pageTitle = 'Midterm Test')
    case TEST_TYPE.FINAL_TEST:
      return (pageTitle = 'Final Test')
    case TEST_TYPE.TOPIC_TEST:
      return (pageTitle = 'Topic Test')
    case TEST_TYPE.CHAPTER_TEST:
      return (pageTitle = 'Chapter Test')
    case TEST_TYPE.PART_TEST:
      return (pageTitle = 'Part Test')
    case TEST_TYPE.ENTRANCE_TEST:
      return (pageTitle = 'Entrance Test')
    case TEST_TYPE.ENTRANCE_TEST:
      return (pageTitle = 'Event Test')
    default:
      return pageTitle
  }
}
