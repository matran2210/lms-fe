import ShortCourseModal from '@components/base/modal/ShortCourseModal'
import { TimeIcon } from '@components/icons'

interface IProps {
  open: boolean
  setOpen: any
  handleSubmit: any
  handleQuit: any
  okButtonCaption?: string
  type: string | string[] | undefined
  maskClosable?: boolean
}
const TestTimeOutModal = ({
  open,
  setOpen,
  handleSubmit,
  handleQuit,
  type,
  okButtonCaption = 'Confirm',
  maskClosable = true,
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

  const content =
    type === 'event-test' ? (
      <span>
        The test has timed out and has been submitted automatically. Your test
        result will <strong>be emailed to you on June 28, 2025.</strong> Please
        check your email regularly to receive the earliest update.
      </span>
    ) : (
      'The test has timed out and has been submitted automatically.'
    )
  return (
    <ShortCourseModal
      open={open}
      cancelButtonCaption="Quit"
      okButtonCaption={okButtonCaption}
      showCancelButton={false}
      handleCancel={onCancel}
      onOk={onSubmit}
      fullWidthBtn={true}
      buttonSize="medium"
      icon={<TimeIcon />}
      header="Time Out"
      content={content}
      maskClosable={maskClosable}
    />
  )
}

export default TestTimeOutModal
