import { AlertIcon } from '@assets/icons'
import SappModalV2 from '@components/base/modal/SappModalV2'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { MY_COURSES } from 'src/constants/lang'
import { useAppDispatch } from 'src/redux/hook'

interface IProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
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
    <SappModalV2
      open={open}
      okButtonCaption="Back to Login"
      onOk={onOk}
      showCancelButton={false}
      showHeader={false}
      size="max-w-[646px]"
      footerButtonClassName="flex flex-col-reverse gap-6"
      childClass="flex flex-col justify-center items-center"
      parentChildClass=""
      position="center"
      fullWidthBtn={true}
      closeAfterSubmit={true}
      buttonSize="extra"
      title={undefined}
      handleCancel={() => setOpen(false)}
    >
      <div className="flex justify-center">
        <div
          className="p-8 rounded-full bg-secondary"
          style={{ width: 'fit-content' }}
        >
          <AlertIcon />
        </div>
      </div>
      <div className="text-bw-1 text-4xl font-semibold mt-6 flex justify-center">
        Access Limits
      </div>
      <div className="text-gray-1 text-medium-sm font-normal mt-4 mb-7 text-center">
        You can only access a maximum of 3 browsers, please contact our support
        at {MY_COURSES.hotline}.
      </div>
    </SappModalV2>
  )
}

export default PopUpLimit
