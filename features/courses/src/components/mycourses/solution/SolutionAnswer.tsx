import React from "react";
import { Icon } from '@lms/assets'
interface SolutionAnswerProps {
  message: string;
  isYourAnswer: boolean;
  isCorrect: boolean;
}

const SolutionAnswer = ({
  message,
  isYourAnswer,
  isCorrect,
}: SolutionAnswerProps) => {
  const classParent = isYourAnswer
    ? isCorrect
      ? "text-success-600"
      : "text-error"
    : "text-gray-800";

  return (
    <>
      <div
        className={`mb-4 flex items-center gap-x-3 text-base ${classParent}`}
      >
        {isYourAnswer ? (
          <><Icon type="group-fill" className="h-[18px] w-[18px]" /></>
        ) : (
          <><Icon type="group-empty" className="h-[18px] w-[18px]" /></>
        )}
        <div className="w-fit">
          {message}
          {isYourAnswer && (
            <span className="ml-3 inline-block border bg-gray-100 px-2 py-0.5 text-xs text-gray-800">
              Your Answer
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default SolutionAnswer;
