import { CloseIcon } from "@lms/assets";
import { useTailwindBreakpoint } from "@lms/hooks";
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
  const { isShortScreen } = useTailwindBreakpoint();
  return (
    <>
      <ModalResizeable
        bodyClassName="h-[calc(100%-6px)]"
        handleCloseScratchPad={onClose}
        position="center"
        isInBody
        // draggableFull
        height={isShortScreen || isMobileCalc ? 518 : 634}
        width={isMobileCalc || isShortScreen ? 256 : 344}
        className={clsx({
          "!max-h-[634px] !w-[344px]": !isMobileCalc && !isShortScreen,
          "!max-h-[518px] !w-64": isMobileCalc || isShortScreen,
        })}
        onClick={onClick}
      >
        {(
          { requestClose }, // Dùng requestClose để close modal đúng cách để giữ animation khi đóng
        ) => (
          <div className="flex h-full flex-col p-4">
            <div className="absolute inset-0 flex h-full flex-col">
              <div
                className="modal-header modal-dragger cursor-move flex h-10 w-full items-center justify-between rounded-t-md bg-[#DCDDDD] px-5 sticky top-0 z-10"
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
              <div className="overflow-x-auto hide-scrollbar flex-1">
              <Calculator
                isMobileCalc={isMobileCalc}
                isShortScreen={isShortScreen}
              />
            </div>
            </div>
          </div>
        )}
      </ModalResizeable>
    </>
  );
};

export default CalculatorModal;
