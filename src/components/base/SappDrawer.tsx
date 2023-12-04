import { useAppDispatch } from "src/redux/hook";
import ButtonPrimary from "./button/ButtonPrimary";
import ButtonText from "./button/ButtonText";
import confirmDialog from "src/redux/slice/ConfirmDialog/ConfirmDialogThunk";
import { ReactNode } from "react";
import cross from '@assets/images/cross.svg'
import Image from "next/image";

interface IProps{
  children: ReactNode
  isOpen: boolean
  onClose: () => void
  title: string | undefined
  message: string
}

const SappDrawer = ({ children, isOpen, onClose, title, message }: IProps) => {
  const dispatch = useAppDispatch()

  const handleOnClose = () => {
    dispatch(confirmDialog.open({ message: message, onConfirm: onClose }))
  }

  const handleMaskClick = (e: any) => {
    if (isOpen && e?.target?.closest('.custom-drawer') === null) {
      handleOnClose()
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50"
          onClick={handleMaskClick}
        ></div>
      )}
      <div
        className={`fixed top-0 right-0 w-6/12 h-full bg-white transform ${isOpen ? 'translate-x-0' : 'translate-x-full'
          } transition-transform duration-300 ease-in-out overflow-y-auto h-[100vh]`}
      >
        <div className="flex flex-col h-screenl justify-between">
          <div className="w-100 justify-between bg-[#404041] h-[80px] text-[24px] leading-[30px] font-semibold items-center flex px-[32px] text-white">
            {title}
            <Image src={cross} alt="SAPP Logo" onClick={handleMaskClick} className="cursor-pointer"/>
          </div>
        </div>
        <div className="flex- mt-[24px] mx-[32px] overflow-y-auto h-[80vh]">
          {children}
        </div>
        <div
          className="flex justify-between h-[82px] items-center"
          style={{ borderTop: '1px solid #DCDDDD' }}
        >
          <ButtonText title="Cancel" className='ms-[4px]' onClick={handleMaskClick} />
          <ButtonPrimary title="Next Lesson" className="h-10 me-[32px]" onClick={() => { }} />
        </div>
      </div>
    </>
  );
};

export default SappDrawer