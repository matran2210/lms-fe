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
import { CloseIcon } from '@assets/icons'

interface IProps {
  open?: boolean
  setOpen?: Dispatch<SetStateAction<boolean>>
  children: ReactNode

  cancelButtonCaption?: string
  okButtonCaption?: string
  okButtonClass?: string | undefined
  cancelButtonClass?: string | undefined
  buttonSize?: 'small' | 'medium' | 'lager' | 'extra'

  handleCancel?: () => Promise<void> | void
  handleSubmit?: () => Promise<void> | void

  disabled?: boolean

  title?: string
  customTitle?: ReactNode
  showHeader?: boolean
  customHeader?: ReactNode

  showFooter?: boolean
  customFooter?: ReactNode

  confirmOnclose?: boolean | string[]
  size?: string
  modelClassname?: string
  refClass?: string
  childClass?: string
  parentChildClass?: string
  footerButtonClassName?: string
  overlayClass?: string
  color?: IButtonColors
  colorCancel?: IButtonColors
  position?: 'center' | 'start' | 'end'
  fullWidthBtn?: boolean

  isFullScreen?: boolean
  isContentFull?: boolean
  isInner?: boolean
  isBordered?: boolean
  closeAfterSubmit?: boolean
  showOkButton?: boolean
  showCancelButton?: boolean
  zIndex?: string
  scrollbale?: boolean
  footerClassName?: string
  externalLoading?: boolean

  revertFunction?: boolean
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
  children,
  cancelButtonCaption = 'Cancel',
  okButtonCaption = 'Submit',
  okButtonClass,
  cancelButtonClass,
  buttonSize = 'medium',

  handleCancel,
  handleSubmit,

  disabled,

  title,
  customTitle,
  showHeader = true,
  customHeader,

  showFooter = true,
  customFooter,

  confirmOnclose,
  size = 'max-w-lg',
  modelClassname = '',
  refClass = 'md:px-6 px-5 py-5 flex flex-col animate-jump-in relative transform overflow-hidden bg-white text-left shadow-xl transition-all',
  childClass = '',
  parentChildClass = '',
  footerButtonClassName = 'justify-center sm:justify-end flex gap-3',
  overlayClass = '',
  color,
  colorCancel = 'text',
  position = 'start',
  fullWidthBtn = false,

  isFullScreen = false,
  isContentFull = true,
  isInner = false,
  isBordered = false,
  closeAfterSubmit = true,
  showOkButton = true,
  showCancelButton = true,
  zIndex = 'z-[9999]',
  scrollbale = true,
  footerClassName,
  externalLoading,
  revertFunction = false,
}) => {
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState<boolean>(false)

  const confirmDialogRef = useRef<HTMLDivElement>(null)
  const confirmDialogOverLayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isInner) {
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
    }
  }, [open])

  /**
   * Hàm này xử lý khi người dùng nhấn nút xác nhận
   * @return void
   */
  const onOk = async () => {
    if (handleSubmit) {
    }

    // Nếu handleSubmit là một hàm bất đồng bộ, thì gọi hàm đó và đợi kết quả
    if (handleSubmit && handleSubmit.constructor.name === 'AsyncFunction') {
      setLoading(true)
      try {
        await handleSubmit()
      } catch (err) {
      } finally {
        setLoading(false)
      }
      if (closeAfterSubmit) {
        handleClose()
      }

      return
    }
    // Nếu handleSubmit là một hàm thường, thì gọi hàm đó
    else if (handleSubmit) {
      handleSubmit()
    }
    if (closeAfterSubmit) {
      handleClose()
    }
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
        handleClose()
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
    }
  }

  const handleClose = () => {
    if (confirmDialogRef.current) {
      confirmDialogRef.current.classList.add('animate-jump-out')
      confirmDialogRef.current.classList.add('pointer-events-none')
    }
    if (confirmDialogOverLayRef.current) {
      confirmDialogOverLayRef.current.classList.add('animate-fade-out-overlay')
      confirmDialogOverLayRef.current.classList.add('pointer-events-none')
    }
    setTimeout(() => {
      handleCancel && handleCancel()
    }, 50)
  }

  return (
    <>
      <React.Fragment>
        {open && (
          // add an onClick handler to the outer div to close the popup when clicking outside
          <div
            className={`sapp-custom-modal ${
              isInner
                ? 'max-h-full absolute sapp-custom-modal-inner'
                : `max-h-screen fixed`
            } w-full flex justify-center inset-0 items-center ${zIndex} ${modelClassname}`}
            role="dialog"
            aria-modal="true"
          >
            <div
              ref={confirmDialogOverLayRef}
              onClick={() => {
                if (externalLoading !== undefined) {
                  if (externalLoading) {
                    return
                  }
                }
                if (loading) {
                  return
                }
                onCancel()
              }}
              className={`${
                isInner ? 'absolute' : 'fixed'
              } animate-fade-in-overlay  inset-0 bg-black opacity-80 transition-opacity ${overlayClass}`}
            ></div>
            <div
              className={`${
                isFullScreen || `${size} p-4 xl:py-10`
              }  w-full text-center h-full flex justify-center inset-0 items-${position}`}
            >
              <div
                ref={confirmDialogRef}
                className={`w-fit max-h-full max-w-full 
                ${isContentFull ? 'w-full' : 'w-fit'}
                ${refClass}`}
              >
                {showHeader &&
                  (customHeader || (
                    <div className="bg-white md:pb-5 pb-5 relative">
                      <div className="flex">
                        {customTitle || (
                          <div className="text-xl font-bold text-bw-1">
                            {title}
                          </div>
                        )}
                        <div
                          className="ml-auto cursor-pointer"
                          onClick={onCancel}
                        >
                          <CloseIcon className="transition-all stroke-bw-1 ease-in-out duration-300 transform group-hover:stroke-primary" />
                        </div>
                      </div>
                      {isBordered && (
                        <div className="absolute inset-0 border-b border-gray-2 bottom-0 -mx-6"></div>
                      )}
                    </div>
                  ))}

                <div
                  className={`${parentChildClass} ${
                    scrollbale &&
                    'snap-y flex-1 overflow-y-scroll bg-white -mr-4.5'
                  }`}
                >
                  <div className={`${childClass}`}>{children}</div>
                </div>

                {showFooter && (
                  <div className={`md:pt-5 pt-5 relative ${footerClassName}`}>
                    {isBordered && (
                      <div className="absolute left-0 right-0 border-b border-gray-2 top-0 -mx-6"></div>
                    )}
                    {customFooter || (
                      <ButtonCancelSubmit
                        revertFunction={revertFunction}
                        className={footerButtonClassName}
                        color={color}
                        colorCancel={colorCancel}
                        showOkButton={showOkButton}
                        showCancelButton={showCancelButton}
                        submit={{
                          title: okButtonCaption,
                          size: buttonSize,
                          loading:
                            externalLoading != undefined
                              ? externalLoading
                              : loading,
                          disabled: disabled,
                          onClick: onOk,
                          full: fullWidthBtn,
                          className: okButtonClass,
                        }}
                        cancel={{
                          title: cancelButtonCaption,
                          size: buttonSize,
                          onClick: onCancel,
                          loading:
                            externalLoading != undefined
                              ? externalLoading
                              : loading,
                          full: fullWidthBtn,
                          className: cancelButtonClass,
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
