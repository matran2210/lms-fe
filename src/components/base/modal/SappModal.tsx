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
import ButtonCancelSubmit from '../button/ButtonCancelSubmit'
import Icon from '@components/icons'
import { IButtonColors } from 'src/type'

interface IProps {
  open?: boolean
  setOpen?: Dispatch<SetStateAction<boolean>>
  children: ReactNode

  cancelButtonCaption?: string | undefined
  okButtonCaption?: string | undefined

  handleCancel?: () => Promise<void> | void
  handleSubmit?: () => Promise<void> | void

  disabled?: boolean

  title?: string
  showHeader?: boolean
  customHeader?: ReactNode

  showFooter?: boolean
  customFooter?: ReactNode

  confirmOnclose?: boolean | string[]
  size?: string
  refClass?: string
  childClass?: string
  parentChildClass?: string
  footerButtonClassName?: string
  color?: IButtonColors
}
/**
 * Hàm này tạo một modal component bằng React
 * @param open: boolean - biến xác định modal có được mở hay không
 * @param setOpen: function - hàm xác định modal có được mở hay không
 * @param children: ReactNode - biến chứa các phần tử con của modal
 * @param cancelButtonCaption: string - biến xác định nội dung của nút hủy
 * @param okButtonCaption: string - biến xác định nội dung của nút xác nhận
 * @param handleCancel: function - hàm xử lý khi người dùng nhấn nút hủy
 * @param handleSubmit: function - hàm xử lý khi người dùng nhấn nút xác nhận
 * @param disabled: boolean - biến xác định modal có bị vô hiệu hóa hay không
 * @param title: string - biến xác định tiêu đề của modal
 * @param showTitle: boolean - biến xác định modal có hiển thị tiêu đề hay không
 * @param customTitle: ReactNode - biến chứa phần tử tùy chỉnh cho tiêu đề
 * @param showFooter: boolean - biến xác định modal có hiển thị footer hay không
 * @param customFooter: ReactNode - biến chứa phần tử tùy chỉnh cho footer
 * @param confirmOnclose: boolean - biến xác định modal có yêu cầu xác nhận khi đóng hay không
 * @param width: number - biến xác định modal width
 */
const SappModal: React.FC<IProps> = ({
  open,
  setOpen,
  children,
  cancelButtonCaption = 'Cancel',
  okButtonCaption = 'Submit',

  handleCancel,
  handleSubmit,

  disabled,

  title,
  showHeader = true,
  customHeader,

  showFooter = true,
  customFooter,

  confirmOnclose,
  size = 'max-w-lg',
  refClass = '',
  childClass = '',
  parentChildClass = '',
  footerButtonClassName = 'justify-center sm:justify-end flex',
  color,
}) => {
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState<boolean>(false)

  const confirmDialogRef = useRef<HTMLDivElement>(null)
  const confirmDialogOverLayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      const scrollBarWidth = window.innerWidth - document.body.clientWidth

      document.body.style.paddingRight = scrollBarWidth + 'px'
      document.body.classList.add('overflow-hidden')
    } else {
      const customModal = document.querySelectorAll('.sapp-custom-modal')
      if (!customModal?.length) {
        document.body.style.removeProperty('padding-right')
        document.body.classList.remove('overflow-hidden')
      }
    }
  }, [open])

  /**
   * Hàm này xử lý khi người dùng nhấn nút xác nhận
   * @return void
   */
  const onOk = async () => {
    // Nếu handleSubmit là một hàm bất đồng bộ, thì gọi hàm đó và đợi kết quả
    if (handleSubmit && handleSubmit.constructor.name === 'AsyncFunction') {
      setLoading(true)
      await handleSubmit()
      setLoading(false)
      handleClose()
      return
    }
    // Nếu handleSubmit là một hàm thường, thì gọi hàm đó
    else if (handleSubmit) {
      handleSubmit()
    }
    handleClose()
  }

  /**
   * Hàm này xử lý khi người dùng nhấn nút hủy
   * @return void
   */
  const onCancel = async () => {
    /**
     * Hàm này gọi hàm handleCancel theo loại hàm
     * @return void
     */
    const callHandleCancel = async () => {
      // Nếu handleCancel là một hàm bất đồng bộ, thì gọi hàm đó và đợi kết quả
      if (handleCancel && handleCancel.constructor.name === 'AsyncFunction') {
        setLoading(true)
        await handleCancel()
        setLoading(false)
        handleClose()
        return
      }
      // Nếu handleCancel là một hàm thường, thì gọi hàm đó
      else if (handleCancel) {
        handleCancel()
      }
    }
    // Nếu confirmOnclose là true, thì mở một hộp thoại xác nhận

    if (confirmOnclose) {
      dispatch(
        confirmDialog.open({
          // Nội dung của hộp thoại xác nhận
          message: 'Bạn có chắc chắn muốn hủy không?',
          // Hàm thực thi khi người dùng xác nhận hành động
          onConfirm: callHandleCancel,
        }),
      )
    } else {
      // Nếu confirmOnclose là false, thì không cần xác nhận
      // Gọi hàm callHandleCancel
      callHandleCancel()
      handleClose()
    }
  }

  const handleClose = () => {
    if (confirmDialogRef.current) {
      confirmDialogRef.current.classList.add('animate-jump-out')
    }
    if (confirmDialogOverLayRef.current) {
      confirmDialogOverLayRef.current.classList.add('animate-fade-out-overlay')
    }
    setTimeout(() => {
      setOpen && setOpen(false)
    }, 50)
  }

  return (
    <>
      <React.Fragment>
        {open && (
          // add an onClick handler to the outer div to close the popup when clicking outside
          <div
            className="sapp-custom-modal fixed z-[1000] w-full flex justify-center inset-0"
            role="dialog"
            aria-modal="true"
          >
            <div
              ref={confirmDialogOverLayRef}
              onClick={onCancel}
              className="animate-fade-in-overlay fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            ></div>
            <div
              className={`w-full ${size} min-h-full text-center sm:items-start`}
            >
              <div ref={confirmDialogRef} className={`${refClass}`}>
                {showHeader && (
                  <div className="bg-white md:pb-8 pb-5">
                    <div className="flex">
                      {customHeader || (
                        <div className="text-l font-bold text-bw-1">
                          {title}
                        </div>
                      )}
                      <div
                        onClick={onCancel}
                        className="ml-auto cursor-pointer text-bw-1 hover:text-primary translate-x-3"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}

                <div className={`${parentChildClass}`}>
                  <div className={`${childClass}`}>{children}</div>
                </div>

                {showFooter && (
                  <div className="md:pt-8 pt-5">
                    {customFooter || (
                      <ButtonCancelSubmit
                        className={footerButtonClassName}
                        color={color}
                        submit={{
                          title: okButtonCaption,
                          size: 'medium',
                          loading: loading,
                          disabled: disabled,
                          onClick: onOk,
                        }}
                        cancel={{
                          title: cancelButtonCaption,
                          size: 'medium',
                          onClick: onCancel,
                          loading: loading,
                        }}
                      ></ButtonCancelSubmit>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </React.Fragment>
    </>
  )
}

export default SappModal
