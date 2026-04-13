import { CloseIcon } from "@lms/assets";
import { Modal } from "antd";
import { useTailwindBreakpoint } from "@lms/hooks";
import { MultipleQuestionsData } from "@lms/core";
import { Dispatch, SetStateAction } from "react";
import ListQuestion from "./ListQuestion";
import { SappModal } from "@lms/ui";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  questions: MultipleQuestionsData;
  getActiveQuestion: (id: string) => void;
}

const ModalListQuestion = ({
  questions,
  isOpen,
  getActiveQuestion,
  setIsOpen,
}: IProps) => {
  const { isMobileView } = useTailwindBreakpoint();
  return (
    <SappModal
      open={isOpen}
      handleCancel={() => setIsOpen(false)}
      position="center"
      showFooter={false}
      refClass="w-[554px] md:p-6 flex flex-col animate-jump-in relative transform overflow-hidden bg-white text-left shadow-xl transition-all z-[100000]"
      showHeader={false}
      size=""
    >
      <ListQuestion
        questions={questions}
        getActiveQuestion={getActiveQuestion}
      />
    </SappModal>
  );
};

export default ModalListQuestion;
