import { CloseIcon } from "@lms/assets";
import { Calculator, ModalResizeable } from "@lms/ui";
import clsx from "clsx";

interface IProps {
  onClose: () => void;
  isMobileCalc?: boolean;
  onClick?: () => void;
}

const CalculatorModal = ({
  onClose,
  isMobileCalc = false,
  onClick,
}: IProps) => {
  return (
    <>
      <ModalResizeable
        bodyClassName="h-[calc(100%-6px)]"
        handleCloseScratchPad={onClose}
        position="center"
        isInBody
        // draggableFull
        height={isMobileCalc ? 518 : 634}
        width={isMobileCalc ? 256 : 344}
        className={clsx({
          "!max-h-[634px] !w-[344px]": !isMobileCalc,
          "!max-h-[518px] !w-64": isMobileCalc,
        })}
        onClick={onClick}
      >
        {(
          { requestClose }, // Dùng requestClose để close modal đúng cách để giữ animation khi đóng
        ) => (
          <div className="flex h-full flex-col p-4">
            <div className="absolute inset-0">
              <div
                className="modal-header modal-dragger cursor-move flex h-10 w-full items-center justify-between rounded-t-md bg-[#DCDDDD] px-5"
                style={{
                  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                }}
              >
                <div className="text-sm font-bold">Calculator</div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    requestClose();
                  }}
                  onTouchEnd={(e) => {
                    e.stopPropagation();
                    requestClose();
                  }}
                >
                  <CloseIcon />
                </button>
              </div>
              <Calculator isMobileCalc={isMobileCalc} />
            </div>
          </div>
        )}
      </ModalResizeable>
    </>
  );
};

export default CalculatorModal;
