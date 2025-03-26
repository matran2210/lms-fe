import SappModalV3 from '@components/base/modal/SappModalV3'
import { TimeIcon } from '@components/icons'

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
    <SappModalV3
      open={open}
      cancelButtonCaption="Quit"
      okButtonCaption="View Results"
      handleCancel={onCancel}
      onOk={onSubmit}
      fullWidthBtn={true}
      buttonSize="extra"
      icon={<TimeIcon />}
      header="Time Out"
      content="The test has timed out and has been submitted automatically."
      isMaskClosable={false}
    />
  )
}

export default TestTimeOutModal
