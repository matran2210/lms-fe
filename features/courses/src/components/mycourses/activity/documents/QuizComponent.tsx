import {
  CircleCheckIcon,
  CircleInfoIcon,
  CloseIconV2,
  CollapseArrowIcon,
  DownloadIcon,
  FileTextIcon,
  NotesOutline, PulsingExclamation
} from "@lms/assets";
import {
  IActivityStateQuestion,
  clearFileEssay,
  confirmQuestion,
  pushNotes,
  saveFileEssay,
  useAppDispatch,
  useFeature,
} from "@lms/contexts";
import {
  ANIMATION,
  DEFAULT_EDITOR_VALUE,
  QUESTION_TYPES,
  RESPONSE_OPTION,
  defaultSheetData
} from "@lms/core";
import { useTailwindBreakpoint } from "@lms/hooks";
import {
  AddWordPreview,
  EditorReader,
  EssayQuestionPreview,
  FileViewer,
  HighlightableHTML,
  MatchQuizComponent,
  MultiChoiceQuestion,
  NewDragNDropQuestion,
  OneChoiceQuestion,
  Popover,
  SelectWord,
  useClickOutside,
} from "@lms/ui";
import ModalUploadFile from "@lms/ui/components/uploadFile/ModalUploadFile/ModalUploadFile";
import { checkSheetAnswered, isEmptyParagraph } from "@lms/utils";
import { Collapse, CollapseProps, Divider, Modal, Tabs } from "antd";
import clsx from "clsx";
import { isEmpty, isUndefined } from "lodash";
import React, {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Control,
  FieldValues,
  UseFormGetValues,
  UseFormReset,
  UseFormResetField,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import toast from "react-hot-toast";

import { IEssayAnswer, IExhibit, IExhibitData, IFile } from "@lms/core";
import { SlotValue } from "@lms/ui/components/questionType/NewDragNDropQuestion/NewDragNDrop";
import { v4 as uuidv4 } from "uuid";

interface IRequirement {
  id: string;
  name: string;
  type?: "TEXT" | "FILE";
  description: string;
  files?: IFile[];
  answer_file?: {
    file_key: string;
    file_name: string;
  };
  short_answer?: string;
  explanation?: string;
}

export type QuizComponentRef = {
  onSubmit: ({
    activityId,
    tabId,
    quizId,
    time_spent,
    then,
    onError,
    onFinally,
  }: {
    activityId: string;
    tabId: string;
    quizId: string;
    time_spent?: number;
    then?: (e: any) => void;
    onError?: (e: any) => void;
    onFinally?: () => void;
  }) => void;
  reset: UseFormReset<FieldValues>;
  onSaveAnswer: (activeQuestion: IActivityStateQuestion) => void;
  onResetWord: (
    name: string,
    response_option: RESPONSE_OPTION,
    defaultValue?: string | undefined,
  ) => Promise<void>;
  onResetSheet: (response_option: RESPONSE_OPTION) => Promise<void>;
  watch: UseFormWatch<FieldValues>;
  getValues: UseFormGetValues<FieldValues>;
  onResetFormatEssay: (key: string, value: string) => void;
  onResetWordOnly: (
    response_option: RESPONSE_OPTION,
    defaultValue?: string | undefined,
  ) => Promise<void>;
  onResetAnswerEssayToTemplate: () => void;
  getEssayData: () =>
    | {
      req?: IRequirement;
      index?: number;
    }
    | undefined;
};

type Props = {
  activeQuestion?: IActivityStateQuestion;
  showCorrect?: boolean;
  document_id: string;
  activityId: string;
  tabId: string;
  quizId: string;
  setOpenFile?: (
    data: IExhibitData,
    file?: string | null,
    fileName?: string | null,
    event?: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => void;
  grading_preference: "AFTER_EACH_QUESTION" | "AFTER_ALL_QUESTIONS";
  showQuestionContent?: boolean;
  isHideExhibit?: boolean;
  saveAnswer?: () => void;
  exhibitText?: string;
  controlAnswer: Control<FieldValues, any>;
  setValue?: UseFormSetValue<FieldValues>;
  reset?: UseFormReset<FieldValues>;
  getValues?: UseFormGetValues<FieldValues>;
  watch?: UseFormWatch<FieldValues>;
  resetField?: UseFormResetField<FieldValues>;
};

const QuizComponent = forwardRef<QuizComponentRef, Props>(
  (
    {
      activeQuestion,
      showCorrect,
      document_id,
      activityId,
      tabId,
      quizId,
      setOpenFile,
      grading_preference,
      showQuestionContent = true,
      saveAnswer,
      exhibitText = "Exhibit",
      controlAnswer,
      setValue,
      reset,
      getValues,
      watch,
      resetField,
    }: Props,
    ref,
  ) => {
    const { uploadApi,
      testServiceApi,
      courseApi,
    } = useFeature();
    const isAFTEREACHQUESTION = grading_preference === "AFTER_EACH_QUESTION";
    const questionRef = useRef<HTMLDivElement>(null);
    const isShowIconButtonInBottom = [
      QUESTION_TYPES.FILL_WORD,
      QUESTION_TYPES.TRUE_FALSE,
      QUESTION_TYPES.ONE_CHOICE,
      QUESTION_TYPES.SELECT_WORD,
    ].includes(activeQuestion?.qType as QUESTION_TYPES);
    const dispatch = useAppDispatch();
    const { isMobileView } = useTailwindBreakpoint();

    // const DragDropRef = useRef(null) as any;
    const MatchQuizRef = useRef(null) as any;

    const [showListRequirement, setShowListRequirement] =
      useState<boolean>(false);
    const listRequirementRef = useRef<HTMLDivElement>(null);
    const [exhibitData, setExhibitData] = useState<IExhibit[]>();

    const [isChange, setIsChange] = useState<boolean>(false);
    const [isUploadFile, setIsUploadFile] = useState<boolean>(false);
    const [essayData, setEssayData] = useState<{
      req?: IRequirement;
      index?: number;
    }>();
    const [showWarning, setShowWarning] = useState(true);

    useClickOutside({
      ref: listRequirementRef,
      callback: () => setShowListRequirement(false),
    });

    const [showRequirement, setShowRequirement] = useState<{
      id: string;
      description: string;
      index: number;
      name: string;
      files: any;
    } | null>();

    const [openUpload, setOpenUpload] = useState<{
      requirement_id?: string;
      question_id?: string;
      status: boolean;
    }>({ requirement_id: undefined, question_id: undefined, status: false });

    const [openExhibitModal, setOpenExhibitModal] = useState(false);
    const refEditor = useRef(null) as any;
    const essayDataRef = useRef(essayData);

    // const handleResetEssay = async (
    //   name: string,
    //   defaultValue?: string | null,
    // ) => {
    //   if (activeQuestion?.response_option === RESPONSE_OPTION.WORD) {
    //     const content = defaultValue ?? "";
    //     onResetFormatEssay(name, content);
    //     refEditor?.current?.reset(content);
    //     await new Promise((resolve) => setTimeout(resolve, 10));
    //   } else if (activeQuestion?.response_option === RESPONSE_OPTION.SHEET) {
    //     onResetFormatEssay(name, defaultValue ?? defaultSheetData);
    //     // refEditor?.current?.resetSheet()
    //     if (refEditor?.current?.clear) {
    //       refEditor.current.clear(defaultValue ?? defaultSheetData);
    //     }
    //   }
    // };

    const onResetWord = async (
      name: string,
      response_option: RESPONSE_OPTION,
      defaultValue?: string,
    ) => {
      if (response_option === RESPONSE_OPTION.WORD) {
        onResetFormatEssay(name, defaultValue ?? "");
        refEditor?.current?.reset(defaultValue);
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
    };
    const onResetWordOnly = async (
      response_option: RESPONSE_OPTION,
      defaultValue?: string,
    ) => {
      if (response_option === RESPONSE_OPTION.WORD) {
        refEditor?.current?.reset(defaultValue);
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
    };
    const onResetSheet = async (response_option: RESPONSE_OPTION) => {
      if (response_option === RESPONSE_OPTION.SHEET) {
        refEditor?.current?.resetSheet();
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
    };

    const onOpenExhibitModal = () => {
      setOpenExhibitModal(true);
      setShowWarning(false);
    };
    const onCloseExhibitModal = () => {
      setOpenExhibitModal(false);
    };

    const handleShowRequirement = async (data: {
      description: string;
      index: number;
      name: string;
      files: any;
      id: string;
    }) => {
      saveAnswer && saveAnswer();
      setShowListRequirement(false);
      setShowRequirement(data);
      essayDataRef.current = {
        req: data,
        index: data.index - 1,
      };
      setEssayData({
        req: data,
        index: data.index - 1,
      });
    };

    const getValueFillText = () => {
      const value = [];
      const inputs = questionRef?.current?.querySelectorAll(
        'input[stringHTML="true"]',
      ) as any;
      for (const e of inputs) {
        value?.push(e?.value);
      }
      return value;
    };

    const getAnswerMatching = () => {
      const value = MatchQuizRef?.current?.getMatchedPairs?.();
      return value || [];
    };

    // const getAnswerDragNDrop = () => {
    //   let value = [] as any
    //   const inputs = questionRef?.current?.querySelectorAll(
    //     '.sapp-input-dragNDrop',
    //   ) as any
    //   for (let e of inputs) {
    //     const idAnswer = e?.querySelector('span')
    //     value.push({ id: e?.id, value: e?.innerText, idAnswer: idAnswer?.id })
    //   }
    //   return value
    // }

    const handleResponseResults = () => {
      if (activeQuestion) {
        if (!activeQuestion?.confirmed && !activeQuestion.isDrafAnswer) {
          return;
        }
        setTimeout(() => {
          switch (activeQuestion?.qType) {
            case QUESTION_TYPES.ONE_CHOICE:
            case QUESTION_TYPES.TRUE_FALSE: {
                setValue?.(
                  `${activeQuestion?.id}_${document_id}_answer`,
                  activeQuestion?.defaultValue,
                );

              break;
            }

            case QUESTION_TYPES.MULTIPLE_CHOICE: {
                setValue?.(
                  `${activeQuestion?.id}_${document_id}_answer`,
                  activeQuestion?.defaultValue,
                );
              break;
            }

            case QUESTION_TYPES.ESSAY: {
              activeQuestion?.myAnswers?.map((ans: IEssayAnswer) => {
                const fieldName = `${activeQuestion?.id}_${ans.requirement_id ?? document_id}_essay`;

                if (activeQuestion?.response_option === "SHEET") {
                  // Logic cho SHEET: luôn ưu tiên short_answer (user's changes)
                  if (ans?.short_answer) {
                    setValue?.(fieldName, ans?.short_answer);
                  } else {
                    // Không có short_answer → lấy từ answer_template
                    const requirement = activeQuestion?.requirements?.find(
                      (req: any) => req?.id === ans?.requirement_id,
                    );
                    const templateValue =
                      requirement?.answer_template ||
                      activeQuestion?.answer_template;

                    if (templateValue) {
                      setValue?.(fieldName, templateValue);
                    }
                  }
                } else {
                  // Logic cho WORD: giữ nguyên như cũ
                  if (ans?.short_answer) {
                    setValue?.(fieldName, ans?.short_answer);
                  }
                }
              });
            }
          }
        });
      }
    };

    // Lift onSubmit using useImperativeHandle
    useImperativeHandle(ref, () => ({
      onSubmit: onSubmit,
      reset: reset ?? (() => { }),
      onSaveAnswer: handleGetAnswer,
      onResetWord: onResetWord,
      onResetSheet: onResetSheet,
      watch: watch!,
      getValues: getValues!,
      onResetFormatEssay: onResetFormatEssay,
      onResetWordOnly: onResetWordOnly,
      onResetAnswerEssayToTemplate,
      getEssayData: () => essayDataRef.current,
    }));

    const handleGetAnswer = (activeQuestion: IActivityStateQuestion) => {
      switch (activeQuestion?.qType as QUESTION_TYPES) {
        case QUESTION_TYPES.ONE_CHOICE:
        case QUESTION_TYPES.TRUE_FALSE:
          return getValues?.(`${activeQuestion?.id}_${document_id}_answer`);
        case QUESTION_TYPES.MULTIPLE_CHOICE:
          return getValues?.(`${activeQuestion?.id}_${document_id}_answer`);
        case QUESTION_TYPES.FILL_WORD:
          return getValueFillText();
        case QUESTION_TYPES.SELECT_WORD:
          return getValues?.(`${activeQuestion?.id}_${document_id}_answer`);
        case QUESTION_TYPES.MATCHING:
          return getAnswerMatching();
        case QUESTION_TYPES.DRAG_DROP:
          return getValues?.(`${activeQuestion?.id}_${document_id}_answer`);
        case QUESTION_TYPES.ESSAY:
          const value = getValues?.(
            `${activeQuestion?.id}_${document_id}_essay`,
          );
          const isSubmitted = (() => {
            if (activeQuestion?.response_option === RESPONSE_OPTION.SHEET) {
              if (
                isChange ||
                (isUploadFile && grading_preference === "AFTER_ALL_QUESTIONS")
              ) {
                return true;
              } else if (value) {
                const data = JSON.parse(value);
                for (const e of data) {
                  if (e?.celldata && e?.celldata?.length > 0) {
                    return true;
                  }
                }
              }
              return false;
            } else {
              if (
                (value !== undefined && value !== "") ||
                isChange ||
                (isUploadFile && grading_preference === "AFTER_ALL_QUESTIONS")
              ) {
                return true;
              }
              return false;
            }
          })();

          let active = "UNFINISHED";

          if (isSubmitted || activeQuestion?.answer_file) {
            active = "SUBMITED";
          }
          if (activeQuestion?.requirements?.length) {
            const answers: IEssayAnswer[] = [];
            activeQuestion?.requirements?.forEach((req, i) => {
              const fieldName = `${activeQuestion?.id}_${req.id}_essay`;
              const savedData = activeQuestion?.myAnswers?.find(
                (ans: IEssayAnswer) => ans?.requirement_id === req?.id,
              );
              const answer = getValues?.(fieldName) || savedData?.short_answer;
              if (!!answer) {
                answers.push({
                  question_id: activeQuestion?.id || "",
                  answer_file: req?.answer_file,
                  short_answer:
                    !isUndefined(answer) && !isEmpty(answer)
                      ? String(answer).trim()
                      : "",
                  response_option: activeQuestion?.response_option
                    ? activeQuestion?.response_option
                    : "WORD",

                  requirement_id: req?.id,
                  active,
                });
              }
              // return {
              //   question_id: activeQuestion?.id,
              //   answer_file: req?.answer_file,
              //   short_answer:
              //     !isUndefined(answer) && !isEmpty(answer)
              //       ? String(answer).trim()
              //       : '',
              //   response_option: activeQuestion?.response_option
              //     ? activeQuestion?.response_option
              //     : 'WORD',

              //   requirement_id: req?.id,
              //   active,
              // }
            });
            return answers;
          } else {
            const answer = getValues?.(
              `${activeQuestion?.id}_${document_id}_essay`,
            );
            return [
              {
                question_id: activeQuestion?.id,
                answer_file: activeQuestion.answer_file,
                short_answer:
                  !isUndefined(answer) && !isEmpty(answer)
                    ? String(answer).trim()
                    : "",
                response_option: activeQuestion?.response_option
                  ? activeQuestion?.response_option
                  : "WORD",
                requirement_id: null,
                active,
              },
            ];
          }

        default:
          break;
      }
    };

    const onSubmit = ({
      activityId,
      tabId,
      quizId,
      time_spent,
      then,
      onError,
      onFinally: onFinally,
    }: {
      activityId: string;
      tabId: string;
      quizId: string;
      time_spent?: number;
      then?: (e: any) => void;
      onError?: (e: any) => void;
      onFinally?: () => void;
    }) => {
      if (activeQuestion) {
        const myAnswers = handleGetAnswer(activeQuestion);

        // DragDropRef?.current?.handleReset()
        try {
          dispatch(
            confirmQuestion({
              api: testServiceApi,
              courseApi: courseApi,
              activityId: activityId,
              tabId: tabId,
              quizId: quizId,
              questionId: activeQuestion?.id || "",
              myAnswers: myAnswers,
              time_spent: time_spent,
            }),
          )
            .unwrap()
            .then((e: any) => {
              then && then(e);
            })
            .catch((e) => {
              toast.error("Có lỗi xảy ra xin vui lòng thử lại!");
              onError && onError(e);
            });
        } catch (error) {
          toast.error("Có lỗi xảy ra xin vui lòng thử lại!");
          onError && onError(error);
        } finally {
          onFinally && onFinally();
        }
      }
    };

    const handleSaveFileEssay = (
      file: any,
      question_id: string,
      topic_id: string,
      requirement_id: string,
    ) => {
      try {
        dispatch(
          saveFileEssay({
            activityId,
            tabId,
            quizId,
            question_id: question_id,
            file: file,
            topic_id: topic_id,
            requirement_id,
            requirements: activeQuestion?.requirements?.map((item: any) => {
              if (item?.id === showRequirement?.id) {
                return {
                  ...item,
                  answer_file: {
                    file_key: file.file_key,
                    file_name: file.name,
                  },
                };
              }
              return item;
            }),
          }),
        );
        setIsUploadFile(true);
      } catch (error) {
        toast.error("Có lỗi xảy ra xin vui lòng thử lại!");
      }
    };

    const renderQuestion = () => {
      switch (activeQuestion?.qType) {
        case QUESTION_TYPES.ONE_CHOICE:
        case QUESTION_TYPES.TRUE_FALSE:
          return (
            <OneChoiceQuestion
              defaultValues={activeQuestion?.defaultValue}
              data={activeQuestion}
              control={controlAnswer}
              corrects={showCorrect ? activeQuestion?.corrects : undefined}
              setValue={setValue}
              setOpenFile={setOpenFile}
              name={`${activeQuestion?.id}_${document_id}_answer`}
              solution={activeQuestion?.solution}
              exhibitText={exhibitText}
              isShowWarning={
                !watch?.(`${activeQuestion?.id}_${document_id}_answer`) &&
                isAFTEREACHQUESTION
              }
              explainClassname="!mt-8 !p-0 !bg-transparent"
            />
          );

        case QUESTION_TYPES.MULTIPLE_CHOICE:
          return (
            <MultiChoiceQuestion
              defaultValues={activeQuestion?.defaultValue}
              data={activeQuestion}
              control={controlAnswer}
              corrects={showCorrect ? activeQuestion?.corrects : undefined}
              setValue={setValue}
              setOpenFile={setOpenFile}
              name={`${activeQuestion?.id}_${document_id}_answer`}
              solution={activeQuestion?.solution}
              exhibitText={exhibitText}
              isShowWarning={
                !(
                  watch?.(`${activeQuestion?.id}_${document_id}_answer`) &&
                  watch?.(`${activeQuestion?.id}_${document_id}_answer`)
                    .length > 0
                ) && isAFTEREACHQUESTION
              }
              explainClassname="!mt-8 !p-0 !bg-transparent"
            />
          );

        case QUESTION_TYPES.MATCHING:
          return (
            <MatchQuizComponent
              data={activeQuestion}
              action={getAnswerMatching}
              defaultAnswer={activeQuestion?.defaultValue}
              corrects={showCorrect ? activeQuestion?.corrects : undefined}
              setOpenFile={setOpenFile}
              uuid={"_" + uuidv4().replaceAll("-", "_")}
              solution={activeQuestion?.solution}
              exhibitText={exhibitText}
              ref={MatchQuizRef}
              explainClassname="!mt-0 !p-0 !bg-transparent"
              correctAnswerClass="!mt-0 !pt-0"
            />
          );

        case QUESTION_TYPES.FILL_WORD:
          return (
            <AddWordPreview
              data={activeQuestion}
              action={getValueFillText}
              defaultAnswer={activeQuestion?.defaultValue}
              setOpenFile={setOpenFile}
              corrects={showCorrect ? activeQuestion?.corrects : undefined}
              solution={activeQuestion?.solution}
              exhibitText={exhibitText}
              explainClassname="!mt-8 !p-0 !bg-transparent"
              correctAnswerClass="!mt-8 !pt-0"
            />
          );

        case QUESTION_TYPES.DRAG_DROP:
          return (
            // <DragNDropPreview
            //   data={activeQuestion}
            //   action={getAnswerDragNDrop}
            //   defaultAnswer={activeQuestion?.defaultValue}
            //   corrects={showCorrect ? activeQuestion?.corrects : undefined}
            //   resetDefaultAnswer={false}
            //   setOpenFile={setOpenFile}
            //   ref={DragDropRef}
            //   uuid={'_' + uuidv4().replaceAll('-', '_')}
            //   solution={activeQuestion?.solution}
            //   exhibitText={exhibitText}
            //   explainClassname="!mt-8 !p-0 !bg-transparent"
            //   correctAnswerClass="!mt-8 !pt-0"
            // />
            <NewDragNDropQuestion
              data={activeQuestion as any}
              defaultValue={activeQuestion?.defaultValue}
              onChange={(data: SlotValue[]) => {
                setValue?.(`${activeQuestion?.id}_${document_id}_answer`, data);
              }}
              corrects={showCorrect ? activeQuestion.corrects : undefined}
              solution={activeQuestion?.solution}
              explainClassname="!mt-8 !p-0 !bg-transparent"
            />
          );

        case QUESTION_TYPES.SELECT_WORD:
          return (
            <SelectWord
              onChange={(
                value: Array<{
                  answer_id: string;
                  answer_position: number;
                }>,
              ) =>
                setValue?.(`${activeQuestion?.id}_${document_id}_answer`, value)
              }
              data={activeQuestion}
              defaultAnswer={activeQuestion?.defaultValue}
              setOpenFile={setOpenFile}
              corrects={showCorrect ? activeQuestion.corrects : undefined}
              solution={activeQuestion?.solution}
              exhibitText={exhibitText}
              isShowWarning={isAFTEREACHQUESTION}
            />
          );

        case QUESTION_TYPES.ESSAY:
          const items =
            activeQuestion?.requirements?.map((e, i: number) => {
              // const hasAnswer = !!watch?.(
              //   `${activeQuestion?.id}_${activeQuestion?.requirements?.length && activeQuestion?.requirements?.length > 0 ? activeQuestion?.requirements?.[i]?.id : document_id}_essay`,
              // )
              const getDefaultValue = (isGetToVerify?: boolean) => {
                switch (activeQuestion?.response_option) {
                  case RESPONSE_OPTION.WORD:
                    return (
                      getValues?.(`${activeQuestion?.id}_${e?.id}_essay`) ||
                      activeQuestion?.myAnswers?.find((ans: IEssayAnswer) => {
                        if (ans.requirement_id === e?.id) {
                          return ans;
                        }
                      })?.short_answer ||
                      e?.answer_template
                    );
                    break;
                  case RESPONSE_OPTION.SHEET:
                    const answerSheet = activeQuestion?.myAnswers?.find(
                      (ans: IEssayAnswer) => {
                        if (ans.requirement_id === e?.id) {
                          return ans;
                        }
                      },
                    );
                    if (isGetToVerify) {
                      return answerSheet?.short_answer || e?.answer_template;
                    }

                    return (
                      getValues?.(`${activeQuestion?.id}_${e?.id}_essay`) ||
                      answerSheet?.short_answer ||
                      e.answer_template
                    );
                    break;
                }
              };

              const isMeaningData = (() => {
                if (activeQuestion?.response_option === RESPONSE_OPTION.WORD) {
                  const currentValue = getDefaultValue(true);
                  return (
                    currentValue &&
                    currentValue !== DEFAULT_EDITOR_VALUE &&
                    currentValue.trim() !== "" &&
                    !isEmptyParagraph(currentValue)
                  );
                } else if (
                  activeQuestion?.response_option === RESPONSE_OPTION.SHEET
                ) {
                  const currentValue = getDefaultValue(true);

                  return !!(
                    currentValue &&
                    currentValue !== defaultSheetData &&
                    checkSheetAnswered(currentValue)
                  );
                }
                return false;
              })();

              return {
                key: e?.id,
                label: (
                  <div className="learning-act-tab-label flex items-center gap-1 text-base font-normal capitalize">
                    {`Requirement ${i + 1}`}{" "}
                    {isMeaningData && (
                      <div className="text-primary">
                        <CircleCheckIcon />
                      </div>
                    )}
                  </div>
                ),
                children: (
                  <div className="mt-6">
                    {/* <Alert
                      message={
                        <div className="text-xs text-gray-800">
                          This feature is only available on desktop or tablet.
                        </div>
                      }
                      type={'info'}
                      showIcon
                      className="w-full rounded-md px-[14px] md:hidden"
                      icon={
                        <div className={'!mr-4'}>
                          <AlertInfoIcon />
                        </div>
                      }
                    /> */}
                    <EssayQuestionPreview
                      className="!rounded-none !bg-transparent !p-0 md:block"
                      editorClassName="learning-act-editor"
                      explainClassname="!mt-8 !mb-0 !p-0 !bg-transparent"
                      defaultValue={getDefaultValue()}
                      data={e}
                      question_content={activeQuestion?.question_content}
                      index={i}
                      question_data={activeQuestion}
                      control={controlAnswer}
                      setValue={setValue}
                      handleSaveHighLight={() => { }}
                      forCaseStudy={true}
                      name={`${activeQuestion?.id}_${e?.id}_essay`}
                      fullData={{
                        data: { ...activeQuestion },
                        solution: activeQuestion?.solution ?? "",
                      }}
                      openChooseFile={(e: any) =>
                        setOpenUpload({
                          status: true,
                          question_id: activeQuestion?.id,
                          requirement_id: showRequirement?.id,
                        })
                      }
                      handleClearFile={() => {
                        dispatch(
                          clearFileEssay({
                            activityId,
                            tabId,
                            quizId,
                            question_id: activeQuestion?.id,
                            requirement_id: showRequirement?.id,
                            requirements: activeQuestion?.requirements?.map(
                              (item: IRequirement) => {
                                if (item?.id === showRequirement?.id) {
                                  return { ...item, answer_file: null };
                                }
                                return item;
                              },
                            ),
                          }),
                        );
                      }}
                      handleChange={() => {
                        !isChange && setIsChange(true);
                      }}
                      isShowContent={showQuestionContent}
                      externalRef={refEditor}
                      setOpenPdf={(type: string, file?: string | undefined, fileName?: string | undefined) => { 
                        handleOpenFile({resource: {
                            name: fileName as string,
                            url: file as string,
                          }
                        } as IFile)
                      }}
                    />
                  </div>
                ),
              };
            }) ?? [];

          const getDefaultValue = () => {
            const currentReqId =
              showRequirement?.id ??
              activeQuestion?.requirements?.[essayData?.index ?? 0]?.id;
            const currentReq = activeQuestion?.requirements?.find(
              (r: any) => r?.id === currentReqId,
            );
            const hasRequirements =
              Array.isArray(activeQuestion?.requirements) &&
              activeQuestion?.requirements?.length > 0;
            switch (activeQuestion?.response_option) {
              case RESPONSE_OPTION.WORD: {
                if (!hasRequirements) {
                  const answerAlone = activeQuestion?.myAnswers?.[0];
                  return (
                    (answerAlone?.short_answer as any) ||
                    (activeQuestion?.answer_template as any) ||
                    ""
                  );
                } else {
                  const answer = activeQuestion?.myAnswers?.find(
                    (ans: IEssayAnswer) => ans.requirement_id === currentReqId,
                  );
                  return (
                    (answer?.short_answer as any) ||
                    (currentReq?.answer_template as any) ||
                    ""
                  );
                }
              }
              case RESPONSE_OPTION.SHEET: {
                if (!hasRequirements) {
                  const answerAlone = activeQuestion?.myAnswers?.[0];
                  return (
                    (answerAlone?.short_answer as any) ||
                    (activeQuestion?.answer_template as any) ||
                    defaultSheetData
                  );
                } else {
                  const answerSheet = activeQuestion?.myAnswers?.find(
                    (ans: IEssayAnswer) => ans.requirement_id === currentReqId,
                  );
                  return (
                    (answerSheet?.short_answer as any) ||
                    (currentReq?.answer_template as any) ||
                    defaultSheetData
                  );
                }
              }
            }
          };
          return (
            <>
              <div>
                <div className="mb-6">
                  <div>
                    <EditorReader
                      className="text-lg"
                      text_editor_content={activeQuestion?.question_content}
                    />
                  </div>
                  {!!activeQuestion?.requirements?.length && (
                    <div className="mt-6 flex items-start gap-2 text-warning">
                      <CircleInfoIcon className="shrink-0" />
                      <div className="text-base font-normal">
                        You must finished{" "}
                        {activeQuestion?.requirements?.length || 0} requirements
                        to complete this question (Your answer is auto save)
                      </div>
                    </div>
                  )}
                </div>

                {!!activeQuestion?.requirements?.length ? (
                  <Tabs
                    className={clsx("learning-activity-tabs requirement-tab")}
                    items={items}
                    onChange={(key: string) => {
                      const optionIndex =
                        activeQuestion?.requirements?.findIndex(
                          (item: IRequirement) => item?.id === key,
                        );
                      if (optionIndex !== -1) {
                        const option =
                          activeQuestion?.requirements?.[optionIndex ?? 0];
                        handleShowRequirement({
                          id: key,
                          description: option?.description ?? "",
                          index: (optionIndex ?? 0) + 1,
                          name: option?.name ?? "",
                          files: option?.files ?? [],
                        });
                      }
                    }}
                  />
                ) : (
                  <div className="mt-6">
                    {/* <Alert
                      message={
                        <div className="text-xs text-gray-800">
                          This feature is only available on desktop or tablet.
                        </div>
                      }
                      type={'info'}
                      showIcon
                      className="w-full rounded-md px-[14px] md:hidden"
                      icon={
                        <div className={'!mr-4'}>
                          <AlertInfoIcon />
                        </div>
                      }
                    /> */}
                    <EssayQuestionPreview
                      className="!rounded-none !bg-transparent !p-0 md:block"
                      editorClassName="learning-act-editor"
                      explainClassname="!mt-8 !mb-0 !p-0 !bg-transparent"
                      defaultValue={getDefaultValue()}
                      data={activeQuestion?.requirements?.find(
                        (r: any) =>
                          r?.id ===
                          (showRequirement?.id ??
                            activeQuestion?.requirements?.[
                              essayData?.index ?? 0
                            ]?.id),
                      )}
                      question_content={activeQuestion?.question_content}
                      index={essayData?.index}
                      question_data={activeQuestion}
                      control={controlAnswer}
                      setValue={setValue}
                      handleSaveHighLight={() => { }}
                      forCaseStudy={true}
                      name={`${activeQuestion?.id}_${activeQuestion?.requirements?.length && activeQuestion?.requirements?.length > 0 ? activeQuestion?.requirements?.[essayData?.index ?? 0]?.id : document_id}_essay`}
                      fullData={{
                        data: { ...activeQuestion },
                        solution: activeQuestion?.solution ?? "",
                      }}
                      openChooseFile={(e: any) =>
                        setOpenUpload({
                          status: true,
                          question_id: activeQuestion?.id,
                          requirement_id: showRequirement?.id,
                        })
                      }
                      handleClearFile={() => {
                        dispatch(
                          clearFileEssay({
                            activityId,
                            tabId,
                            quizId,
                            question_id: activeQuestion?.id,
                            requirement_id: showRequirement?.id,
                            requirements: activeQuestion?.requirements?.map(
                              (item: IRequirement) => {
                                if (item?.id === showRequirement?.id) {
                                  return { ...item, answer_file: null };
                                }
                                return item;
                              },
                            ),
                          }),
                        );
                      }}
                      handleChange={() => {
                        !isChange && setIsChange(true);
                      }}
                      isShowContent={showQuestionContent}
                      externalRef={refEditor}
                    />
                  </div>
                )}
              </div>
            </>
          );

        default:
          return <div></div>;
      }
    };

    const handleDefaultRequirement = () => {
      const defaultRequirement = activeQuestion?.requirements?.[0];
      if (defaultRequirement?.id) {
        setShowRequirement({
          name: defaultRequirement?.name,
          id: defaultRequirement?.id,
          description: defaultRequirement?.description,
          files: defaultRequirement?.files,
          index: 1,
        });
      } else {
        setShowRequirement(null);
      }
    };

    const handleGetExhibit = () => {
      if (activeQuestion?.requirements) {
        essayDataRef.current = {
          req: activeQuestion?.requirements?.[0],
          index: 0,
        };
        setEssayData({
          req: activeQuestion?.requirements?.[0],
          index: 0,
        });
      }
      const exhibitOption = [];

      if (
        activeQuestion?.exhibits?.length &&
        0 < activeQuestion?.exhibits?.length
      ) {
        exhibitOption.push(...activeQuestion?.exhibits);
      }

      if (activeQuestion?.question_topic?.exhibits?.length) {
        exhibitOption?.push(...activeQuestion?.question_topic?.exhibits);
      }

      setExhibitData(exhibitOption);
    };
    const onResetFormatEssay = (key: string, value: string) => {
      resetField?.(key, {
        defaultValue: value,
        keepDirty: false,
        keepTouched: false,
        keepError: false,
      }); // reset riêng field đó
      setValue?.(key, value, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: true,
      });
    };
    const handleOpenExhibit = (
      event: React.MouseEvent<HTMLDivElement, MouseEvent>,
      e: IExhibitData,
      index: number,
    ) => {
      setShowWarning(false);
      setOpenFile &&
        setOpenFile(
          {
            type: "exhibits",
            description: e?.description,
            name: e?.name,
            index: index,
            files: e?.files,
          },
          null,
          null,
          event,
        );
    };
    const handleOpenFile = (e: IFile) => {
      setOpenFile &&
        setOpenFile({ type: "file" }, e?.resource?.url, e?.resource?.name);
    };
    const handleAddNote = () => {
      const note = {
        uuid: uuidv4(),
        id: "",
        name: "Note",
        description: "",
      };
      dispatch(pushNotes(note));
    };

    const getTemplateValueForWord = () => {
      const requirement =
        activeQuestion?.requirements?.[essayData?.index as number];
      if (requirement?.answer_template) {
        return requirement.answer_template;
      }
      return activeQuestion?.answer_template;
    };

    const getTemplateValueForSheet = () => {
      const requirementSheet =
        activeQuestion?.requirements?.[essayData?.index as number];
      if (requirementSheet?.answer_template) {
        return requirementSheet.answer_template || defaultSheetData;
      }
      return activeQuestion?.answer_template || defaultSheetData;
    };
    const onResetAnswerEssayToTemplate = () => {
      const key = `${activeQuestion?.id}_${activeQuestion?.requirements?.length ? activeQuestion?.requirements?.[essayData?.index ?? 0]?.id : document_id}_essay`;
      const response_option = activeQuestion?.response_option;

      switch (response_option) {
        case RESPONSE_OPTION.WORD:
          const templateValueWord = getTemplateValueForWord();
          // Reset form value
          onResetFormatEssay(key, templateValueWord ?? "");
          // Reset component con
          if (refEditor?.current?.reset) {
            refEditor.current.reset(templateValueWord);
          }
          break;
        case RESPONSE_OPTION.SHEET:
          const templateValue = getTemplateValueForSheet();
          // Reset form value
          onResetFormatEssay(key, templateValue);
          // Reset component con
          if (refEditor?.current?.clear) {
            refEditor.current.clear(templateValue);
          }
          break;
      }
    };

    useEffect(() => {
      handleDefaultRequirement();
      handleGetExhibit();
      if (
        activeQuestion?.qType === QUESTION_TYPES.ONE_CHOICE ||
        activeQuestion?.qType === QUESTION_TYPES.TRUE_FALSE ||
        activeQuestion?.qType === QUESTION_TYPES.MULTIPLE_CHOICE ||
        activeQuestion?.qType === QUESTION_TYPES.ESSAY
      ) {
        handleResponseResults();
      }
    }, [activeQuestion?.id]);

    const exhibitButton = (
      <>
        <NotesOutline className="h-8 w-8 text-white" />
        <div className="pointer-events-none absolute inset-0 rounded-full bg-white opacity-0 transition-opacity group-hover/exhibit:opacity-20" />
        {showWarning && (
          <PulsingExclamation
            className="absolute -right-3 -top-4"
            style={{
              animation: "pulseAnim 1.2s infinite ease-in-out",
              transformOrigin: "center",
            }}
          />
        )}
      </>
    );

    const exhibitItems: CollapseProps["items"] = exhibitData?.length
      ? exhibitData?.map((item: IExhibit, index) => ({
        key: item?.id,
        label: (
          <p className="mb-[10px] flex items-center gap-2 text-xs font-semibold text-gray-800">
            <NotesOutline className="h-5 w-5 shrink-0 text-icon" />
            {`${exhibitText} ${index + 1}: ${item?.name}`}
          </p>
        ),
        children: (
          <div className="text-xs">
            <EditorReader
              text_editor_content={item?.description}
              className="w-full"
            />
            {item?.files?.length > 0 &&
              item?.files.map((e: any, index: number) => {
                return (
                  <div key={index} className="h-full cursor-pointer">
                    <FileViewer
                      fileName={e?.resource?.name}
                      fileUrl={e?.resource?.url}
                    />
                  </div>
                );
              })}
          </div>
        ),
        className: "mb-2 p-2 !border-none !rounded-md bg-gray-100",
      }))
      : [];

    return (
      <div data-aos={ANIMATION.DATA_AOS}>
        <div ref={questionRef}>
          {!!activeQuestion?.question_topic?.description &&
            !isEmptyParagraph(activeQuestion?.question_topic?.description) && (
              <HighlightableHTML
                initialHTML={activeQuestion?.question_topic?.description ?? ""}
                storageKey={`quiz-${activityId}-${tabId}-${quizId}-question-topic-${activeQuestion?.id}`}
                className="sapp-questions"
              />
            )}

          {!!activeQuestion?.question_topic?.description &&
            !isEmptyParagraph(activeQuestion?.question_topic?.description) && (
              <Divider className="my-4 bg-gray-300 md:my-8" />
            )}
          <div className="relative">
            {renderQuestion()}
            <div className="absolute -right-4 bottom-[10px] z-[1050] flex w-12 flex-col gap-2">
              {/* --- Exhibit Button --- */}
              {exhibitData && exhibitData?.length > 0 && (
                <div className="isolate">
                  <Popover
                    placement="leftTop"
                    trigger="click"
                    getPopupContainer={() => document.body}
                    content={
                      <div className="flex flex-col gap-2">
                        {exhibitData?.map((e: any, index: number) => (
                          <div
                            key={e?.value}
                            className="min-w-36 cursor-pointer rounded-md p-2 text-center hover:bg-secondary-800"
                            onClick={(event) =>
                              handleOpenExhibit(event, e, index)
                            }
                          >
                            {exhibitText} {index + 1}
                          </div>
                        ))}
                      </div>
                    }
                    zIndex={1050}
                    className="hidden md:grid"
                  >
                    <div
                      className={clsx(
                        "group/exhibit grid h-12 w-12 cursor-pointer place-items-center rounded-full bg-primary shadow-icon hover:bg-blend-overlay",
                        {
                          "top-[12px]":
                            (activeQuestion?.qType === QUESTION_TYPES.ESSAY &&
                              !activeQuestion?.requirements?.length) ||
                            !isShowIconButtonInBottom,
                          "top-[142px]":
                            activeQuestion?.qType === QUESTION_TYPES.ESSAY &&
                            !!activeQuestion?.requirements?.length,
                          "bottom-[62px]": isShowIconButtonInBottom,
                        },
                      )}
                    >
                      {exhibitButton}
                    </div>
                  </Popover>

                  <div
                    className={clsx(
                      "group/exhibit grid h-12 w-12 cursor-pointer place-items-center rounded-full bg-primary shadow-icon hover:bg-blend-overlay md:hidden",
                    )}
                    onClick={onOpenExhibitModal}
                  >
                    {exhibitButton}
                  </div>
                </div>
              )}

              {/* --- File Button --- */}
              {activeQuestion?.question_topic?.files?.length > 0 && (
                <div className="isolate">
                  <Popover
                    placement="leftTop"
                    trigger="click"
                    getPopupContainer={() => document.body}
                    content={
                      <div className="flex flex-col gap-2">
                        {activeQuestion?.question_topic?.files?.map(
                          (e: any) => (
                            <div
                              className="flex items-start justify-between gap-8 p-2"
                              key={e?.value}
                            >
                              <div
                                className="min-w-36 max-w-96 cursor-pointer overflow-hidden text-ellipsis text-nowrap text-white underline hover:text-primary"
                                onClick={() => handleOpenFile(e)}
                              >
                                {e?.resource?.name}
                              </div>
                              <div
                                className="cursor-pointer text-white"
                                onClick={() =>
                                  testServiceApi.downloadFile({
                                    files: [
                                      {
                                        name: e?.resource?.name,
                                        file_key: e?.resource?.file_key,
                                      },
                                    ],
                                  })
                                }
                              >
                                <DownloadIcon color="currentColor" />
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    }
                    zIndex={1050}
                  >
                    <div
                      className={clsx(
                        "group/file grid h-12 w-12 cursor-pointer place-items-center rounded-full bg-primary text-white shadow-icon hover:bg-blend-overlay",
                        {
                          "top-[74px]":
                            (activeQuestion?.qType === QUESTION_TYPES.ESSAY &&
                              !activeQuestion?.requirements?.length) ||
                            !isShowIconButtonInBottom,
                          "top-[214px]":
                            activeQuestion?.qType === QUESTION_TYPES.ESSAY &&
                            !!activeQuestion?.requirements?.length,
                          "bottom-0": isShowIconButtonInBottom,
                        },
                      )}
                    >
                      <FileTextIcon />
                      <div className="pointer-events-none absolute inset-0 rounded-full bg-white opacity-0 transition-opacity group-hover/file:opacity-20" />
                    </div>
                  </Popover>
                </div>
              )}
            </div>
          </div>
        </div>

        {openUpload.status && (
          <ModalUploadFile
            open={openUpload.status}
            isMultiple={false}
            handleClose={() => {
              setOpenUpload({
                status: false,
                question_id: undefined,
                requirement_id: undefined,
              });
            }}
            overlayClass="!h-screen"
            className="!overflow-auto"
            fileType={"ESSAY"}
            location={`question-answer/${openUpload.question_id}`}
            setSelectedFile={(e: any) =>
              handleSaveFileEssay(
                e?.[0],
                openUpload?.question_id ?? "",
                "",
                showRequirement?.id ?? "",
              )
            }
          />
        )}
        {isMobileView && openExhibitModal && (
          <Modal
            onCancel={onCloseExhibitModal}
            title="Exhibit"
            closeIcon={<CloseIconV2 />}
            centered
            open={openExhibitModal}
            footer={null}
            classNames={{
              content: "!p-4 !shadow-modal exhibit-modal-content",
              header: "!mb-6",
              wrapper: "exhibit-modal-wrapper",
            }}
          >
            <div className="flex flex-col gap-2">
              <Collapse
                bordered={false}
                expandIconPosition="end"
                defaultActiveKey={
                  exhibitData?.length
                    ? exhibitData.map((item: IExhibit) => item?.id)
                    : []
                }
                expandIcon={({ isActive }) => (
                  <CollapseArrowIcon
                    selected={isActive}
                    className="h-5 w-5 md:h-6 md:w-6"
                  />
                )}
                items={exhibitItems}
                className="!bg-white p-0"
                rootClassName="learning-activity-collapse"
              />
            </div>
          </Modal>
        )}
      </div>
    );
  },
);

QuizComponent.displayName = "QuizComponent";
export default memo(QuizComponent);
