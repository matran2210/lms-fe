import { LoginIcon } from '@assets/icons'
import SappModalV3 from '@components/base/modal/SappModalV3'
import { useRouter } from 'next/router'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import {
  closeShowRemind,
  entranceTestReducer,
} from 'src/redux/slice/EntranceTest/EntranceTest'

const PopUpRemindEntrance = () => {
  const { shouldShowRemind, count } = useAppSelector(entranceTestReducer)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const getEnstranceTest = localStorage.getItem('enstranceTest')
  const onCancel = () => {
    dispatch(closeShowRemind())
    localStorage.setItem('enstranceTest', 'false')
  }
  const onOk = () => {
    dispatch(closeShowRemind())
    router.push('/entrance-test')
    localStorage.setItem('enstranceTest', 'false')
  }

  return (
    <SappModalV3
      open={shouldShowRemind && getEnstranceTest === 'true'}
      // setOpen={() => dispatch(closeShowRemind())}
      cancelButtonCaption="Close"
      okButtonCaption="Take Your Test"
      handleCancel={onCancel}
      onOk={onOk}
      //   showCancelButton={true}
      fullWidthBtn={true}
      buttonSize="extra"
      icon={<LoginIcon />}
      header="Take Your Test"
    >
      <div className="mb-7 mt-4 text-center text-sm font-normal text-gray-1">
        <span>
          You have
          <span className="font-semibold text-bw-1"> {count}</span>
        </span>
        <span> entrance tests that haven’t been taken, complete them now</span>
      </div>
    </SappModalV3>
  )
}
export default PopUpRemindEntrance
