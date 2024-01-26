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
  const dispatch = useAppDispatch()
  // const {} = useAppSelector()
  //to do: call api to get datail
  const getData = useEffect(() => {
    //dispatch(getDetailTest)
  }, [])
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
    >
      <TimeIcon />
      <div className="text-bw-1 text-4xl font-bold mt-6 gap">Time Out</div>
      <div className="text-gray-1 text-medium-sm font-normal mt-4 mb-13">
        You are running out of time to do your test
      </div>
    </SappModal>
  )
}

export default TestTimeOutModal
