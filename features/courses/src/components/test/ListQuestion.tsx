import { MultipleQuestionsData } from "@lms/core";
import QuestionGrid from "./QuestionGrid";
import  isEmpty from "lodash/isEmpty";

const ListQuestion = ({
  questions,
  getActiveQuestion,
  handleCloseModal
}: {
  questions: MultipleQuestionsData;
  getActiveQuestion: (id: string) => void;
  handleCloseModal?: () => void
}) => {
  const listMultipleChoiceQuestions = questions?.selectedResponseAnswers || [];
  const listConstructedQuestions = questions?.constructedResponseAnswers || [];
  return (
    <div className="xl:p-6 xl:shadow-small xl:rounded-2xl">
      {!isEmpty(listMultipleChoiceQuestions) && (
        <QuestionGrid
          isMultipleChoice
          listQuestions={listMultipleChoiceQuestions}
          getActiveQuestion={getActiveQuestion}
          handleCloseModal={handleCloseModal}
        />
      )}
      {!isEmpty(listConstructedQuestions) && (
        <QuestionGrid
          isShowDivider={!isEmpty(listMultipleChoiceQuestions)}
          listQuestions={listConstructedQuestions}
          getActiveQuestion={getActiveQuestion}
          handleCloseModal={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ListQuestion;
