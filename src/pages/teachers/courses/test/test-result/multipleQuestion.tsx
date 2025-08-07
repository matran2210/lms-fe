import { IconAnnotationGuide } from '@assets/icons'
import ButtonPrimary from '@components/base/button/ButtonPrimary'
import 'aos/dist/aos.css'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useRef, useState } from 'react'
import { ANIMATION, GRADE_STATUS, PageLink } from 'src/constants'
import { IAnswer } from 'src/type'

interface MultipleQuestionProps {
  questions: any
  className?: string
  multipleQuestionRef?: React.RefObject<HTMLDivElement>
  setOpenAnnotaion: (open: boolean) => void
}

const MultipleQuestion = ({
  questions,
  className,
  multipleQuestionRef,
  setOpenAnnotaion,
}: MultipleQuestionProps) => {
  const router = useRouter()
  const [showMore, setShowMore] = useState<boolean>(false)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const elementRef = useRef<HTMLDivElement>()

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
        ? ' text-graded-finish border-graded-finish'
        : data?.question?.qType === 'ESSAY' && data?.active === 'SUBMITED'
          ? ' text-pinned-1 border-pinned-1'
          : ' text-gray-1 border-gray-1'
    }
    return data?.is_correct
      ? ' text-state-success border-success'
      : ' text-state-error border-error'
  }

  const renderBoxes = (type: string, data: any, totalBefore: number) => {
    const renderBoxItems = data?.map((item: IAnswer, index: number) => {
      return (
        <button
          key={item?.id}
          onClick={() => {
            router.push(`/explanation/${item?.id}?title=My Course`)
          }}
          disabled={
            questions?.quizAttempt?.status === 'UN_SUBMITTED' || !item?.id
          }
          className={`flex aspect-1 cursor-pointer flex-row items-center justify-center border border-solid text-sm font-medium leading-8.5 xl:h-auto xl:w-auto
            ${renderBoxesAndLineClass(type, item)}
          `}
        >
          {index + totalBefore + 1}
        </button>
      )
    })

    return (
      <div className="w-full">
        {data?.length > 0 && (
          <>
            <div className="mb-4 text-lg-xl font-semibold text-bw-1 xl:text-xl xl:font-medium">
              {type}
            </div>
            <div
              className={clsx(
                'grid grid-cols-7 gap-2 md:grid-cols-15 xl:grid-cols-6 xl:gap-3',
                type === 'Multiple Choice Questions' ? 'mb-10' : '',
              )}
            >
              {renderBoxItems}
            </div>
          </>
        )}
      </div>
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
              router.push(`/explanation/${item?.id}?title=My Course`)
            }
          }}
          className={`flex h-8 w-8 flex-none flex-row items-center justify-center border border-solid text-sm font-medium
            leading-8.5 xl:h-12 xl:w-12
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
                  ? 'border-l border-default pl-3'
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

  return (
    <div className="relative">
      <div
        className={`${className} fixed bottom-0 right-0 flex w-full flex-col items-start gap-y-5 overflow-auto bg-white p-6 shadow-sidebar-tablet 
        xl:sticky xl:top-6 xl:!h-fit xl:max-h-[calc(100vh-65px)] xl:pb-0 xl:pl-7 xl:shadow-sidebar`}
        data-aos={ANIMATION.DATA_AOS}
        ref={multipleQuestionRef}
      >
        {/* <div className=""> */}
        <div
          className={`${
            showMore
              ? 'visible mb-4 h-96 overflow-y-auto opacity-100 xl:mb-0'
              : 'invisible hidden h-0 opacity-0 xl:visible xl:block xl:h-auto xl:opacity-100'
          }
        xl:max-h-auto flex w-full flex-col items-start gap-10 duration-300 xl:overflow-visible xl:pb-5`}
        >
          <div className="flex w-full flex-col items-start">
            {renderBoxes(
              'Multiple Choice Questions',
              questions?.selectedResponseAnswers ?? [],
              0,
            )}
            {renderBoxes(
              'Constructed Questions',
              questions?.constructedResponseAnswers ?? [],
              questions?.selectedResponseAnswers?.length ?? 0,
            )}
          </div>
        </div>
        <div className="bottom-0 mt-auto w-full bg-white xl:sticky">
          <div
            className={`flex max-w-full ${showMore ? 'flex-row' : 'flex-col'} items-end justify-between gap-2 border-default md:flex-row xl:items-center xl:py-6 ${
              showMore ? 'items-center border-t pt-4' : 'pt-0 xl:border-t'
            }`}
          >
            <div className="flex w-full flex-col gap-3 md:w-9/12 lg:w-11/12 xl:flex-row">
              <div
                className="flex cursor-pointer flex-row pr-2 text-center text-gray-1  hover:text-primary"
                onClick={() => setOpenAnnotaion(true)}
              >
                <div className="my-auto">
                  <IconAnnotationGuide />
                </div>
                <div className="text-xs my-auto ml-1 font-normal">
                  Annotation Guide
                </div>
              </div>
              <div
                ref={elementRef as React.LegacyRef<HTMLDivElement>}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
                className={`${
                  !showMore ? 'block' : 'hidden'
                } grid !max-h-[1040px] w-full grid-cols-2 gap-3 duration-300 xl:hidden`}
              >
                {renderLines(
                  'Multiple Choice Questions',
                  questions?.selectedResponseAnswers ?? [],
                  0,
                )}
                {renderLines(
                  'Constructed Questions',
                  questions?.constructedResponseAnswers ?? [],
                  questions?.selectedResponseAnswers?.length ?? 0,
                )}
              </div>
            </div>
            <div className="flex max-h-[40px] grow items-center justify-end md:w-1/5">
              {Number(questions?.selectedResponseAnswers?.length || 0) +
                Number(questions?.constructedResponseAnswers?.length || 0) >=
                8 && (
                <div
                  className="mr-6 block cursor-pointer text-medium-sm font-medium underline xl:hidden"
                  onClick={() => {
                    setShowMore(!showMore)
                    if (multipleQuestionRef?.current) {
                      multipleQuestionRef.current.style.height = 'fit-content'
                    }
                  }}
                >
                  {showMore ? 'View Less' : 'View All'}
                </div>
              )}
              <Link
                href={`${PageLink.TEACHER_MY_COURSE}/my-course/${questions?.class_id ?? ''}`}
              >
                <ButtonPrimary
                  title={'Quit'}
                  size={'medium'}
                  className={
                    'mb-0 max-w-[120px] px-11 text-medium-sm !font-medium'
                  }
                />
              </Link>
            </div>
          </div>
        </div>
        {/* </div> */}
      </div>
    </div>
  )
}

export default MultipleQuestion
