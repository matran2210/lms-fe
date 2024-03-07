import ButtonPrimary from '@components/base/button/ButtonPrimary'
import Icon from '@components/icons'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { ANIMATION } from 'src/constants'

interface MultipleQuestionProps {
  questions: any
  className?: string
}

const MultipleQuestion = ({ questions, className }: MultipleQuestionProps) => {
  const router = useRouter()
  const [showMore, setShowMore] = useState<boolean>(false)

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
        {data.length > 0 && (
          <>
            <div className="text-lg-xl xl:text-xl font-semibold xl:font-medium mb-4">
              {type}
            </div>
            <div
              className={`flex flex-row flex-wrap gap-3 w-full items-start ${
                type === 'Multiple Questions' ? 'mb-6' : ''
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

  useEffect(() => {
    AOS.init({ duration: ANIMATION.DURATION })
  }, [])

  return (
    <div
      className={`${className} fixed xl:static z-10 right-0 bottom-0 bg-white flex flex-col justify-between w-full max-w-[calc(100vw-80px)] xl:max-w-smd items-start px-6 py-4 xl:overflow-y-auto shadow-sidebar-tablet xl:shadow-sidebar`}
      data-aos={ANIMATION.DATA_AOS}
    >
      <div
        className={`${
          showMore
            ? 'opacity-100 visible mb-4 xl:mb-0 h-auto'
            : 'opacity-0 xl:opacity-100 invisible xl:visible h-0 xl:h-auto'
        }
        duration-300 max-h-[300px] xl:max-h-auto overflow-y-auto xl:overflow-visible flex flex-col gap-10 w-full items-start`}
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
            showMore ? 'border-t pt-4 xl:pt-6' : 'xl:border-t pt-0 xl:pt-6'
          }`}
        >
          <div className="hidden xl:flex items-center mr-6 w-20">
            <Icon
              type={'circle'}
              className="w-4 h-4 text-state-success mr-1.5"
            />
            <span className="text-base leading-6.2 text-state-success font-normal">
              Correct
            </span>
          </div>
          <div className="hidden xl:flex items-center mr-4 w-20">
            <Icon
              type={'circle'}
              className="w-4 h-4 text-state-error mr-1.5 shrink-0"
            />
            <span className="text-base leading-6.2 text-state-error font-normal">
              Incorrect
            </span>
          </div>
          <div
            className={`${
              !showMore ? 'opacity-100 visible' : 'opacity-0 invisible'
            } w-full flex gap-3 overflow-x-auto duration-300 block xl:hidden`}
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
                className="block xl:hidden text-medium-sm font-medium underline cursor-pointer mr-6"
                onClick={() => {
                  setShowMore(!showMore)
                }}
              >
                {showMore ? 'View Less' : 'View All'}
              </div>
            )}
            <Link href={`/courses/my-course/${questions?.course?.id}`}>
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
