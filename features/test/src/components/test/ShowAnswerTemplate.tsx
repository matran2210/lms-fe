import { CircleCloseIcon, EyeIcon } from '@assets/icons'
import { ModalResizeable } from '@lms/ui'
import { Triangle } from '@lms/assets/icons';
import { Tooltip } from 'antd'
import clsx from 'clsx'
import React, { useLayoutEffect, useState } from 'react'
import EssayQuestionPreview from '@lms/ui/components/questionType/ConstructedQuestion'
import { RESPONSE_OPTION } from '@lms/core'
import {
  Control,
  FieldValues,
  useForm,
  UseFormGetValues,
  UseFormSetValue,
} from 'react-hook-form'
import { defaultSheetData } from '@lms/core'
import { ButtonPrimaryV2 } from '@lms/ui'
import { ButtonSecondaryV2 } from '@lms/ui'
import { ButtonSecondary } from '@lms/ui'

interface IProps {
  currentTabContent: any
  essayData: {
    index: number
    req?: any
  }
  isQuiz?: boolean
  className?: string
}
const ShowAnswerTemplate = ({
  currentTabContent,
  essayData,
  isQuiz,
  className,
}: IProps) => {
  const { control, setValue } = useForm()
  const [showModalTemplate, setShowModalTemplate] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  const contentData = isQuiz ? currentTabContent : currentTabContent?.data
  const response_option = contentData?.response_option

  const defaultValueEssay = () => {
    if (response_option === RESPONSE_OPTION.WORD) {
      const requirement = contentData?.requirements?.[essayData?.index]
      if (requirement?.answer_template) {
        return requirement.answer_template
      }
      return contentData?.answer_template || ''
    } else if (response_option === RESPONSE_OPTION.SHEET) {
      const requirement = contentData?.requirements?.[essayData?.index]

      if (requirement?.answer_template) {
        return requirement.answer_template || defaultSheetData
      }
      return contentData?.answer_template || defaultSheetData
    }
  }

  useLayoutEffect(() => {
    if (currentTabContent) {
      setShowModalTemplate(false)
      setShowTooltip(false)
    }
  }, [currentTabContent])

  const handleToggleModal = () => {
    if (showModalTemplate) {
      // Khi đóng modal, ẩn tooltip
      setShowTooltip(false)
      setShowModalTemplate(false)
    } else {
      // Khi mở modal, ẩn tooltip
      setShowTooltip(false)
      setShowModalTemplate(true)
    }
  }

  const handleCloseModal = () => {
    setShowModalTemplate(false)
    setShowTooltip(false)
  }

  return (
    <>
      <div className={clsx('flex', className)}>
        <ButtonSecondary
          className="bg-white font-semibold"
          onClick={handleToggleModal}
        >
          Show Answer Template
        </ButtonSecondary>
      </div>
      {showModalTemplate && (
        <ModalResizeable
          handleCloseScratchPad={handleCloseModal}
          rootClassName="rounded-xl"
          bodyClassName="p-6"
          contentClassName={clsx('!p-0', {
            ' rounded-xl border border-gray-100':
              response_option === RESPONSE_OPTION.WORD,
            ' !overflow-hidden': response_option === RESPONSE_OPTION.SHEET,
          })}
          height={response_option === RESPONSE_OPTION.SHEET ? 600 : 530}
          minHeight={response_option === RESPONSE_OPTION.SHEET ? 600 : 530}
          width={800}
          header={
            <div className="relative mb-4">
              <div className="modal-header modal-dragger flex w-full items-center justify-between rounded-xl bg-white">
                <div className="truncate">
                  <span className="text-sm font-semibold text-gray-800">
                    Show Answer Template
                  </span>
                </div>
              </div>
              <button
                className="absolute right-0 top-0"
                onClick={handleCloseModal}
              >
                <CircleCloseIcon />
              </button>
            </div>
          }
          isInBody
        >
          <div
            className={clsx('h-[100%-40px] bg-white ', {
              'answer-template-preview':
                response_option === RESPONSE_OPTION.WORD,
            })}
          >
            <EssayQuestionPreview
              data={undefined}
              question_content={''}
              index={essayData?.index}
              question_data={{
                ...contentData,
                assignment_type: 'TEXT',
              }}
              control={control}
              name={''}
              setValue={setValue}
              defaultValue={defaultValueEssay()}
              response_option_custom={currentTabContent.response_type}
              fullData={{
                ...currentTabContent,
                confirmed:
                  response_option === RESPONSE_OPTION.WORD ? true : false,
              }}
              isShowContent={false}
            />
          </div>
          <Triangle className="absolute bottom-2 right-2" />
        </ModalResizeable>
      )}
    </>
  )
}

export default ShowAnswerTemplate
