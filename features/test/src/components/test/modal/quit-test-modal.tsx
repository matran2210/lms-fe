import { QuitIcon } from "@lms/assets";
import { SappModalV3 } from "@lms/ui";
import { trackGAEvent } from "@lms/utils";
import { Dispatch, SetStateAction } from "react";

interface IProps {
  open: boolean;
  content: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
  handleQuit: () => void;
  handleCancel: () => void;
  [key: string]: any;
}

const QuitTestModal = ({
  open,
  content,
  setOpen,
  handleQuit,
  handleCancel,
  ...props
}: IProps) => {
  const onSubmit = () => {
    setOpen(false);
    handleQuit();
    trackGAEvent("Click Button Quit Modal Test");
  };

  const onCancel = () => {
    handleCancel();
    setOpen(false);
    trackGAEvent("Click Button Cancel Modal Test");
  };

  return (
    <SappModalV3
      open={open}
      handleClose={() => setOpen(false)}
      cancelButtonCaption="Quit Anyway"
      okButtonCaption="Cancel"
      handleCancel={onSubmit}
      onOk={onCancel}
      fullWidthBtn={true}
      buttonSize="medium"
      icon={<QuitIcon />}
      header="Are you sure ?"
      content={content}
      cancelButtonClass="underline !p-0 !w-fit hover:text-primary"
      {...props}
    />
  );
};

export default QuitTestModal;
