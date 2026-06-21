"use client";

import { CheckCircleOutlineYellow } from "@lms/assets";
import {
  AnswerList,
  CommonQuestionBlockProps,
  DEFAULT_EDITOR_VALUE,
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
import React, { useEffect, useMemo, useRef } from "react";

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


  useEffect(() => {
    if (currentTabContent?.data?.requirements?.length > 0) {
      const responseOption = currentTabContent?.data?.response_option;
      
      currentTabContent.data.requirements.forEach((req: any, index: number) => {
        const fieldName = `${currentTabID}_${index}_answer`;
        
        if (responseOption === RESPONSE_OPTION.SHEET) {
  
          if (req?.short_answer) {
            const currentFormValue = getValues(fieldName);
            
            let shouldUpdate = false;
            
            if (!currentFormValue) {
              shouldUpdate = true;
            } else if (currentFormValue !== req.short_answer) {
              if (req?.answer_template && currentFormValue === req.answer_template) {
                shouldUpdate = true;
              }
            }
            
            if (shouldUpdate) {
              setValue(fieldName, req.short_answer);
            }
          }
        } 
        else if (responseOption === RESPONSE_OPTION.WORD) {
          if (req?.short_answer) {
            const currentFormValue = getValues(fieldName);
            
            const isFormEmpty = !currentFormValue || 
                               currentFormValue === DEFAULT_EDITOR_VALUE ||
                               currentFormValue === req?.answer_template;
            
            if (isFormEmpty) {
              setValue(fieldName, req.short_answer);
            }
          }
        }
      });
    }
  }, [
    currentTabContent?.id, 
    currentTabContent?.data?.requirements, 
    currentTabContent?.data?.response_option,
    currentTabID, 
    setValue, 
    getValues
  ]);

  const handleEssayChange = (id: string) => {
    setAnswerListValue(id as unknown as number);
  };

  const essayRequirementsItem = (): TabsProps["items"] => {
    return (
      currentTabContent?.data?.requirements?.map(
        (requirement: any, index: number) => {
        
          const key = `${currentTabID}_${index}_answer`;
          const getDefaultValueEssay = () => {
            const valueFromForm = getValues(key);
            const response_option = currentTabContent?.data?.response_option;
            
            switch (response_option) {
              case RESPONSE_OPTION.WORD:
                // Priority: answer_text (saved by handleSaveAnswerEssay) > short_answer (from API) > form value > template
                if (requirement?.answer_text) {
                  // Check if answer_text is not just the template
                  const isAnswerSameAsTemplate = requirement.answer_text === requirement?.answer_template;
                  if (!isAnswerSameAsTemplate) {
                    return requirement.answer_text;
                  }
                }
                if (requirement?.short_answer) {
                  return requirement.short_answer;
                }
                
                // Only use form value if no saved answer exists
                if (valueFromForm !== undefined && valueFromForm !== null && valueFromForm !== '') {
                  return valueFromForm;
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
                
                if (requirement?.answer_text) {
                  return requirement.answer_text;
                }
                
                if (requirement?.short_answer) {
                  return requirement.short_answer;
                }
                
                if (valueFromSheetForm) {
                  try {
                    const formWorkbook = JSON.parse(valueFromSheetForm);
                    const isEmptyWorkbook = isWorkbookEmpty(formWorkbook);
                    
                    if (!isEmptyWorkbook) {
                      if (requirement?.answer_template) {
                        try {
                          const templateWorkbook = JSON.parse(requirement.answer_template);
                          const isTemplateMatch = JSON.stringify(formWorkbook) === JSON.stringify(templateWorkbook);
                          if (!isTemplateMatch) {
                            return valueFromSheetForm;
                          }
                        } catch (e) {
                          // Template parse failed, use form value
                          return valueFromSheetForm;
                        }
                      } else {
                        // No template to compare, use form value
                        return valueFromSheetForm;
                      }
                    }
                  } catch (e) {
                    // If parse fails, still try to use it
                    return valueFromSheetForm;
                  }
                }
                
                // FALLBACK: template
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
            }
          };
          const hasAnswer =
           currentTabContent?.data?.response_option === RESPONSE_OPTION.SHEET
             ? checkSheetAnswered(
               getValues(`${currentTabID}_${index}_answer`),
             )
             : hasEditorValueFromHtml(
               getDefaultValueEssay()
             )
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
                    key={`${currentTabID}_${index}`}
                    data={{
                      ...currentTabContent?.data?.requirements?.[index],
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
                    externalRef={index === essayData?.index ? refEditor : undefined}
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
        const requirement =
          currentTabContent?.data?.requirements?.[essayData?.index];

        // Priority: answer_text (saved by handleSaveAnswerEssay) > short_answer (from API) > form value > template
        if (requirement?.answer_text) {
          const isAnswerSameAsTemplate = requirement.answer_text === requirement?.answer_template;
          if (!isAnswerSameAsTemplate) {
            return requirement.answer_text;
          }
        }
        if (requirement?.short_answer) {
          return requirement.short_answer;
        }
        if (valueFromForm !== undefined && valueFromForm !== null) {
          return valueFromForm;
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
        const requirement =
          currentTabContent?.data?.requirements?.[essayData?.index];
        
        if (requirement?.answer_text) {
          return requirement.answer_text;
        }
        
        if (requirement?.short_answer) {
          return requirement.short_answer;
        }
        
        const valueFromSheetForm = getValues(
          `${currentTabID}_${essayData?.index ?? 0}_answer`,
        );
        if (valueFromSheetForm) {
          try {
            const formWorkbook = JSON.parse(valueFromSheetForm);
            const isEmptyWorkbook = isWorkbookEmpty(formWorkbook);
            
            if (!isEmptyWorkbook) {
              if (requirement?.answer_template) {
                try {
                  const templateWorkbook = JSON.parse(requirement.answer_template);
                  const isTemplateMatch = JSON.stringify(formWorkbook) === JSON.stringify(templateWorkbook);
                  if (!isTemplateMatch) {
                    return valueFromSheetForm;
                  }
                } catch (e) {
                  return valueFromSheetForm;
                }
              } else {
                return valueFromSheetForm;
              }
            }
          } catch (e) {
            return valueFromSheetForm;
          }
        }
        
        if (requirement?.answer_template) {
          return requirement.answer_template || defaultSheetData;
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
          items={essayRequirementsItem()}
          defaultActiveKey="0"
          onChange={(key) => {
            setEssayData({
              req: currentTabContent?.data?.requirements?.[Number(key)],
              index: Number(key),
            });
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
