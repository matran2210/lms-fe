import QuestionGrid from "./QuestionGrid";
import { isEmpty } from "lodash";

const ListQuestion = ({ questions, getActiveQuestion }: { questions: any; getActiveQuestion: (id: string) => void }) => {
  const listMultipleChoiceQuestions = questions?.selectedResponseAnswers || [];
  const listConstructedQuestions = questions?.constructedResponseAnswers || [];
  return (
    <div
      className="p-6"
      style={{
        boxShadow: "0 4px 20px 0 rgba(41, 41, 41, 0.05)",
        borderRadius: "16px",
      }}
    >
      {!isEmpty(listMultipleChoiceQuestions) && (
        <QuestionGrid isMultipleChoice listQuestions={listMultipleChoiceQuestions} getActiveQuestion={getActiveQuestion}/>
      )}
      {!isEmpty(listConstructedQuestions) && (
        <QuestionGrid isShowDivider={!isEmpty(listMultipleChoiceQuestions)}  listQuestions={listConstructedQuestions} getActiveQuestion={getActiveQuestion}/>
      )}
    </div>
  );
};

export default ListQuestion;
