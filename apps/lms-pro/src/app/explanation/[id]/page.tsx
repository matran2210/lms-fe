'use client'
import SappLoadingGlobal from '@components/common/SappLoadingGlobal'
import { AltArrowLeft, CloseIcon, MenuDotsIcon } from '@lms/assets'
import { UserType, useFeature } from '@lms/contexts'
import {
  IAtempt,
  IRequirement,
  LAYOUT,
  QUESTION_TYPES,
  TEST_ATTEMPT_TYPE,
} from '@lms/core'
import { FullScreenLayout, PDFViewer } from '@lms/ui'
import { Tooltip } from 'antd'
import { handleMultipleCorrectAnswer } from '@lms/utils'
import { ExplanationPackageV2 } from '@sapp-fe/explanation-package'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CoursesAPI } from 'src/api/courses'
import { TestServiceAPI } from 'src/api/test-api'
import { PageLink } from 'src/constants/routers'
import { withAuthorization } from '@lms/hoc'
import {
  DrawerListQuestion,
  ListQuestion,
  ModalListQuestion,
} from '@lms/feature-courses'
import { useQuery } from 'react-query'
import { useTailwindBreakpoint } from '@lms/hooks'

const Explanation = () => {
  const router = useRouter()
  const searchParam = useSearchParams()
  const params = useParams()
  const { id } = params
  const query = Object.fromEntries(searchParam.entries())
  const { query: queryParams } = useFeature()
  const { attempt: noOfAttempt } = query
  const [activeQuestion, setActiveQuestion] = useState<any>()
  const [attempt, setAttempt] = useState<IAtempt>()
  const [loading, setLoading] = useState<boolean>(false)
  const { isMobileView } = useTailwindBreakpoint()
  const [openTooltip, setOpenTooltip] = useState<boolean>(false)
  const [isOpenModalListQuestion, setIsOpenModalListQuestion] =
    useState<boolean>(false)
  const [isOpenDrawerListQuestion, setIsOpenDrawerListQuestion] =
    useState<boolean>(false)
  const previousUrl = queryParams?.tabId
    ? localStorage.getItem('previousUrl') + `?tabId=${queryParams?.tabId}`
    : localStorage.getItem('previousUrl')
  function getCorrect(answers: any, questionType: any) {
    switch (questionType as QUESTION_TYPES) {
      case QUESTION_TYPES.ONE_CHOICE:
      case QUESTION_TYPES.TRUE_FALSE:
        const correctAnswers = answers
        const corrects = Object?.fromEntries(
          correctAnswers?.map((answer: any) => [answer.id, answer.is_correct]),
        )
        return corrects
      case QUESTION_TYPES.MULTIPLE_CHOICE:
        return Object.fromEntries(
          (answers || [])?.map((originalAnswer: any) => [
            originalAnswer.id,
            originalAnswer.is_correct,
          ]),
        )
      case QUESTION_TYPES.FILL_WORD:
      case QUESTION_TYPES.SELECT_WORD:
        return answers || []
      case QUESTION_TYPES.MATCHING:
        return answers || []
      case QUESTION_TYPES.DRAG_DROP:
        return answers || []
      default:
        return {}
    }
  }
  const getActiveQuestion = async (id: string) => {
    setLoading(true)
    try {
      // const quizAttempts = axiosInstance.get('')
      // const selectedResponseAnswers = data.data.selectedResponseAnswers
      const resultResponse = await CoursesAPI.getQuizAttempt(id)
      const topicDescription = await TestServiceAPI.getTopicDescription(
        resultResponse?.data?.answer?.question?.question_topic_id,
        resultResponse?.data?.answer?.quiz_attempt?.quiz?.id,
      ) // const newActiveQuestion = { ...selectedResponseAnswers[0].question }
      const questionType = resultResponse?.data?.answer?.question?.qType
      const answerTemp = resultResponse?.data?.answer?.question?.answers || []
      setAttempt(resultResponse?.data?.answer?.quiz_attempt)
      setActiveQuestion({
        ...resultResponse.data.answer.question,
        program: resultResponse.data.program,
        answer_file: resultResponse.data.answer.answer_file,
        active: resultResponse.data.answer.active,
        confirmed: true,
        grading_question: resultResponse.data.answer.grading_question,
        corrects: getCorrect(
          questionType !== QUESTION_TYPES.MATCHING
            ? answerTemp
            : resultResponse?.data?.answer?.answer_matching_mapping,
          resultResponse?.data?.answer?.question?.qType,
        ),
        question_matchings:
          resultResponse?.data?.answer?.answer_matching_mapping,
        answers:
          questionType === QUESTION_TYPES.DRAG_DROP
            ? handleMultipleCorrectAnswer(
              resultResponse?.data?.answer?.question?.drag_drop_answers,
              resultResponse?.data?.answer?.answer,
              answerTemp,
            )
            : answerTemp,
        myAnswers: [
          {
            question_id: resultResponse?.data?.answer?.question?.id,
            question_answer_id:
              resultResponse?.data?.answer?.question_answer_id,
            answer: resultResponse?.data?.answer?.answer,
          },
        ],
        defaultValue: resultResponse?.data?.answer?.answer,
        next: resultResponse?.data?.next,
        previous: resultResponse?.data?.previous,
        total_question: resultResponse?.data?.total_question,
        index: resultResponse?.data?.index,
        answer_position_mapping:
          resultResponse?.data?.answer?.answer_position_mapping,
        question_topic: topicDescription?.data,
        short_answer: resultResponse?.data?.answer?.short_answer,
        response_option_answer: resultResponse?.data?.answer?.response_option,
      })
    } catch (error) {
    } finally {
      setLoading(false)
      setIsOpenModalListQuestion(false)
    }
  }
  const quizId = attempt?.id
  const { data: questions, isLoading: loadingAttempt } = useQuery({
    queryKey: ['list-question', quizId],
    queryFn: () => CoursesAPI.getQuizAttempts(quizId!),
    select: (data) => data.data,
    enabled: !!quizId,
    retry: false,
  })
  useEffect(() => {
    if (id) {
      getActiveQuestion(id as string)
    }
  }, [id])

  const handleDownload = async (data: {
    files: { name: string; file_key: string }[]
  }) => {
    try {
      await TestServiceAPI.downloadFile(data)
    } catch (error) { }
  }

  const isUserViewAnswers = query?.title === 'Your Answers Detail'
  const viewAnswersType = query?.type
  // const isUserViewAnswersDetailAndEssay =
  //   isUserViewAnswers && activeQuestion?.qType === QUESTION_TYPES.ESSAY

  return (
    <SappLoadingGlobal loading={loading}>
      <FullScreenLayout title="Detailed Explanation">
        <div
          className="absolute left-8 top-5 z-10 cursor-pointer"
          onClick={() => {
            if (isUserViewAnswers) {
              router.push(
                `/courses/${viewAnswersType}/your-answers-detail/${attempt?.id}`,
              )
            } else {
              if (attempt?.quiz.id) {
                switch (attempt?.quiz.quiz_type) {
                  case TEST_ATTEMPT_TYPE.ENTRANCE_TEST:
                    const searchParams = noOfAttempt
                      ? `attempt=${noOfAttempt}`
                      : ''
                    router.push(
                      `/entrance-test/table-result/${attempt?.id}?${searchParams}`,
                    )
                    break
                  case TEST_ATTEMPT_TYPE.CHAPTER_TEST:
                  case TEST_ATTEMPT_TYPE.FINAL_TEST:
                  case TEST_ATTEMPT_TYPE.MID_TERM_TEST:
                  case TEST_ATTEMPT_TYPE.MOCK_TEST:
                  case TEST_ATTEMPT_TYPE.TOPIC_TEST:
                    router.push(`/courses/test/test-result/${attempt?.id}`)
                    break
                  default:
                    router.push(previousUrl ?? PageLink.ENTRANCE_TEST)
                }
              } else {
                router.push(previousUrl ?? PageLink.ENTRANCE_TEST)
              }
            }
          }}
        >
          <div className="hidden rounded-md bg-gray-200 p-2 transition-all duration-300 ease-in-out hover:bg-gray-300 md:!block">
            <AltArrowLeft />
          </div>
          <div className="rounded-md bg-gray-200 p-2 transition-all duration-300 ease-in-out hover:bg-gray-300 md:!hidden">
            <CloseIcon className="h-[18px] w-[18px]" />
          </div>
        </div>
        <div className="absolute right-8 top-6 z-10 flex cursor-pointer items-center justify-center">
          <Tooltip
            placement="left"
            trigger="click"
            open={openTooltip}
            onOpenChange={setOpenTooltip}
            title={
              <div className="flex flex-col gap-2">
                <span
                  className="text-sm md:!hidden"
                  onClick={() => {
                    setOpenTooltip(false)
                  }}
                >
                  Show comment
                </span>
                <span
                  className="text-sm"
                  onClick={() => {
                    setOpenTooltip(false)
                    if (isMobileView) {
                      setIsOpenDrawerListQuestion(true)
                    } else {
                      setIsOpenModalListQuestion(true)
                    }
                  }}
                >
                  Show list questions
                </span>
              </div>
            }
            className="block xl:hidden"
          >
            <button className="text-icon">
              <MenuDotsIcon />
            </button>
          </Tooltip>
        </div>
        {!loading && activeQuestion && (
          <ExplanationPackageV2
            getActiveQuestion={getActiveQuestion}
            RenderAllQuestions={
              <ListQuestion
                questions={questions}
                getActiveQuestion={getActiveQuestion}
              />
            }
            activeQuestion={{
              ...activeQuestion,
              solution: activeQuestion?.solution,
              requirements: activeQuestion?.requirements.map(
                (req: IRequirement) => ({
                  ...req,
                  explanation: req.explanation,
                }),
              ),
              // ...(isUserViewAnswersDetailAndEssay && {
              //   grading_method: GRADING_METHOD.MANUAL,
              // }),
            }}
            document_id={''}
            handleDownload={handleDownload}
            renderPdf={({
              url,
              fileName,
            }: {
              url: string
              fileName?: string | undefined
            }) => {
              return <PDFViewer file={url} />
            }}
          />
        )}
        <ModalListQuestion
          questions={questions}
          getActiveQuestion={getActiveQuestion}
          isOpen={isOpenModalListQuestion}
          setIsOpen={setIsOpenModalListQuestion}
        />
        <DrawerListQuestion
          questions={questions}
          getActiveQuestion={getActiveQuestion}
          isOpen={isOpenDrawerListQuestion}
          setIsOpen={setIsOpenDrawerListQuestion}
        />
      </FullScreenLayout>
    </SappLoadingGlobal>
  )
}
export default withAuthorization([UserType.STUDENT])(Explanation)
Explanation.layout = LAYOUT.FULLSCREEN_LAYOUT
