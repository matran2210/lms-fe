import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useAppDispatch } from 'src/redux/hook'
import confirmDialog from 'src/redux/slice/ConfirmDialog/ConfirmDialogThunk'
import { IButtonColors } from 'src/type'
import ButtonCancelSubmit from '../button/ButtonCancelSubmit'

type Props = {
  open?: boolean
  setOpen?: Dispatch<SetStateAction<boolean>>
  children: ReactNode
}

/**
 * Hàm này tạo một modal component bằng React
 * @param open: boolean - biến xác định modal có được mở hay không
 * @param setOpen: function - hàm xác định modal có được mở hay không
 * @param children: ReactNode - biến chứa các phần tử con của modal
 */
function SappModelSidebar({ open, setOpen, children }: Props) {
  return (
    <>
      <React.Fragment>
        {open && (
          <div
            className={`sapp-custom-modal max-h-screen fixed  h-screen bg-white w-[500px] top-0 right-0 items-center z-50`}
            role="dialog"
            aria-modal="true"
          >
            <div>{children}</div>
          </div>
        )}
      </React.Fragment>
    </>
  )
}

export default SappModelSidebar
