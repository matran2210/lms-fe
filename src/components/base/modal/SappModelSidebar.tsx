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
import Icon from '@components/icons'

type Props = {
  open?: boolean
  setOpen?: Dispatch<SetStateAction<boolean>>
  children: ReactNode
  title?: string
  showHeader?: boolean
  refClass?: string
  childClass?: string
  overlayClass?: string
}

/**
 * Hàm này tạo một modal component bằng React
 * @param open: boolean - biến xác định modal có được mở hay không
 * @param setOpen: function - hàm xác định modal có được mở hay không
 * @param children: ReactNode - biến chứa các phần tử con của modal
 * @param showHeader: boolean - biến xác định modal có hiển thị tiêu đề hay không
 * @param title: string - biến xác định tiêu đề của modal
 */
function SappModelSidebar({
  open,
  setOpen,
  children,
  title,
  showHeader = true,
  refClass = '',
  childClass = '',
  overlayClass = '',
}: Props) {
  const confirmDialogRef = useRef<HTMLDivElement>(null)
  const confirmDialogOverLayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      const scrollBarWidth = window.innerWidth - document.body.clientWidth
      setTimeout(() => {
        document.body.style.paddingRight = scrollBarWidth + 'px'
        document.body.classList.add('overflow-hidden')
      })
    } else {
      const customModal = document.querySelectorAll(
        '.sapp-custom-modal:not(.sapp-custom-modal-inner)',
      )
      if (!customModal?.length) {
        document.body.style.removeProperty('padding-right')
        document.body.classList.remove('overflow-hidden')
      }
    }
  }, [open])

  const handleClose = () => {
    if (confirmDialogRef.current) {
      confirmDialogRef.current.classList.add('animate-fade-out-sidebar')
      confirmDialogRef.current.classList.add('pointer-events-none')
    }
    if (confirmDialogOverLayRef.current) {
      confirmDialogOverLayRef.current.classList.add('animate-fade-out-overlay')
      confirmDialogOverLayRef.current.classList.add('pointer-events-none')
    }
    setTimeout(() => {
      setOpen && setOpen(!open)
    }, 250)
  }

  return (
    <>
      <React.Fragment>
        {open && (
          <>
            <div
              ref={confirmDialogRef}
              className={`animate-fade-in-sidebar max-h-screen overflow-y-auto transition-all duration-300 fixed top-0 h-screen bg-white w-full md:w-1/2 z-50 right-0 ${refClass}`}
              role="dialog"
              aria-modal="true"
            >
              {showHeader && (
                <div className="bg-bw-2 px-8 py-6 relative">
                  <div className="text-2xl font-semibold text-white pr-10">
                    {title}
                  </div>
                  <div
                    className="absolute right-8 top-1/2 -translate-y-2/4 cursor-pointer"
                    onClick={handleClose}
                  >
                    <Icon type="cross" className="text-white" />
                  </div>
                </div>
              )}
              <div className={`px-8 py-6 ${childClass}`}>{children}</div>
            </div>
            <div
              ref={confirmDialogOverLayRef}
              onClick={handleClose}
              className={`sapp-overlay fixed inset-0 bg-overlay-dark-sidebar z-40 cursor-pointer animate-fade-in-overlay ${overlayClass}`}
            ></div>
          </>
        )}
      </React.Fragment>
    </>
  )
}

export default SappModelSidebar
