import ButtonPrimary from '@components/base/button/ButtonPrimary'
import React from 'react'
import Icon from '@components/icons'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface MultipleQuestionProps {
  questions: any
  className?: string
}

const MultipleQuestion = ({ questions, className }: MultipleQuestionProps) => {
  const router = useRouter()
  const renderBoxes = (type: string, data: any, totalBefore: number) => {
    const renderBoxItems = data?.map((item: any, index: number) => {
      return (
        <div
          key={item?.id}
          onClick={() => {
            router.push(`/explanation/${item?.id}`)
          }}
          className={`border border-solid flex items-center flex-row justify-center w-12 h-12 text-sm font-medium leading-8.5 cursor-pointer
          ${
            item?.is_correct || item?.active === 'SUBMITED'
              ? ' text-state-success border-success'
              : ' text-danger border-error'
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
            <div className="text-xl font-medium mb-4">{type}</div>
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

  return (
    <div
      className={`${className} bg-white flex flex-col justify-between w-full max-w-smd items-start px-6 py-6 overflow-y-auto shadow-sidebar`}
    >
      <div className="flex flex-col gap-10 w-full items-start">
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
        <div className="border-t border-default pt-6 flex justify-between">
          <div className="flex items-center mr-6 w-20">
            <Icon
              type={'circle'}
              className="w-4 h-4 text-state-success mr-1.5 shrink-0"
            />
            <span className="text-base leading-6.2 text-state-success font-normal">
              Correct
            </span>
          </div>
          <div className="flex items-center mr-4 w-20">
            <Icon
              type={'circle'}
              className="w-4 h-4 text-danger mr-1.5 shrink-0"
            />
            <span className="text-base leading-6.2 text-danger font-normal">
              Incorrect
            </span>
          </div>
          <div className="flex justify-end w-full">
            <Link href={`/courses/my-course/${questions?.course?.id}`}>
              <ButtonPrimary
                title={'Quit'}
                size={'medium'}
                className={'px-11 text-medium-sm !font-medium'}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MultipleQuestion
