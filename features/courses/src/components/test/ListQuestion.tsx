import { MultipleQuestionsData } from "@lms/core";
import QuestionGrid from "./QuestionGrid";
import { isEmpty } from "lodash";

const ListQuestion = ({
  questions,
  getActiveQuestion,
}: {
  questions: MultipleQuestionsData;
  getActiveQuestion: (id: string) => void;
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
        />
      )}
      {!isEmpty(listConstructedQuestions) && (
        <QuestionGrid
          isShowDivider={!isEmpty(listMultipleChoiceQuestions)}
          listQuestions={listConstructedQuestions}
          getActiveQuestion={getActiveQuestion}
        />
      )}
    </div>
  );
};

export default ListQuestion;
