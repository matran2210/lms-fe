import { ConfirmIcon } from "@lms/assets";
import { BackIcon } from "@lms/assets";
import {
  ButtonPrimary,
  ButtonText,
  SappButtonIcon,
  SappModalV2,
} from "@lms/ui";
import { trackGAEvent } from "@lms/utils";

interface IProps {
  open: boolean;
  setOpen: any;
  handleSubmit: any;
  handleCancel: any;
  message?: string;
  title?: string | undefined;
  okButtonCaption?: string | undefined;
  isTest?: boolean;
}
const ConFirmSubmit = ({
  open,
  setOpen,
  handleSubmit,
  handleCancel,
  message,
  title = "Confirm Submission",
  okButtonCaption = "Submit",
  isTest = true,
}: IProps) => {
  const onSubmit = () => {
    handleSubmit();
    trackGAEvent("Click Button Submit Modal Confirm Quiz Activity");
  };
  const onCancel = () => {
    handleCancel();
    setOpen(false);
    trackGAEvent("Click Button Cancel Modal Confirm Quiz Activity");
  };
  const onClose = () => {
    setOpen(false);
  };
  return (
    <SappModalV2
      open={open}
      //   cancelButtonCaption="Quit"
      okButtonCaption="Submit"
      okButtonClass="!text-base"
      cancelButtonClass="!text-base"
      handleCancel={onCancel}
      onOk={onSubmit}
      title={""}
      showFooter={false}
    >
      <div className="mx-auto flex w-max items-center justify-center rounded-full">
        <ConfirmIcon className="h-12 w-12 md:h-[88px] md:w-[88px]" />
      </div>
      <div className="flex justify-center pb-4 pt-6 text-2xl font-semibold text-gray-800 md:pb-8 md:pt-10 md:text-3xl">
        {title}
      </div>
      <div className="text-center text-sm font-normal text-gray-800 md:text-base">
        {message ??
          "Are you sure you are done here and ready to view the report?"}
      </div>
      <div className="relative pt-6 md:pt-10">
        <div className="flex flex-col gap-3">
          <ButtonPrimary
            title={okButtonCaption}
            size="medium"
            className="h-[50px] w-full"
            onClick={onSubmit}
          />
          {isTest ? (
            <SappButtonIcon
              onClick={onCancel}
              ishover={false}
              className="flex w-full gap-2 border-none !p-0 text-gray-800 underline hover:text-primary"
            >
              <BackIcon />
              <div className="text-base font-semibold">Back to My Course</div>
            </SappButtonIcon>
          ) : (
            <ButtonText title="Cancel" className="w-full" onClick={onCancel} />
          )}
        </div>
      </div>
    </SappModalV2>
  );
};

export default ConFirmSubmit;
