import { useAppDispatch } from 'src/redux/hook'
import ButtonPrimary from './button/ButtonPrimary'
import ButtonText from './button/ButtonText'
import confirmDialog from 'src/redux/slice/ConfirmDialog/ConfirmDialogThunk'
import { ReactNode, useEffect, useRef, useState } from 'react'
import cross from '@assets/images/cross.svg'
import Image from 'next/image'
import ButtonSecondary from './button/ButtonSecondary'
import { CloseIcon } from '@assets/icons'

interface IProps {
  children: ReactNode
  isOpen: boolean
  onClose: () => void
  title: string | undefined
  message: string
  footer?: boolean
  widthDrawer?: string
  btnSubmitTile?: string
  handleSubmit?: any
  drawerSubId?: string
  confirmOnClose?: boolean
  showSubmitButton?: boolean
  heightBody?: string
  sizeTextBtn?: 'small' | 'medium' | 'lager' | 'extra'
  handleCancel?: any
  onClickOutside?: () => void
  showCancelButton?: boolean
  btnCancelTitle?: string
}

const SappDrawer = ({
  children,
  isOpen,
  onClose,
  title,
  message,
  footer = true,
  widthDrawer,
  btnSubmitTile = 'Next Lesson',
  handleSubmit = () => {},
  drawerSubId = '',
  confirmOnClose = true,
  showSubmitButton = true,
  heightBody = 'h-[calc(100vh-80px)]',
  sizeTextBtn = 'lager',
  handleCancel,
  onClickOutside,
  showCancelButton = true,
  btnCancelTitle = 'Cancel',
}: IProps) => {
  const dispatch = useAppDispatch()

  const handleOnClose = () => {
    if (confirmOnClose) {
      dispatch(confirmDialog.open({ message: message, onConfirm: onClose }))
    } else {
      onClose()
    }
  }

  const handleMaskClick = (e: any) => {
    if (
      isOpen &&
      e?.target?.closest('.custom-drawer') === null &&
      !handleCancel
    ) {
      handleOnClose()
    } else {
      handleCancel()
    }
  }
  const drawerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const drawerElement = drawerRef.current
    if (drawerElement) {
      const hasScrollBar =
        drawerElement.scrollHeight > drawerElement.clientHeight
      drawerElement.classList.toggle('px-8', !hasScrollBar)
      drawerElement.classList.toggle('pl-8', hasScrollBar)
      drawerElement.classList.toggle('pr-6', hasScrollBar)
    }
  }, [drawerSubId, heightBody, drawerRef, children])

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-y-hidden')
    } else {
      document.body.classList.remove('overflow-y-hidden')
    }
  }, [isOpen])

  return (
    <>
      {isOpen && (
        <div
          className="fixed left-0 top-0 z-[30] h-full w-full bg-bw-5 bg-opacity-50"
          onClick={handleMaskClick}
        ></div>
      )}
      <div
        className={`fixed right-0 top-0 z-[30] h-full transform bg-white ${
          widthDrawer ?? 'w-screen lg:w-1/2'
        } ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } h-screen transition-transform duration-300
        ease-in-out`}
      >
        <div className="flex flex-col justify-between">
          <div className="w-100 relative flex min-h-[80px] items-center justify-between border-b bg-transparent px-8 py-2 text-2xl font-medium text-white">
            <span className="line-clamp-3 pr-4 text-heading ">{title}</span>
            <div
              className="shrink-0 cursor-pointer"
              onClick={() => handleOnClose()}
            >
              <CloseIcon />
            </div>
          </div>
        </div>
        <div
          ref={drawerRef}
          className={`mt-6 overflow-y-auto px-8 ${heightBody}`}
          id={`sapp-drawer${drawerSubId}`}
        >
          <div className="">{children}</div>
        </div>
        {footer && (
          <div className="absolute bottom-0 left-0 right-0 flex h-[66px] w-full items-center justify-end border-t border-default bg-white">
            {showCancelButton && (
              <ButtonSecondary
                title={btnCancelTitle}
                className="me-[32px] rounded-md"
                onClick={handleMaskClick}
                size={sizeTextBtn}
              />
            )}
            {showSubmitButton && (
              <ButtonPrimary
                title={btnSubmitTile}
                className="me-[32px] rounded-md"
                childClass="px-7"
                onClick={handleSubmit}
                size={sizeTextBtn}
              />
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default SappDrawer
