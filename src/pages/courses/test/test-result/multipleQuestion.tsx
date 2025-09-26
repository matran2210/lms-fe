import 'aos/dist/aos.css'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import React, { useRef, useState } from 'react'
import { useTailwindBreakpoint } from 'src/hooks/useTailwindBreakpoint'
import { ANIMATION, GRADE_STATUS, PageLink } from 'src/constants'
import { IAnswer } from 'src/type'
import Recommendation from './Recommendation'
import { COMMENTS } from 'src/constants/grade'
import ButtonPrimary from '@components/base/button/ButtonPrimary'

interface MultipleQuestionProps {
  questions: any
  className?: string
  multipleQuestionRef?: React.RefObject<HTMLDivElement>
  isTeacher?: boolean
}

const MultipleQuestion = ({
  questions,
  className,
  multipleQuestionRef,
  isTeacher,
}: MultipleQuestionProps) => {
  const { isLargeDesktopView } = useTailwindBreakpoint()
  const router = useRouter()
  const [showMore, setShowMore] = useState<boolean>(false)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const elementRef = useRef<HTMLDivElement>()
  const [openRecommendation, setOpenRecommendation] = useState<boolean>(false)

  const isGradeFinish =
    questions?.quizAttempt?.grading_status === GRADE_STATUS.FINISHED_GRADING

  /**
   * handle when scroll x for questions
   */
  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true)
    elementRef.current && setStartX(event.pageX - elementRef.current.offsetLeft)
    elementRef.current && setScrollLeft(elementRef.current.scrollLeft)
  }

  /**
   * handle when scroll x for questions
   */
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return
    if (elementRef.current) {
      const x = event.pageX - elementRef.current.offsetLeft
      const distance = (x - startX) * 2
      elementRef.current.scrollLeft = scrollLeft - distance
    }
  }

  const renderBoxesAndLineClass = (type: string, data: IAnswer) => {
    if (type === 'Constructed Questions') {
      return questions?.quizAttempt?.grading_status ===
        GRADE_STATUS.FINISHED_GRADING
        ? 'text-info border-info hover:bg-info-50'
        : data?.question?.qType === 'ESSAY' && data?.active === 'SUBMITED'
          ? ' text-info border-info hover:bg-info-50'
          : ' text-warning border-warning hover:bg-warning-50'
    }
    return data?.is_correct
      ? 'text-success border-success hover:bg-success-50'
      : ' text-error border-error hover:bg-error-50'
  }

  const renderBoxes = (
    type: string,
    data: any,
    totalBefore: number,
    extra?: React.ReactNode,
    showMore?: boolean,
  ) => {
    const renderBoxItems = (data || [])?.map((item: IAnswer, index: number) => {
      return (
        <button
          key={item?.id}
          onClick={() => {
            router.push(
              `${isTeacher ? PageLink.TEACHER_EXPLANATION : '/explanation'}/${item?.id}?title=My Course`,
            )
          }}
          disabled={
            questions?.quizAttempt?.status === 'UN_SUBMITTED' || !item?.id
          }
          className={`flex h-[38px] w-[38px] cursor-pointer flex-row items-center justify-center rounded border border-solid text-sm font-medium
            ${renderBoxesAndLineClass(type, item)}
          `}
        >
          {index + totalBefore + 1}
        </button>
      )
    })

    return (
      data?.length > 0 && (
        <div className="w-full">
          <div className="flex items-center justify-between">
            <div className="mb-6 text-base font-semibold text-gray-800 md:text-xl">
              {type}
            </div>
            <div className="mb-6">{extra}</div>
          </div>
          <div className="w-full overflow-x-auto">
            <div
              className={clsx('', {
                'grid grid-cols-7 gap-3': isLargeDesktopView,
                'flex flex-wrap gap-4':
                  (showMore && !isLargeDesktopView) ||
                  (!showMore && !isLargeDesktopView && data.length <= 10),
                'grid min-w-max grid-flow-col grid-rows-2 gap-3 sm:min-w-0 sm:grid-flow-row sm:grid-cols-[repeat(auto-fit,_minmax(38px,_1fr))] sm:grid-rows-none md:grid-cols-[repeat(auto-fit,_minmax(38px,_1fr))] md:gap-4':
                  !showMore &&
                  !isLargeDesktopView &&
                  data.length > 10 &&
                  data.length <= 20,
                // 'grid min-w-max grid-flow-col gap-5':
                //   !showMore && !isLargeDesktopView,

                'mb-2 grid min-w-max grid-flow-col grid-rows-2 gap-3 md:gap-5 lg:min-w-0 lg:grid-flow-row lg:grid-cols-[repeat(auto-fit,_minmax(38px,_1fr))] lg:grid-rows-none':
                  !showMore &&
                  !isLargeDesktopView &&
                  data.length > 20 &&
                  data.length <= 35,
                'mb-2 grid min-w-max grid-flow-col grid-rows-2 gap-3 md:gap-5 md:gap-y-4 lg:grid-cols-[repeat(auto-fit,_minmax(38px,_1fr))]':
                  !showMore && !isLargeDesktopView && data.length > 35,
              })}
            >
              {renderBoxItems}
            </div>
          </div>
        </div>
      )
    )
  }

  const renderLines = (type: string, data: any, totalBefore: number) => {
    const renderBoxItems = data?.map((item: IAnswer, index: number) => {
      return (
        <button
          key={item?.id}
          disabled={
            questions?.quizAttempt?.status === 'UN_SUBMITTED' || !item.id
          }
          onClick={() => {
            if (
              questions?.quizAttempt?.status === 'UN_SUBMITTED' ||
              !item?.id
            ) {
              return
            } else {
              router.push(
                `${isTeacher ? PageLink.TEACHER_EXPLANATION : '/explanation'}/${item?.id}?title=My Course`,
              )
            }
          }}
          className={`flex h-8 w-8 flex-none flex-row items-center justify-center rounded border border-solid text-sm font-medium
            leading-[33px] xl:h-[38px] xl:w-[38px]
            ${renderBoxesAndLineClass(type, item)}
          `}
        >
          {index + totalBefore + 1}
        </button>
      )
    })

    return (
      <>
        {data.length > 0 && (
          <>
            <div
              className={`flex w-auto flex-row items-start gap-3 overflow-x-auto overflow-y-hidden ${
                type === 'Constructed Questions' && totalBefore > 0
                  ? 'border-l border-[#DCDDDD] pl-3'
                  : ''
              }`}
            >
              {renderBoxItems}
            </div>
          </>
        )}
      </>
    )
  }

  const annotationsMultipleChoiceQuestions = [
    {
      text: 'Correct',
      color: 'bg-success',
    },
    {
      text: 'Incorrect',
      color: 'bg-error',
    },
  ]

  const annotationsConstructedQuestions = [
    {
      text: 'Completed',
      color: 'bg-info',
    },
    {
      text: 'Not Completed',
      color: 'bg-warning',
    },
  ]

  const renderAnnotations = (
    annotationsList: {
      text: string
      color: string
    }[],
  ) => {
    return (
      <div
        className={clsx('text-xs md:text-base', {
          'grid w-full grid-cols-2 gap-y-3': isLargeDesktopView,
          'mx-auto flex items-center justify-center gap-8 md:gap-12':
            showMore && !isLargeDesktopView,
          'grid grid-cols-4 gap-x-12 gap-y-3': !showMore && !isLargeDesktopView,
        })}
      >
        {annotationsList?.map((annotation) => (
          <div key={annotation.text} className="flex items-center gap-2">
            <div
              className={`aspect-square h-4 w-4 rounded-full ${annotation.color}`}
            />
            <p>{annotation.text}</p>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="relative">
      <div
        className={`${className} fixed bottom-0 right-0 flex h-fit w-full flex-col items-start gap-y-5 overflow-auto rounded-xl rounded-t-[20px] bg-white p-4 shadow-sidebar-tablet md:px-8 
        lg:rounded-2xl xl:sticky xl:top-[104px] xl:!h-fit xl:p-6 xl:pl-7 xl:shadow-small`}
        ref={multipleQuestionRef}
      >
        <div
          className={`${
            showMore
              ? 'visible overflow-y-auto opacity-100 xl:mb-0'
              : 'invisible hidden h-0 opacity-0 xl:visible xl:block xl:h-auto xl:opacity-100'
          }
        xl:max-h-auto flex w-full flex-col items-start gap-10 duration-300 xl:overflow-visible`}
        >
          <div className="flex w-full flex-col items-start gap-8">
            {renderBoxes(
              'Multiple Choice Questions',
              questions?.selectedResponseAnswers ?? [],
              0,
              <>
                {Number(questions?.constructedResponseAnswers?.length || 0) >
                  0 && (
                  <div
                    className=" cursor-pointer text-sm font-medium underline xl:hidden"
                    onClick={() => {
                      setShowMore(!showMore)
                      if (multipleQuestionRef?.current) {
                        multipleQuestionRef.current.style.height = 'fit-content'
                      }
                    }}
                  >
                    {showMore ? 'Show less' : 'Show more'}
                  </div>
                )}
              </>,
              showMore,
            )}

            {questions?.selectedResponseAnswers?.length > 0 &&
              renderAnnotations(annotationsMultipleChoiceQuestions)}

            {questions?.constructedResponseAnswers?.length > 0 && (
              <div className="h-[1px] w-full bg-gray-300" />
            )}

            {renderBoxes(
              'Constructed Questions',
              questions?.constructedResponseAnswers ?? [],
              questions?.selectedResponseAnswers?.length ?? 0,
              null,
              showMore,
            )}

            {questions?.constructedResponseAnswers?.length > 0 &&
              renderAnnotations(annotationsConstructedQuestions)}
          </div>

          {isGradeFinish && (
            <ButtonPrimary
              size={'medium'}
              className={'mb-0 mt-6 px-11 text-medium-sm !font-medium'}
              title={COMMENTS.REQUEST_REGRADING}
              onClick={() => setOpenRecommendation(true)}
            />
          )}
        </div>
        <div className="bottom-0 mt-auto w-full bg-white xl:hidden">
          <div
            className={`flex ${showMore ? 'flex-row' : 'flex-col'} items-end justify-between gap-2 md:flex-row xl:items-center ${
              showMore ? 'items-center' : 'pt-0'
            }`}
          >
            <div className="flex w-full flex-grow flex-col gap-3 md:w-9/12 lg:w-11/12 xl:flex-row">
              <div
                ref={elementRef as React.LegacyRef<HTMLDivElement>}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
                className={`${
                  !showMore ? 'block' : 'hidden'
                } !max-h-[1040px] w-full duration-300 xl:hidden`}
              >
                {renderBoxes(
                  'Multiple Choice Questions',
                  questions?.selectedResponseAnswers ?? [],
                  0,
                  <div className="flex max-h-[40px] grow items-center justify-end">
                    {Number(
                      questions?.constructedResponseAnswers?.length || 0,
                    ) > 0 && (
                      <div
                        className="block cursor-pointer text-sm font-medium underline xl:hidden"
                        onClick={() => {
                          setShowMore(!showMore)
                          if (multipleQuestionRef?.current) {
                            multipleQuestionRef.current.style.height =
                              'fit-content'
                          }
                        }}
                      >
                        Show more
                      </div>
                    )}
                  </div>,
                  showMore,
                )}
                <div
                  className={
                    'mt-3 flex items-center justify-center gap-8 text-xs md:gap-12 md:text-base'
                  }
                >
                  {annotationsMultipleChoiceQuestions.map((annotation) => (
                    <div
                      key={annotation.text}
                      className="flex items-center gap-1 lg:gap-2"
                    >
                      <div
                        className={`aspect-square h-4 w-4 rounded-full md:h-5 md:w-5 ${annotation.color}`}
                      />
                      <p>{annotation.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Recommendation
        classId={questions?.class_id ?? ''}
        quizAttemptId={questions?.quizAttempt?.id ?? ''}
        openRecomendation={openRecommendation}
        setOpenRecomendation={setOpenRecommendation}
      />
    </div>
  )
}

export default MultipleQuestion
