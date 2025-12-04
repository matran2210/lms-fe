import { CloseIcon } from '@lms/assets'
import { Calculator, ModalResizeable } from '@lms/ui'
import clsx from 'clsx'

interface IProps {
  onClose: () => void
  isMobileCalc?: boolean
  onClick?: () => void
}

const CalculatorModal = ({ onClose, isMobileCalc = false, onClick }: IProps) => {
  return (
    <ModalResizeable
      bodyClassName="h-[calc(100%-6px)]"
      handleCloseScratchPad={onClose}
      position="center"
      isInBody
      header={
        <div className="modal-dragger modal-header cursor-move overflow-hidden">
          <div
            className="flex h-10 w-full items-center justify-between rounded-t-md bg-[#DCDDDD] px-5"
            style={{
              boxShadow: '0 0 10px rgba(0,0,0,0.1)',
            }}
          >
            <div className="text-sm font-bold">Calculator</div>
            <button
              onClick={onClose}
              onTouchEnd={onClose}
            >
              <CloseIcon />
            </button>
          </div>
        </div>
      }
      height={isMobileCalc ? 518 : 634}
      width={isMobileCalc ? 256 : 344}
      className={clsx({
        "!max-h-[634px] !w-[344px]": !isMobileCalc,
        "!max-h-[518px] !w-64": isMobileCalc,
      })}
      onClick={onClick}
    >
      <div className="relative h-full overflow-hidden">
        <Calculator isMobileCalc={isMobileCalc} />
      </div>
    </ModalResizeable>
  )
}

export default CalculatorModal
