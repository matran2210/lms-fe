import { useFeature } from "@lms/contexts";
import { SappModalV3 } from "@lms/ui";
import { useState } from "react";
import { ClassSelectTable } from "./ClassSelectTable";

const ModalChoosingClass = ({
  open,
  onCancel,
}: {
  open: { courseId: string; open: boolean; courseName?: string };
  onCancel: () => void;
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
        {open.courseName || "this course"}
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
      open={open?.open}
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
            courseId={open.courseId}
            setSelectedClassId={setSelectedClassId}
            selectedClassId={selectedClassId}
          />
        </>
      }
      isMaskClosable={false}
    ></SappModalV3>
  );
};
export default ModalChoosingClass;
