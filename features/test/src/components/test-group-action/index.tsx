import { Icon } from "@lms/assets"
import { QUESTION_TYPES } from "@lms/core"
import { ShowAnswerTemplate } from "@lms/feature-courses"
import { ButtonPrimary, ButtonSecondary, ButtonText, ButtonTextV2 } from "@lms/ui"
import { Tooltip } from "antd"

interface TestGroupActionProps {
  currentTabContent: any
  currentAnswer: any
  indexTab: number
  totalTabs: number
  isShowTemplate: boolean
  isGradingAfterEachQuestion: boolean
  onClearSelection: () => void
  onNextQuestion: () => void
  onConfirm: () => void
  onResetTemplate: () => void
}

function TestGroupAction({
  currentTabContent,
  currentAnswer,
  indexTab,
  totalTabs,
  isShowTemplate,
  isGradingAfterEachQuestion,
  onClearSelection,
  onNextQuestion,
  onConfirm,
  onResetTemplate,
}: TestGroupActionProps) {
  return (
    <div className="flex items-center justify-end gap-2">
      {currentTabContent?.qType === QUESTION_TYPES.ESSAY &&
        isShowTemplate && (
          <div className="flex items-center gap-3">
            <ButtonTextV2
              title="Reset to Answer Template"
              onClick={onResetTemplate}
              className="bg-transparent hover:!bg-transparent"
            />
            <ShowAnswerTemplate
              essayData={currentAnswer}
              currentTabContent={currentTabContent}
            />
          </div>
        )}

      {[QUESTION_TYPES.ONE_CHOICE].includes(currentTabContent?.qType) &&
        !currentTabContent?.is_viewed_answer && (
          <ButtonSecondary
            disabled={!currentAnswer}
            onClick={onClearSelection}
            title="Clear Selection"
          />
        )}

      <Tooltip >
        {isGradingAfterEachQuestion &&
        currentTabContent?.is_viewed_answer &&
        indexTab < totalTabs - 1 ? (
          <ButtonText onClick={onNextQuestion} className="flex items-center gap-2">
            Next Question <Icon type="arrow-right" className="inline-flex"/>
          </ButtonText>
        ) : (
          <ButtonPrimary
            onClick={onConfirm}
            title={
              isGradingAfterEachQuestion
                ? currentTabContent?.is_viewed_answer
                  ? 'Finish'
                  : 'Confirm'
                : indexTab < totalTabs - 1
                  ? 'Confirm & Next'
                  : 'Confirm'
            }
          />
        )}
      </Tooltip>
    </div>
  )
}


export default TestGroupAction