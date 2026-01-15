import { ActiveIcon } from "@lms/assets";
import { SappModalV3 } from "@lms/ui";
import React from "react";

interface IModalFoundationCompletedProps {
  openContinue: boolean;
  handleSkipCourse: () => void;
  handleContinueFoundation: () => void;
  handleClose: () => void;
}

const ModalFoundationCompleted = ({
  openContinue,
  handleContinueFoundation,
  handleSkipCourse,
  handleClose,
}: IModalFoundationCompletedProps) => {
  return (
    <SappModalV3
      open={openContinue}
      handleCancel={handleSkipCourse}
      handleClose={handleClose}
      onOk={handleContinueFoundation}
      icon={<ActiveIcon />}
      header="Foundation Not Completed"
      okButtonCaption="Continue with Foundation Course"
      cancelButtonCaption="Skip and start this course"
      isMaskClosable={true}
      fullWidthBtn={true}
      buttonSize="extra"
      isClosable
    >
      <div className="mt-4 text-center text-sm text-[#A1A1A1]">
        It looks like you haven&apos;t finished the Foundation Course.
      </div>
      <div className="mt-1 text-center text-sm text-[#A1A1A1]">
        Would you like to complete it first, or skip and start this course right
        away?
      </div>
    </SappModalV3>
  );
};

export default ModalFoundationCompleted;
