import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
} from 'react'
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
      confirmDialogOverLayRef.current.classList.add(
        'animate-fade-out-overlay-sidebar',
      )
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
              className={`fixed right-0 top-0 z-50 h-screen max-h-screen w-full animate-fade-in-sidebar overflow-y-auto bg-white transition-all duration-300 md:w-1/2 ${refClass}`}
              role="dialog"
              aria-modal="true"
            >
              {showHeader && (
                <div className="relative bg-[#050505] px-8 py-6">
                  <div className="pr-10 text-2xl font-medium text-white">
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
              className={`sapp-overlay fixed inset-0 z-40 animate-fade-in-overlay-sidebar cursor-pointer bg-[#000000CC] ${overlayClass}`}
            ></div>
          </>
        )}
      </React.Fragment>
    </>
  )
}

export default SappModelSidebar
