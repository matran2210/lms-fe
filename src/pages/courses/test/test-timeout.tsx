import SappModalV3 from '@components/base/modal/SappModalV3'
import { TimeOutIcon } from '@components/icons'

interface IProps {
  open: boolean
  setOpen: any
  handleSubmit: any
  handleQuit: any
  okButtonCaption?: string
}
const TestTimeOutModal = ({
  open,
  setOpen,
  handleSubmit,
  handleQuit,
  okButtonCaption = 'View Results',
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
      okButtonCaption={okButtonCaption}
      showCancelButton={false}
      handleCancel={onCancel}
      onOk={onSubmit}
      fullWidthBtn={true}
      buttonSize="medium"
      icon={<TimeOutIcon />}
      header="Time Out"
      content="You are running out of time to do your test"
      isMaskClosable={false}
    />
  )
}

export default TestTimeOutModal
