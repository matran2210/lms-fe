import { useAppDispatch } from 'src/redux/hook'
import ButtonPrimary from './button/ButtonPrimary'
import ButtonText from './button/ButtonText'
import confirmDialog from 'src/redux/slice/ConfirmDialog/ConfirmDialogThunk'
import { ReactNode } from 'react'
import cross from '@assets/images/cross.svg'
import Image from 'next/image'

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
    if (isOpen && e?.target?.closest('.custom-drawer') === null) {
      handleOnClose()
    }
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-bw-5 bg-opacity-50 z-40"
          onClick={handleMaskClick}
        ></div>
      )}
      <div
        className={`fixed top-0 right-0 h-full bg-white transform z-50 ${
          widthDrawer ?? 'w-screen lg:w-[960px]'
        } ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out overflow-y-auto h-screen`}
      >
        <div className="flex flex-col h-screenl justify-between">
          <div className="w-100 justify-between bg-bw-2 h-[80px] text-2xl font-semibold items-center flex px-8 text-white">
            {title}
            <Image
              src={cross}
              alt="SAPP Logo"
              onClick={handleMaskClick}
              className="cursor-pointer"
            />
          </div>
        </div>
        <div
          className="mt-6 ml-8 mr-3 overflow-y-auto h-[80vh]"
          id={`sapp-drawer${drawerSubId}`}
        >
          {children}
        </div>
        {footer && (
          <div className="flex justify-between h-[82px] items-center border-t border-default">
            <ButtonText
              title="Cancel"
              className="ms-[4px]"
              onClick={handleMaskClick}
              size="lager"
            />
            {showSubmitButton && (
              <ButtonPrimary
                title={btnSubmitTile}
                className="me-[32px]"
                onClick={handleSubmit}
                size="lager"
              />
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default SappDrawer
