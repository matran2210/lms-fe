import { SadFaceIcon } from "@lms/assets/icons";
import { SappModalV3 } from "@lms/ui";

const NoAvailableClasses = ({
  open,
  onCancel,
}: {
  open: boolean;
  onCancel: () => void;
}) => {
  return (
    <SappModalV3
      handleClose={onCancel}
      width={721}
      open={open}
      showOkButton={false}
      onOk={() => {}}
      showCancelButton={false}
      handleCancel={onCancel}
      fullWidthBtn={true}
      buttonSize="medium"
      icon={<SadFaceIcon />}
      isMaskClosable={false}
      showFooter={false}
      className="!max-w-[560px]"
    >
      <div className="font-bold text-3xl">Oops! No available Classes</div>
    </SappModalV3>
  );
};
export default NoAvailableClasses;
