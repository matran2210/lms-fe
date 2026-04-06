import { IAnswer } from "@lms/core";
import { useTailwindBreakpoint } from "@lms/hooks";
import clsx from "clsx";
import { useState } from "react";

const QuestionGrid = ({
  isMultipleChoice = false,
  isShowDivider = false,
  listQuestions = [],
  getActiveQuestion,
}: {
  isMultipleChoice?: boolean;
  isShowDivider?: boolean;
  listQuestions: IAnswer[];
  getActiveQuestion: (id: string) => void;
}) => {
  const [showAll, setShowAll] = useState(false);
  const { isLargeDesktopView } = useTailwindBreakpoint();
  const annotationsMultipleChoiceQuestions = [
    {
      text: "Correct",
      color: "#10B367",
    },
    {
      text: "Incorrect",
      color: "#F80903",
    },
  ];

  const annotationsConstructedQuestions = [
    {
      text: "Completed",
      color: "#22AAFF",
    },
    {
      text: "Not Completed",
      color: "#E68200",
    },
  ];

  const renderBoxesAndLineClass = (type: string, data: IAnswer) => {
    if (type === "Constructed Questions") {
      return data?.question?.qType === "ESSAY" && data?.active === "SUBMITED"
        ? " text-state-info border-info hover:bg-info-50"
        : " text-warning border-warning hover:bg-warning-50";
    }
    return data?.is_correct
      ? "text-success border-success hover:bg-success-50"
      : "text-state-error border-error hover:bg-error-50";
  };
  const renderAnnotations = (
    annotationsList: {
      text: string;
      color: string;
    }[],
  ) => {
    return (
      <div
        className={clsx("text-xs md:text-base", {
          "grid w-full grid-cols-2 gap-y-3": isLargeDesktopView,
          "mx-auto flex items-center justify-center gap-8 md:gap-12":
            showAll && !isLargeDesktopView,
          "grid grid-cols-4 gap-x-12 gap-y-3": !showAll && !isLargeDesktopView,
        })}
      >
        {annotationsList?.map((annotation) => (
          <div key={annotation.text} className="flex items-center gap-2">
            <div
              className="h-5 w-5 rounded-full"
              style={{ backgroundColor: annotation.color }}
            />
            <p className="text-sm">{annotation.text}</p>
          </div>
        ))}
      </div>
    );
  };

  const visibleQuestions = showAll ? listQuestions : listQuestions?.slice(0, 7);
  return (
    <>
      {isShowDivider && (
        <div
          style={{
            height: 1,
            backgroundColor: "#D1D5DB",
            margin: "32px 0",
          }}
        />
      )}

      {/* Header */}
      <div
        className="flex justify-between"
        style={{
          marginBottom: 24,
        }}
      >
        <span className="text-lg font-semibold">
          {isMultipleChoice
            ? "Multiple Choice Questions"
            : "Constructed Questions"}
        </span>
        {listQuestions?.length > 7 && (
          <span
            className="cursor-pointer text-base"
            style={{
              color: "#FFB700",
            }}
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "See less" : "Show more"}
          </span>
        )}
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 16,
          marginBottom: 32,
        }}
      >
        {visibleQuestions?.map((q: IAnswer, index: number) => {
          return (
            <button
              disabled={q?.active === "UN_SUBMITTED" || !q?.id}
              onClick={() => {
                getActiveQuestion(q?.id);
              }}
              key={q?.id}
              className={clsx(
                "h-[38px] w-[38px] text-sm border",
                renderBoxesAndLineClass(
                  isMultipleChoice
                    ? "Multiple Choice Questions"
                    : "Constructed Questions",
                  q,
                ),
              )}
              style={{
                padding: "8px",
                textAlign: "center",
                borderRadius: 4,
              }}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
      {/* Annotations */}
      {renderAnnotations(
        isMultipleChoice
          ? annotationsMultipleChoiceQuestions
          : annotationsConstructedQuestions,
      )}
    </>
  );
};

export default QuestionGrid;
