"use client";
import { IExhibitData, MY_COURSES } from "@lms/core";
import { getUppercaseByNumber, runHighlight } from "@lms/utils";
import clsx from "clsx";
import { useEffect, useMemo } from "react";
import { EditorReader, HookFormRadioGroup, SappDivider } from "../base";
import { SappTitleSolution } from "../common";
import { HighlightableHTML } from "../highlights";
import WarningSection from "./WarningSection";
import { useFeature } from "@lms/contexts";
export type IPreviewProp = {
  data: any;
  control: any;
  name?: string;
  corrects?: { [key: string]: boolean };
  defaultValues?: any;
  setValue?: any;
  handleSaveHighLight?: any;
  highlighted?: any;
  removeHighlight?: any;
  allowHighLight?: boolean;
  solution?: any;
  allowUnHighLight?: boolean;
  setOpenFile?: (
    data: IExhibitData,
    file?: string | null,
    fileName?: string | null,
    event?: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => void;
  isHideExhibit?: boolean;
  getValue?: any | undefined;
  tabs?: Array<{ id: string }> | undefined;
  currentPage?: string | undefined;
  exhibitText?: string;
  isShowWarning?: boolean;
  explainClassname?: string;
  storageKey?: string;
  readOnly?: boolean;
};

type IAnswers = {
  answer_position: number;
};
const OneChoiceQuestion = ({
  data,
  control,
  corrects,
  name,
  defaultValues,
  setValue,
  handleSaveHighLight,
  highlighted,
  removeHighlight,
  allowHighLight,
  solution,
  allowUnHighLight,
  setOpenFile,
  isHideExhibit = true,
  exhibitText = "Exhibit",
  isShowWarning = false,
  explainClassname,
  storageKey,
  readOnly = false,
}: IPreviewProp) => {
  const { router, query } = useFeature();
  useEffect(() => {
    if (defaultValues) {
      setValue(name, defaultValues);
    } else {
      setValue?.(name, "");
    }
  }, [defaultValues, name]);
  const convertAnswer = useMemo(() => {
    const answers = [];
    let number = 0;

    if (data?.answers) {
      const dataAnswers = [...(data?.answers || [])];
      dataAnswers.sort(
        (a: IAnswers, b: IAnswers) => a?.answer_position - b?.answer_position,
      );
      for (const e of dataAnswers) {
        number++;
        answers.push({
          label: `${getUppercaseByNumber(number)}. ${e?.answer}`,
          value: e?.id,
        });
      }
    }
    return answers;
  }, [data]);

  return (
    <div>
      <div
        id="hightlight_area"
        onMouseUp={(e: any) => {
          if (
            e?.target?.tagName?.charAt(0) !== "m" &&
            e?.target?.firstChild?.tagName !== "math"
          ) {
            if (e) {
              if (allowHighLight) {
                runHighlight(
                  handleSaveHighLight,
                  allowHighLight || false,
                  "hightlight_area",
                );
              } else if (allowUnHighLight) {
                runHighlight(
                  handleSaveHighLight,
                  allowUnHighLight || false,
                  "hightlight_area",
                  { color: "white" },
                );
              }
              // runHighlight(handleSaveHighLight, allowHighLight || false, "hightlight_area")
            }
          }
        }}
      >
        <HighlightableHTML
          initialHTML={data?.question_content || ""}
          storageKey={
            storageKey ||
            `${query.id}-${data?.qType}-question-${data?.id}`
          }
          className="sapp-questions sapp-editor-reader mb-6"
        />
        {/* <EditorReader
          text_editor_content={data?.question_content}
          className={'sapp-questions sapp-editor-reader mb-6'}
          highlighted={highlighted}
        /> */}
        <WarningSection isShowWarning={isShowWarning} className="mb-4" />
      </div>
      {data?.question_topic?.exhibits &&
        !isHideExhibit &&
        data?.question_topic?.exhibits?.length > 0 && (
          <>
            {!!data?.question_topic?.description && (
              <div className="my-6 border border-b-gray-300"></div>
            )}
            <div className="mb-4 flex items-center">
              <div className="font-semibold">
                {exhibitText ? exhibitText + "s" : "Exhibits"} (
                {data?.question_topic?.exhibits?.length || 0})
              </div>
              <div className="ml-4">
                <span className="text-error">* </span>
                <span className="text-[#A1A1A1]">Click to view</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {data?.question_topic?.exhibits?.map((e: any, i: number) => {
                return (
                  <div
                    className="cursor-pointer hover:text-primary"
                    key={e?.id ?? i}
                    onClick={(event) => {
                      setOpenFile &&
                        setOpenFile(
                          {
                            type: "exhibits",
                            description: e?.description,
                            name: e?.name,
                            index: i,
                            files: e?.files,
                          },
                          null,
                          null,
                          event,
                        );
                    }}
                  >
                    {exhibitText || "Exhibit"} {i + 1}: {e?.name}
                  </div>
                );
              })}
            </div>
            <div className="my-6 border border-gray-300" />
          </>
        )}
      <div
        className="sapp-answer-wrapper pt-0"
        style={{
          flexDirection: "column",
        }}
      >
        <HookFormRadioGroup
          readOnly={readOnly}
          options={convertAnswer || []}
          control={control}
          name={name || "answer"}
          corrects={corrects}
          defaultValue={defaultValues}
          labelClass={"text-base font-normal text-gray-800"}
          optionClassName="checked:bg-radio-primary-checked checked:text-transparent checked:hover:bg-radio-primary-checked checked:focus:bg-radio-primary-checked"
        />
      </div>
      {solution && (
        <>
          <SappDivider />
          <div className={clsx("mt-6", explainClassname)}>
            <SappTitleSolution title={`${MY_COURSES.explanations}:`} />
            <EditorReader className="mt-4" text_editor_content={solution} />
          </div>
        </>
      )}
    </div>
  );
};
export default OneChoiceQuestion;
