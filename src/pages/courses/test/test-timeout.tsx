import SappModal from '@components/base/modal/SappModal'
import { TimeIcon } from '@components/icons'
import { useEffect } from 'react'
import { useAppDispatch } from 'src/redux/hook'

interface IProps {
  open: boolean
  setOpen: any
  handleSubmit: any
  handleQuit: any
}
const TestTimeOutModal = ({
  open,
  setOpen,
  handleSubmit,
  handleQuit,
}: IProps) => {
  // const dispatch = useAppDispatch()
  // const {} = useAppSelector()
  //to do: call api to get datail
  // const getData = useEffect(() => {
  //   //dispatch(getDetailTest)
  // }, [])
  const onSubmit = () => {
    handleSubmit()
    //to do: start test
  }
  const onCancel = () => {
    setOpen(false)
    handleQuit()
  }
  return (
    <SappModal
      open={open}
      setOpen={setOpen}
      cancelButtonCaption="Quit"
      okButtonCaption="Submit"
      handleCancel={onCancel}
      handleCloseOnly={() => setOpen(false)}
      handleSubmit={onSubmit}
      showHeader={false}
      refClass="md:px-19 py-19 flex flex-col animate-jump-in relative transform bg-white text-left shadow-xl transition-all"
      size="max-w-[646px]"
      footerButtonClassName="flex flex-col-reverse gap-8 mt-0"
      childClass="flex flex-col justify-center items-center"
      parentChildClass=""
      position="center"
      fullWidthBtn={true}
      closeAfterSubmit={true}
      buttonSize="extra"
      disableClickOutSide
    >
      <TimeIcon />
      <div className="gap mt-6 text-4xl font-bold text-bw-1">Time Out</div>
      <div className="mb-13 mt-4 text-medium-sm font-normal text-gray-1">
        You are running out of time to do your test
      </div>
    </SappModal>
  )
}

export default TestTimeOutModal
