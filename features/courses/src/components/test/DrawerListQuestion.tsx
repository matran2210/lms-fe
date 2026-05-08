import { SappDrawerV3 } from "@lms/ui";
import ListQuestion from "./ListQuestion";
import { MultipleQuestionsData } from "@lms/core";
import { Dispatch, SetStateAction } from "react";

const DrawerListQuestion = ({
  questions,
  isOpen,
  getActiveQuestion,
  setIsOpen,
}: {
  questions: MultipleQuestionsData;
  isOpen: boolean;
  getActiveQuestion: (id: string) => void;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {

  const handleCloseModal = () => setIsOpen(false)

  return (
    <SappDrawerV3
      open={isOpen}
      handleCancel={() => setIsOpen(false)}
      title={""}
      isShowHeader={false}
      isShowBtnClose={false}
      closable={false}
      isShowBtnBack={false}
      isShowFooter={false}
      width={"100%"}
      rootClassName={"drawer-list-question"}
    >
      <ListQuestion
        questions={questions}
        getActiveQuestion={getActiveQuestion}
        handleCloseModal={handleCloseModal}
      />
    </SappDrawerV3>
  );
};

export default DrawerListQuestion;
