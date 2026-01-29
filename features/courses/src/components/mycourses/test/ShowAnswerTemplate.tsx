import { CircleCloseIcon, Triangle } from "@lms/assets";
import { defaultSheetData, RESPONSE_OPTION } from "@lms/core";
import { ButtonSecondary, ModalResizeable } from "@lms/ui";
import EssayQuestionPreview from "@lms/ui/components/questionType/ConstructedQuestion";
import clsx from "clsx";
import { useFeature } from "@lms/contexts";
import { useLayoutEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface IProps {
  currentTabContent: any;
  essayData: {
    index: number;
    req?: any;
  };
  isQuiz?: boolean;
  className?: string;
}
const ShowAnswerTemplate = ({
  currentTabContent,
  essayData,
  isQuiz,
  className,
}: IProps) => {
  const { uploadApi } = useFeature();

  const { control, setValue } = useForm();
  const [showModalTemplate, setShowModalTemplate] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const contentData = isQuiz ? currentTabContent : currentTabContent?.data;
  const response_option = contentData?.response_option;

  const defaultValueEssay = () => {
    if (response_option === RESPONSE_OPTION.WORD) {
      const requirement = contentData?.requirements?.[essayData?.index];
      if (requirement?.answer_template) {
        return requirement.answer_template;
      }
      return contentData?.answer_template || "";
    } else if (response_option === RESPONSE_OPTION.SHEET) {
      const requirement = contentData?.requirements?.[essayData?.index];

      if (requirement?.answer_template) {
        return requirement.answer_template || defaultSheetData;
      }
      return contentData?.answer_template || defaultSheetData;
    }
  };

  useLayoutEffect(() => {
    if (currentTabContent) {
      setShowModalTemplate(false);
      setShowTooltip(false);
    }
  }, [currentTabContent]);

  const handleToggleModal = () => {
    if (showModalTemplate) {
      // Khi đóng modal, ẩn tooltip
      setShowTooltip(false);
      setShowModalTemplate(false);
    } else {
      // Khi mở modal, ẩn tooltip
      setShowTooltip(false);
      setShowModalTemplate(true);
    }
  };

  const handleCloseModal = () => {
    setShowModalTemplate(false);
    setShowTooltip(false);
  };

  return (
    <>
      <div className={clsx("flex", className)}>
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
          contentClassName={clsx("!p-0", {
            " rounded-xl border border-gray-100":
              response_option === RESPONSE_OPTION.WORD,
            " !overflow-hidden": response_option === RESPONSE_OPTION.SHEET,
          })}
          height={response_option === RESPONSE_OPTION.SHEET ? 600 : 530}
          minHeight={response_option === RESPONSE_OPTION.SHEET ? 600 : 530}
          width={800}
          header={({ requestClose }) => (
            <div className="relative mb-4">
              <div className="modal-header modal-dragger flex w-full items-center justify-between rounded-xl bg-white">
                <div className="truncate">
                  <span className="text-sm font-semibold text-gray-800">
                    Show Answer Template
                  </span>
                </div>
              </div>
              <button className="absolute right-0 top-0" onClick={requestClose}>
                <CircleCloseIcon />
              </button>
            </div>
          )}
          isInBody
        >
          <div
            className={clsx("h-[100%-40px] bg-white ", {
              "answer-template-preview":
                response_option === RESPONSE_OPTION.WORD,
            })}
          >
            <EssayQuestionPreview
              data={undefined}
              question_content={""}
              index={essayData?.index}
              question_data={{
                ...contentData,
                assignment_type: "TEXT",
              }}
              control={control}
              name={""}
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
  );
};

export default ShowAnswerTemplate;
