import { AlertIcon } from "@lms/assets";
import { SappModalV2 } from "@lms/ui";
import { Dispatch, SetStateAction } from "react";

interface IProps {
  open: boolean;
  onCancel: () => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
const PopupCanNotRetakeTest = ({ open, onCancel, setOpen }: IProps) => {
  const onOk = () => {
    onCancel();
    setOpen(false);
  };
  return (
    <SappModalV2
      open={open}
      okButtonCaption="Back"
      onOk={onOk}
      handleCancel={() => setOpen(false)}
      showHeader={false}
      footerButtonClassName="flex flex-col-reverse gap-8"
      parentChildClass=""
      position="center"
      fullWidthBtn={true}
      closeAfterSubmit={true}
      buttonSize="medium"
      confirmOnclose={false}
      title={undefined}
      showCancelButton={false}
    >
      <div className="mx-auto mb-6 flex w-max items-center justify-center rounded-full bg-secondary p-8">
        <AlertIcon />
      </div>
      <div className="flex justify-center text-2xl font-semibold text-[#050505] md:text-4xl">
        No Retake
      </div>
      <div className="mb-1 mt-4 text-center text-sm text-[#A1A1A1] 2xl:mb-11">
        You cannot retake the test because you have already passed this course.
        Congratulations!
      </div>
    </SappModalV2>
  );
};

export default PopupCanNotRetakeTest;
