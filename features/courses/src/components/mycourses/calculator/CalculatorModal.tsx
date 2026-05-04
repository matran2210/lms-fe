import { CloseIcon } from "@lms/assets";
import { useTailwindBreakpoint } from "@lms/hooks";
import { Calculator, ModalResizeableNew } from "@lms/ui";
import { useState, useCallback } from "react";

interface IProps {
  onClose: () => void;
  isMobileCalc?: boolean;
  onClick?: () => void;
  modalIndex?: number;
  isTopModal?: boolean;
  isInBody?: boolean;
}

const CalculatorModal = ({
  onClose,
  isMobileCalc = false,
  onClick,
  modalIndex = 0,
  isTopModal,
  isInBody = false,
}: IProps) => {
  const { isShortScreen } = useTailwindBreakpoint();
  const [modalSize, setModalSize] = useState({
    width: isMobileCalc || isShortScreen ? 256 : 344,
    height: isShortScreen || isMobileCalc ? 500 : 600,
  });

  const handleResizeStop = useCallback((size: { width: number; height: number }) => {
    setModalSize(size);
  }, []);

  return (
    <ModalResizeableNew
      bodyClassName="h-[calc(100%-6px)]"
      contentClassName="!overflow-hidden"
      onClose={onClose}
      position="center"
      height={modalSize.height}
      width={modalSize.width}
      minWidth={256}
      minHeight={450}
      maxWidth={330}
      maxHeight={580}
      modalIndex={modalIndex}
      isTopModal={isTopModal}
      isInBody={isInBody}
      onModalFocus={onClick}
      onResizeStopDone={handleResizeStop}
      header={({ requestClose }) => (
        <div
          className="modal-header modal-dragger flex h-10 w-full cursor-move items-center justify-between rounded-t-md bg-divider px-5"
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
      )}
    >
      <Calculator isMobileCalc={isMobileCalc} isShortScreen={isShortScreen} />
    </ModalResizeableNew>
  );
};

export default CalculatorModal;
