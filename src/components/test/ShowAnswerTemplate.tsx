import { EyeIcon } from '@assets/icons'
import ModalResizeable from '@components/base/modal/ModalResizeable'
import { Triangle } from '@components/icons/Triangle'
import { Tooltip } from 'antd'
import clsx from 'clsx'
import React, { useState } from 'react'
import EssayQuestionPreview from '@components/questionType/ConstructedQuestion'

const ShowAnswerTemplate = ({
  currentTabContent,
  essayData,
  currentTabID,
  control,
  setValue,
}: any) => {
  const [showModalTemplate, setShowModalTemplate] = useState(false)
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
          title={
            <div className="text-sm font-semibold">Show Answer Template</div>
          }
          handleCloseScratchPad={() => setShowModalTemplate(false)}
          rootClassName="rounded-xl"
          height={600}
          width={850}
        >
          <div className="h-full bg-white">
            <EssayQuestionPreview
              data={undefined}
              question_content={''}
              index={essayData?.index}
              question_data={currentTabContent?.data}
              control={control}
              name={`${currentTabContent?.id}_${essayData?.index}_answer`}
              setValue={setValue}
              defaultValue={undefined}
              response_option_custom={currentTabContent.response_type}
              fullData={currentTabContent}
            />
          </div>
          <Triangle className="absolute bottom-2 right-2" />
        </ModalResizeable>
      )}
    </>
  )
}

export default ShowAnswerTemplate
