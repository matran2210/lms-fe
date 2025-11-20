import RemainingTimeIcon from '@assets/icons/RemainingTimeIcon'
import { SappModalV3 } from '@lms/ui'
import { TimeOutIcon } from '@lms/assets/icons'
import { TEST_TYPE } from '@lms/core'
import clsx from 'clsx'

interface IProps {
  open: boolean
  setOpen: any
  handleSubmit: any
  handleQuit: any
  okButtonCaption?: string
  type: string | string[] | undefined
}
const TestTimeOutModal = ({
  open,
  setOpen,
  handleSubmit,
  handleQuit,
  type,
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

  const content =
    type === 'event-test' ? (
      <span>
        The test has timed out and has been submitted automatically. Your test
        result will <strong>be emailed to you on June 28, 2025.</strong> Please
        check your email regularly to receive the earliest update.
      </span>
    ) : type === 'entrance' ? (
      <div className="text-center font-normal text-gray-800">
        <div className="text-sm md:text-base">
          <div className="mb-2">
            <div>
              The test has timed out and has been submitted automatically.
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-4">
          <div className="flex items-center gap-2 text-base font-semibold">
            <RemainingTimeIcon />
            Your remaining time:
          </div>
          <div className={clsx(`text-base font-bold text-error`)}>
            <>{'00:00:00'}</>
          </div>
        </div>
      </div>
    ) : (
      'You are running out of time to do your test.'
    )

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
      header={type === 'entrance' ? TEST_TYPE.ENTRANCE_TEST : 'Time Out'}
      content={content}
      isMaskClosable={false}
      isClosable={type === 'entrance'}
    />
  )
}

export default TestTimeOutModal
