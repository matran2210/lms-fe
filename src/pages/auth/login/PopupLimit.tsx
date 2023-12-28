import { AlertIcon } from '@assets/icons'
import SappModal from '@components/base/modal/SappModal'
import { TimeIcon } from '@components/icons'
import { useEffect } from 'react'
import { useAppDispatch } from 'src/redux/hook'

interface IProps {
  open: boolean
  setOpen: any
}
const PopUpLimit = ({ open, setOpen }: IProps) => {
  const dispatch = useAppDispatch()
  // const {} = useAppSelector()
  //to do: call api to get datail
  const getData = useEffect(() => {
    //dispatch(getDetailTest)
  }, [])

  const onOk = () => {
    setOpen(false)
  }
  return (
    <SappModal
      open={open}
      setOpen={setOpen}
      //   cancelButtonCaption="Quit"
      okButtonCaption="Back to Login"
      //   handleCancel={onCancel}
      handleSubmit={onOk}
      showCancelButton={false}
      showHeader={false}
      refClass="md:px-19 py-19 flex flex-col animate-jump-in relative transform bg-white text-left shadow-xl transition-all"
      size="max-w-[614px]"
      footerButtonClassName="flex flex-col-reverse gap-6"
      childClass="flex flex-col justify-center items-center"
      parentChildClass=""
      position="center"
      fullWidthBtn={true}
      closeAfterSubmit={true}
      buttonSize="extra"
    >
      <div className="p-11">
        <AlertIcon />
      </div>
      <div className="text-bw-1 text-4xl font-bold mt-6">Access Limits</div>
      <div className="text-gray-1 text-sm font-normal mt-4 mb-7 text-center">
        You can only access a maximum of 3 devices, please contact out support
        at 0889 662 276.
      </div>
    </SappModal>
  )
}

export default PopUpLimit
