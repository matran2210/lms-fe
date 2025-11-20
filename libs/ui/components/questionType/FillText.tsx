import { EditorReader } from "@lms/ui";
import SappDivider from "../base/divider/Divider";
import { runHighlight } from "@lms/utils";
import { uniqueId } from "lodash";
import {
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { SappTitleSolution } from "@lms/ui";
import { MY_COURSES } from "@lms/core";
import { IExhibitData } from "@lms/core";

interface IProps {
  data: any;
  action?: any;
  handleSaveHighLight?: any;
  highlighted?: any;
  removeHighlight?: any;
  allowHighLight?: boolean;
  defaultAnswer?: any;
  corrects?: {
    id: string;
    answer: string;
    is_correct: boolean;
    answer_position: number;
  }[];
  extenalRef?: any;
  solution?: string;
  allowUnHighLight?: boolean;
  setOpenFile?: (
    data: IExhibitData,
    file?: string | null,
    fileName?: string | null,
    event?: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => void;
  isHideExhibit?: boolean;
  exhibitText?: string;
  correctAnswerClass?: string;
  explainClassname?: string;
}
const AddWordPreview = forwardRef(
  (
    {
      data,
      action,
      handleSaveHighLight,
      highlighted,
      removeHighlight,
      allowHighLight,
      defaultAnswer,
      corrects,
      extenalRef,
      solution,
      allowUnHighLight,
      setOpenFile,
      isHideExhibit = true,
      exhibitText = "Exhibit",
      correctAnswerClass,
      explainClassname,
    }: IProps,
    ref: ForwardedRef<any>,
  ) => {
    const refEditor = useRef(null) as any;
    const [questionContent, setQuestionContent] = useState<any>();
    const [answerContent, setAnswerContent] = useState<any>();
    const str = data?.question_content;
    const parser = new DOMParser();
    const isSelfReflection = data?.is_self_reflection;
    const [key, setKey] = useState<string>(uniqueId("key"));
    useImperativeHandle(ref, () => ({
      handleReset() {
        // setAnswered([])
        setKey((prev) => {
          const newKey = uniqueId("key");
          return newKey;
        });
        // setAnswered()
      },
      handleGetResult() {
        // action()
      },
    }));

    useEffect(() => {
      const doc = parser?.parseFromString(str, "text/html");
      const elements = doc?.querySelectorAll(".question-content-tag");
      const doc2 = parser?.parseFromString(str, "text/html");
      const elementCorrects = doc2?.querySelectorAll(".question-content-tag");
      elements.forEach((element, index) => {
        const inputId = element?.id;
        const inputValue = defaultAnswer?.[index] || "";

        let inputClass;
        if (corrects) {
          const correctAnswer = corrects?.find(
            (ans: any) =>
              ans?.answer_position === index + 1 &&
              ans?.answer?.trim()?.toLowerCase() ===
                inputValue?.trim()?.toLowerCase(),
          );
          inputClass =
            correctAnswer || isSelfReflection === true
              ? "!border-[#397839] text-success-600 text-center !font-normal"
              : "!border-[#d35563] text-[#d35563] text center !font-normal";
        }

        element.outerHTML = `
        <span>
          <input ${
            corrects ? "disabled" : ""
          } type="text" id="${inputId}" class="sapp-input-preview ${inputClass}" stringHTML="true" value="${inputValue}" />
        </span>
      `;
      });
      if (corrects) {
        elementCorrects?.forEach((element, index) => {
          const inputId = element?.id;
          const inputValue = defaultAnswer?.[index] || "";

          let inputClass;
          // if (corrects) {
          const correctAnswer = corrects?.filter(
            (ans: any) => ans?.answer_position === index + 1,
          );
          if (correctAnswer) {
            inputClass = "text-success-600";
            // }
            element.outerHTML = `
                <span>
                <span id="${inputId}" class = "${inputClass}">${correctAnswer
                  ?.map((e, i) => {
                    if (i < correctAnswer.length - 1) {
                      return e?.answer + " / ";
                    } else return e?.answer;
                  })
                  .join("")} <span/>
                </span>
                `;
          }
        });
        setAnswerContent(doc2);
      } else {
        setAnswerContent(null);
      }

      setQuestionContent(doc);
    }, [defaultAnswer]);

    // const checkError = () => {
    //   const data = getValueFillText()

    //   const answerMap = Object.fromEntries(
    //     activeQuestion?.answers?.map((item) => [
    //       `${item.answer_position}:${item.answer?.trim()}`,
    //       item.is_correct,
    //     ]) || [],
    //   )

    //   const elements = data?.map(
    //     (element) => answerMap[`${1}:${element?.trim()}`] || false,
    //   )

    //   const corrects = questionRef?.current?.querySelectorAll(
    //     '.sapp-input-preview',
    //   )

    //   if (corrects) {
    //     corrects.forEach((element, index) => {
    //       const isCorrect = elements?.[index]
    //       if (element instanceof HTMLElement) {
    //         element.classList.add(isCorrect ? 'border-[#397839]' : 'border-[#B90E0A]')
    //       }
    //       element.classList.add('pointer-events-none')
    //     })
    //   }
    // }
    return (
      <div ref={extenalRef}>
        {data?.question_topic?.exhibits &&
          !isHideExhibit &&
          data?.question_topic?.exhibits?.length > 0 && (
            <>
              {!!data?.question_topic?.description && (
                <div className="my-6 border border-b-gray-300"></div>
              )}
              <div className="mb-4 flex items-center">
                <div className="font-semibold">
                  {exhibitText}s ({data?.question_topic?.exhibits?.length || 0})
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
                      {exhibitText} {i + 1}: {e?.name}
                    </div>
                  );
                })}
              </div>
              <div className="my-6 border border-b-gray-300"></div>
            </>
          )}
        <EditorReader
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
              }
            }
          }}
          key={key}
          extenalRef={refEditor}
          className="sapp-questions sapp-editor-reader"
          text_editor_content={
            questionContent?.documentElement?.querySelector("body")
              ?.innerHTML || ""
          }
          highlighted={highlighted}
        />
        {answerContent && (
          <div className={correctAnswerClass}>
            <SappDivider />
            <SappTitleSolution title={`${MY_COURSES.correctAnswer}:`} />
            <EditorReader
              className="questions mt-4"
              text_editor_content={
                answerContent?.documentElement?.querySelector("body")
                  ?.innerHTML || ""
              }
            />
          </div>
        )}
        {solution && (
          <div className={explainClassname}>
            <SappDivider />
            <SappTitleSolution title={`${MY_COURSES.explanations}:`} />
            <EditorReader className="mt-4" text_editor_content={solution} />
          </div>
        )}
      </div>
    );
  },
);
AddWordPreview.displayName = "AddWordPreview";
export default AddWordPreview;
