import { SappModalV3 } from "@lms/ui";
import { ClassSelectTable } from "./ClassSelectTable";

const ModalChoosingClass = ({
  open,
  onCancel,
}: {
  open: boolean;
  onCancel: () => void;
}) => {
  const onSubmit = () => {};
  const instructionContent = (
    <p className="text-center text-base leading-relaxed text-gray-900 pb-6">
      Select the class you want to learn <br />
      <span className="font-semibold text-black">
        “FR (F7) Financial Reporting”
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
          <ClassSelectTable />
        </>
      }
      isMaskClosable={false}
    ></SappModalV3>
  );
};
export default ModalChoosingClass;
