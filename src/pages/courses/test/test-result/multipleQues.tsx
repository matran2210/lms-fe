import ButtonPrimary from '@components/base/button/ButtonPrimary'
import Icon from '@components/icons'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useRef, useState } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { ANIMATION } from 'src/constants'

interface MultipleQuestionProps {
  questions: any
  className?: string
  multipleQuestionRef?: React.RefObject<HTMLDivElement>
}

const MultipleQuestion = ({
  questions,
  className,
  multipleQuestionRef,
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

  const renderBoxes = (type: string, data: any, totalBefore: number) => {
    const renderBoxItems = data?.map((item: any, index: number) => {
      return (
        <div
          key={item?.id}
          onClick={() => {
            router.push(`/explanation/${item?.id}?title=My Course`)
          }}
          className={`border border-solid flex items-center flex-row justify-center w-10 xl:w-12 h-10 xl:h-12 text-sm font-medium leading-8.5 cursor-pointer
          ${
            item?.is_correct || item?.active === 'SUBMITED'
              ? ' text-state-success border-success'
              : ' text-state-error border-error'
          }
          `}
        >
          {index + totalBefore + 1}
        </div>
      )
    })

    return (
      <div className="w-full">
        {data?.length > 0 && (
          <>
            <div className="text-lg-xl xl:text-xl font-semibold xl:font-medium mb-6 text-bw-1">
              {type}
            </div>
            <div
              className={`flex flex-row items-center flex-wrap gap-3 w-full ${
                type === 'Multiple Questions' ? 'mb-10' : ''
              }`}
            >
              {renderBoxItems}
            </div>
          </>
        )}
      </div>
    )
  }

  const renderLines = (type: string, data: any, totalBefore: number) => {
    const renderBoxItems = data?.map((item: any, index: number) => {
      return (
        <div
          key={item?.id}
          onClick={() => {
            router.push(`/explanation/${item?.id}?title=My Course`)
          }}
          className={`border border-solid flex items-center flex-row justify-center w-10 xl:w-12 h-10 xl:h-12 text-sm font-medium leading-8.5 cursor-pointer
          ${
            item?.is_correct || item?.active === 'SUBMITED'
              ? ' text-state-success border-success'
              : ' text-state-error border-error'
          }
          `}
        >
          {index + totalBefore + 1}
        </div>
      )
    })

    return (
      <>
        {data.length > 0 && (
          <>
            <div
              className={`flex flex-row gap-3 w-auto items-start ${
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
    <div
      className={`${className} 2xl-max:!min-h-[88px] fixed 3.75xl:static z-10 right-0 bottom-0 bg-white flex flex-col gap-y-5 w-full max-w-[calc(100vw-80px)] 3.75xl:max-w-smd items-start px-[27px] py-6 xl:overflow-y-auto shadow-sidebar-tablet 3.75xl:shadow-sidebar`}
      data-aos={ANIMATION.DATA_AOS}
      ref={multipleQuestionRef}
    >
      <div
        className={`${
          showMore
            ? 'opacity-100 visible mb-4 xl:mb-0 h-fit'
            : 'opacity-0 3.75xl:opacity-100 invisible 3.75xl:visible h-0 3.75xl:h-auto 3.75xl:block hidden'
        }
        duration-300 xl:max-h-auto overflow-y-auto xl:overflow-visible flex flex-col gap-10 w-full items-start`}
      >
        <div className="flex flex-col w-full items-start">
          {renderBoxes(
            'Multiple Questions',
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
      <div className="mt-auto w-full">
        <div
          className={`border-default flex justify-between ${
            showMore
              ? 'border-t pt-4 xl:pt-6'
              : '3.75xl:border-t pt-0 3.75xl:pt-6'
          }`}
        >
          <div className="hidden 3.75xl:flex items-center mr-6 w-20">
            <Icon
              type={'circle'}
              className="w-4 h-4 text-state-success mr-1.5"
            />
            <span className="text-base leading-6.2 text-state-success font-normal">
              Correct
            </span>
          </div>
          <div className="hidden 3.75xl:flex items-center mr-4 w-20">
            <Icon
              type={'circle'}
              className="w-4 h-4 text-state-error mr-1.5 shrink-0"
            />
            <span className="text-base leading-6.2 text-state-error font-normal">
              Incorrect
            </span>
          </div>
          <div
            ref={elementRef as React.LegacyRef<HTMLDivElement>}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            className={`${
              !showMore ? 'opacity-100 visible' : 'opacity-0 invisible'
            } w-full flex gap-3 overflow-x-auto duration-300 block 3.75xl:hidden !max-h-[1040px]`}
          >
            {renderLines(
              'Multiple Questions',
              questions?.selectedResponseAnswers ?? [],
              0,
            )}
            {renderLines(
              'Constructed Questions',
              questions?.constructedResponseAnswers ?? [],
              questions?.selectedResponseAnswers?.length ?? 0,
            )}
          </div>
          <div className="flex items-center justify-end w-full shrink max-h-[40px] max-w-[192px]">
            {Number(questions?.selectedResponseAnswers?.length || 0) +
              Number(questions?.constructedResponseAnswers?.length || 0) >=
              8 && (
              <div
                className="block 3.75xl:hidden text-medium-sm font-medium underline cursor-pointer mr-6"
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
            <Link href={`/courses/my-course/${questions?.class_id ?? ''}`}>
              <ButtonPrimary
                title={'Quit'}
                size={'medium'}
                className={'px-11 text-medium-sm !font-medium max-w-[120px]'}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MultipleQuestion
