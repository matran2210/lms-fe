import { LoginIcon } from '@assets/icons'
import SappModalV3 from '@components/base/modal/SappModalV3'
import { Dispatch, SetStateAction } from 'react'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import {
  closeShowRemind,
  entranceTestReducer,
} from 'src/redux/slice/EntranceTest/EntranceTest'

const PopUpRemindEntrance = ({
  setOpenFillForm,
  setOpenTest,
}: {
  setOpenFillForm: Dispatch<SetStateAction<boolean>>
  setOpenTest: Dispatch<SetStateAction<boolean>>
}) => {
  const { shouldShowRemind, count } = useAppSelector(entranceTestReducer)
  const dispatch = useAppDispatch()
  const getEnstranceTest = localStorage.getItem('enstranceTest')
  const onCancel = () => {
    dispatch(closeShowRemind())
    localStorage.setItem('enstranceTest', 'false')
  }

  const onOk = () => {
    count === 1 ? setOpenFillForm(true) : dispatch(closeShowRemind())
    localStorage.setItem('enstranceTest', 'false')
  }

  return (
    <SappModalV3
      open={shouldShowRemind && getEnstranceTest === 'true'}
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
      <div className="mb-7 mt-4 text-center text-sm font-normal text-[#A1A1A1]">
        <span>
          You have
          <span className="font-semibold text-[#050505]"> {count}</span>
        </span>
        <span> entrance tests that haven’t been taken, complete them now</span>
      </div>
    </SappModalV3>
  )
}
export default PopUpRemindEntrance
