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
      showFooter
      fullWidthBtn
      buttonSize="medium"
      isUnderLine
    >
      <div className="justify-center self-stretch text-center">
        <span className="text-base font-normal leading-normal text-gray-800">
          It looks like you haven&apos;t finished the Foundation Course.
        </span>
      </div>
      <div className="justify-center self-stretch text-center">
        <span className="text-base font-normal leading-normal text-gray-800">
          Would you like to complete it first, or skip and start this course right
          away?
        </span>
      </div>
    </SappModalV3>
  );
};

export default ModalFoundationCompleted;
