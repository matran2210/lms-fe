"use client";

import { CheckCircleOutlineYellow } from "@lms/assets";
import {
  AnswerList,
  CommonQuestionBlockProps,
  defaultSheetData,
  Requirement,
  RESPONSE_OPTION,
} from "@lms/core";
import { RequirementsTab } from "@lms/feature-courses";
import { EssayQuestionPreview, HighlightableHTML } from "@lms/ui";
import {
  checkSheetAnswered,
  hasEditorValueFromHtml,
  isWorkbookEmpty,
} from "@lms/utils";
import { TabsProps } from "antd";
import { debounce } from "lodash";
import React, { useEffect, useRef } from "react";

export interface EssayQuestionBlockProps extends CommonQuestionBlockProps {
  essayData: {
    index: number;
    req?: any;
  };
  refEditor: React.MutableRefObject<any>;
  currentPage: string;
  setOpenUpload: (payload: any) => void;
  handleClearFile: () => void;
  handleOpenScratchPad: () => void;
  handleSaveHighLightRequirement: (...args: any[]) => void;
  showListRequirement: boolean;
  setEssayData: (data: any) => void;
  currentTabContent: any;
  editorReady: boolean;
}

export default function EssayQuestionBlock({
  data,
  currentTabID,
  control,
  getValues,
  setValue,
  highlighted,
  solution,
  essayData,
  refEditor,
  currentPage,
  setOpenUpload,
  handleClearFile,
  handleOpenScratchPad,
  handleSaveHighLightRequirement,
  showListRequirement,
  setEssayData,
  editorReady,
  currentTabContent,
}: EssayQuestionBlockProps) {
  const storageKey = `${data?.id}-question-${data?.data?.qType}`;
  const answerListRef = useRef<AnswerList>({});

  const part1 = currentTabContent?.data?.requirements?.[essayData?.index] || {};
  const part2 = essayData?.req || {};
  const dataEssay = { ...part1, ...part2 };

  const setAnswerListValue = debounce((requirementId: number) => {
    answerListRef.current[requirementId] =
      getValues(`${currentTabID}_${essayData?.index}_answer`) || "";
  }, 200);

  // Initialize answerListRef values once when component mounts
  useEffect(() => {
    if (
      currentTabContent?.data?.response_option === "SHEET" ||
      currentTabContent?.data?.response_option === "WORD"
    ) {
      currentTabContent?.data?.requirements?.forEach((req: Requirement) => {
        if (req?.id) {
          if (req?.answer_file?.file_key) {
            answerListRef.current[req.id] = req?.answer_file?.file_key;
          } else if (req?.answer_text) {
            if (currentTabContent?.data?.response_option === "SHEET") {
              answerListRef.current[req.id] = checkSheetAnswered(
                req.answer_text,
              )
                ? req.answer_text
                : "";
            } else {
              answerListRef.current[req.id] = req.answer_text;
            }
          }
        }
      });
    }
  }, [currentTabContent]);

  const handleEssayChange = (id: string) => {
    setAnswerListValue(id as unknown as number);
  };

  const essayRequirementsItem = (): TabsProps["items"] => {
    return (
      currentTabContent?.data?.requirements?.map(
        (requirement: any, index: number) => {
          const hasAnswer =
            currentTabContent?.data?.response_option === RESPONSE_OPTION.SHEET
              ? checkSheetAnswered(getValues(`${currentTabID}_${index}_answer`))
              : hasEditorValueFromHtml(
                  getValues(`${currentTabID}_${index}_answer`),
                );
          const key = `${currentTabID}_${index}_answer`;
          const getDefaultValueEssay = () => {
            const valueFromForm = getValues(key);
            const response_option = currentTabContent?.data?.response_option;
            switch (response_option) {
              case RESPONSE_OPTION.WORD:
                if (valueFromForm !== undefined && valueFromForm !== null) {
                  return valueFromForm;
                }

                if (requirement?.short_answer) {
                  return requirement.short_answer;
                }
                if (requirement?.answer_text) {
                  return requirement.answer_text;
                }
                if (requirement?.answer_template) {
                  return requirement.answer_template;
                }
                if (currentTabContent.answer) {
                  return currentTabContent.answer;
                }

                return currentTabContent?.data?.answer_template;

              case RESPONSE_OPTION.SHEET: {
                const valueFromSheetForm = getValues(key);
                if (valueFromSheetForm) {
                  const isEmptyWorkbook = isWorkbookEmpty(
                    JSON.parse(valueFromSheetForm),
                  );

                  if (isEmptyWorkbook) {
                    if (requirement?.short_answer) {
                      return requirement.short_answer;
                    }
                    if (requirement?.answer_text) {
                      return requirement.answer_text;
                    }
                    if (requirement?.answer_template) {
                      return requirement.answer_template || defaultSheetData;
                    }
                    if (currentTabContent.answer)
                      return currentTabContent.answer;
                    return (
                      currentTabContent?.data?.answer_template ||
                      defaultSheetData
                    );
                  }
                  return valueFromSheetForm;
                }
                const requirementSheet =
                  currentTabContent?.data?.requirements?.[essayData?.index];
                if (requirementSheet?.short_answer) {
                  return requirementSheet.short_answer;
                }
                if (requirementSheet?.answer_text) {
                  return requirementSheet.answer_text;
                }
                if (requirementSheet?.answer_template) {
                  return requirementSheet.answer_template || defaultSheetData;
                }
                if (currentTabContent.answer) return currentTabContent.answer;
                return (
                  currentTabContent?.data?.answer_template || defaultSheetData
                );
                // return getCurrentDefaultSheetValue
              }
            }
          };
          return {
            label: (
              <span className="flex items-center gap-1 text-base font-normal">
                Requirement {index + 1}
                {hasAnswer && (
                  <CheckCircleOutlineYellow className="text-primary" />
                )}
              </span>
            ),
            key: index,
            children: (
              <>
                {editorReady && (
                  <EssayQuestionPreview
                    data={{
                      ...currentTabContent?.data?.requirements?.[index],
                      ...essayData?.req,
                    }}
                    question_content={currentTabContent?.data?.question_content}
                    index={index}
                    question_data={currentTabContent?.data}
                    control={control}
                    solution={solution}
                    name={`${currentTabID}_${index}_answer`}
                    setValue={setValue}
                    defaultValue={getDefaultValueEssay()}
                    response_option_custom={currentTabContent.response_type}
                    externalRef={refEditor}
                    fullData={currentTabContent}
                    isShowContent={false}
                    openChooseFile={() =>
                      setOpenUpload({
                        status: true,
                        question_id: currentTabID,
                        requirementIndex: index,
                      })
                    }
                    handleClearFile={handleClearFile}
                    setOpenPdf={handleOpenScratchPad}
                    handleSaveHighLightRequirement={
                      handleSaveHighLightRequirement
                    }
                    showRequiment={showListRequirement}
                    handleChange={handleEssayChange}
                    explainClassname="!mt-8 !p-0 !bg-transparent"
                    storageKey={storageKey}
                  />
                )}
              </>
            ),
          };
        },
      ) ?? []
    );
  };

  const defaultValueEssay = () => {
    const valueFromForm = getValues(
      `${currentTabID}_${essayData?.index ?? 0}_answer`,
    );
    const response_option = currentTabContent?.data?.response_option;

    switch (response_option) {
      case RESPONSE_OPTION.WORD: {
        if (valueFromForm !== undefined && valueFromForm !== null) {
          return valueFromForm;
        }
        const requirement =
          currentTabContent?.data?.requirements?.[essayData?.index];

        if (requirement?.short_answer) {
          return requirement.short_answer;
        }
        if (requirement?.answer_text) {
          return requirement.answer_text;
        }
        if (requirement?.answer_template) {
          return requirement.answer_template;
        }
        if (currentTabContent.answer) {
          return currentTabContent.answer;
        }

        return currentTabContent?.data?.answer_template;
      }

      case RESPONSE_OPTION.SHEET: {
        const valueFromSheetForm = getValues(
          `${currentTabID}_${essayData?.index ?? 0}_answer`,
        );
        if (valueFromSheetForm) {
          const isEmptyWorkbook = isWorkbookEmpty(
            JSON.parse(valueFromSheetForm),
          );

          if (isEmptyWorkbook) {
            const requirement =
              currentTabContent?.data?.requirements?.[essayData?.index];
            if (requirement?.short_answer) {
              return requirement.short_answer;
            }
            if (requirement?.answer_text) {
              return requirement.answer_text;
            }
            if (requirement?.answer_template) {
              return requirement.answer_template || defaultSheetData;
            }
            if (currentTabContent.answer) return currentTabContent.answer;
            return currentTabContent?.data?.answer_template || defaultSheetData;
          }
          return valueFromSheetForm;
        }
        const requirementSheet =
          currentTabContent?.data?.requirements?.[essayData?.index];
        if (requirementSheet?.short_answer) {
          return requirementSheet.short_answer;
        }
        if (requirementSheet?.answer_text) {
          return requirementSheet.answer_text;
        }
        if (requirementSheet?.answer_template) {
          return requirementSheet.answer_template || defaultSheetData;
        }
        if (currentTabContent.answer) return currentTabContent.answer;
        return currentTabContent?.data?.answer_template || defaultSheetData;
      }
    }
  };
  return (
    <>
      <HighlightableHTML
        initialHTML={currentTabContent?.data?.question_content || ""}
        storageKey={storageKey}
        className="sapp-questions sapp-editor-reader"
      />

      {currentTabContent?.data?.requirements?.length > 0 ? (
        <RequirementsTab
          destroyInactiveTabPane
          items={essayRequirementsItem()}
          defaultActiveKey="0"
          onChange={(key) => {
            setEssayData({
              req: getValues(`${currentTabID}_${key}_answer`),
              index: Number(key),
            });
            refEditor.current?.reset();
          }}
        />
      ) : (
        <EssayQuestionPreview
          isShowContent={false}
          data={dataEssay}
          question_content={currentTabContent?.data?.question_content}
          question_data={currentTabContent?.data}
          index={essayData?.index}
          control={control}
          highlighted={highlighted}
          solution={solution}
          name={`${currentTabID}_${essayData?.index ?? 0}_answer`}
          setValue={setValue}
          defaultValue={defaultValueEssay()}
          response_option_custom={currentTabContent.response_type}
          externalRef={refEditor}
          fullData={currentTabContent}
          openChooseFile={() =>
            setOpenUpload({
              status: true,
              question_id: currentTabID,
              requirementIndex: essayData?.index,
            })
          }
          handleClearFile={handleClearFile}
          setOpenPdf={handleOpenScratchPad}
          handleSaveHighLightRequirement={handleSaveHighLightRequirement}
          showRequiment={showListRequirement}
          handleChange={handleEssayChange}
          storageKey={storageKey}
        />
      )}
    </>
  );
}
