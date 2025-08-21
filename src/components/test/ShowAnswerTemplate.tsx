import { CircleCloseIcon, EyeIcon } from '@assets/icons'
import ModalResizeable from '@components/base/modal/ModalResizeable'
import { Triangle } from '@components/icons/Triangle'
import { Tooltip } from 'antd'
import clsx from 'clsx'
import React, { useState } from 'react'
import EssayQuestionPreview from '@components/questionType/ConstructedQuestion'
import { RESPONSE_OPTION } from 'src/constants'
import {
  Control,
  FieldValues,
  UseFormGetValues,
  UseFormSetValue,
} from 'react-hook-form'
import { defaultSheetData } from 'src/constants/attempt'

interface IProps {
  currentTabContent: any
  essayData: {
    index: number
    req?: any
  }
  control: Control<FieldValues, any>
  setValue: UseFormSetValue<FieldValues>
  getValues: UseFormGetValues<FieldValues>
}
const ShowAnswerTemplate = ({
  currentTabContent,
  essayData,
  control,
  setValue,
  getValues,
}: IProps) => {
  const [showModalTemplate, setShowModalTemplate] = useState(false)

  const response_option = currentTabContent?.data?.response_option

  const defaultValueEssay = () => {
    if (response_option === RESPONSE_OPTION.WORD) {
      const requirement =
        currentTabContent?.data?.requirements?.[essayData?.index]

      if (requirement?.answer_template) {
        return requirement.answer_template
      }

      return currentTabContent?.data?.answer_template || ''
    } else if (response_option === RESPONSE_OPTION.SHEET) {
      const requirement =
        currentTabContent?.data?.requirements?.[essayData?.index]

      if (requirement?.answer_template) {
        return requirement.answer_template || defaultSheetData
      }
      return currentTabContent?.data?.answer_template || defaultSheetData
    }
  }

  return (
    <>
      <div className="absolute bottom-[170px] right-8 z-[1050] flex w-12 flex-col gap-2">
        {true && (
          <Tooltip
            placement="left"
            title={
              showModalTemplate ? undefined : (
                <div className="flex items-center gap-2 text-white">
                  <EyeIcon className="h-4 w-4" />{' '}
                  <div className="text-sm">Show Answer Template</div>
                </div>
              )
            }
          >
            <div
              className={clsx(
                'group bottom-0 grid h-12 w-12 cursor-pointer place-items-center rounded-full bg-primary text-white shadow-icon hover:bg-blend-overlay',
              )}
              onClick={() => setShowModalTemplate(!showModalTemplate)}
            >
              <EyeIcon />
              <div className="pointer-events-none absolute inset-0 rounded-full bg-white opacity-0 transition-opacity group-hover:opacity-20" />
            </div>
          </Tooltip>
        )}
      </div>
      {showModalTemplate && (
        <ModalResizeable
          handleCloseScratchPad={() => setShowModalTemplate(false)}
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
              <div className="modal-header flex w-full items-center justify-between rounded-xl bg-white">
                <div className="truncate">
                  <span className="text-sm font-semibold text-gray-800">
                    Show Answer Template
                  </span>
                </div>
              </div>
              <button
                className="absolute right-0 top-0"
                onClick={() => setShowModalTemplate(false)}
              >
                <CircleCloseIcon />
              </button>
            </div>
          }
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
                ...currentTabContent?.data,
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
