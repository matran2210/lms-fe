import { useFeature } from "@lms/contexts";
import { SappModalV3 } from "@lms/ui";
import { useState } from "react";
import { ClassSelectTable } from "./ClassSelectTable";

const ModalChoosingClass = ({
  open,
  onCancel,
  classes,
  isLoading,
  courseName
}: {
  courseName?: string
  open: boolean;
  onCancel: () => void;
  classes?: any;
  isLoading: boolean
}) => {
  const { router } = useFeature();
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const { courseActivationAPI } = useFeature();
  const onSubmit = async () => {
    if (selectedClassId) {
      const res = await courseActivationAPI.activateClass(selectedClassId);
      if (res?.success === true) {
        router.push("/courses");
      }
    }
  };
  const instructionContent = (
    <p className="text-center text-base leading-relaxed text-gray-900 pb-6">
      Select the class you want to learn <br />
      <span className="font-semibold text-black">
        {courseName || "this course"}
      </span>
      .
      <br />
      If you select an ongoing class, we will automatically revise your learning
      duration to ensure adequate time for course completion.
    </p>
  );

  return (
    <SappModalV3
      width={721}
      open={open}
      disabled={!selectedClassId}
      cancelButtonCaption="Cancel"
      okButtonCaption={"Confirm"}
      showCancelButton={false}
      handleCancel={onCancel}
      onOk={onSubmit}
      fullWidthBtn={true}
      buttonSize="medium"
      header={"Choosing Class"}
      content={
        <>
          {instructionContent}
          <ClassSelectTable
            setSelectedClassId={setSelectedClassId}
            selectedClassId={selectedClassId}
            classes={classes}
            isLoading={isLoading}
          />
        </>
      }
      isMaskClosable={false}
    ></SappModalV3>
  );
};
export default ModalChoosingClass;
