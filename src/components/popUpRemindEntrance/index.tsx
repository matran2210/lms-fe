import { AlertIcon, LoginIcon } from '@assets/icons'
import SappModal from '@components/base/modal/SappModal'
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
  const onCancel = () => {
    dispatch(closeShowRemind())
  }
  const onOk = () => {
    dispatch(closeShowRemind())
    router.push('/entrance-test')
  }
  return (
    <SappModal
      open={shouldShowRemind && count > 0}
      setOpen={() => dispatch(closeShowRemind())}
      cancelButtonCaption="Close"
      okButtonCaption="Take Your Test"
      handleCancel={onCancel}
      handleSubmit={onOk}
      //   showCancelButton={true}
      showHeader={false}
      refClass="md:px-19 py-19 flex flex-col animate-jump-in relative transform bg-white text-left shadow-xl transition-all"
      size="max-w-[614px]"
      footerButtonClassName="flex flex-col-reverse gap-6"
      childClass="flex flex-col justify-center items-center"
      parentChildClass=""
      position="center"
      fullWidthBtn={true}
      closeAfterSubmit={false}
      buttonSize="extra"
    >
      <div className="p-11">
        <LoginIcon />
      </div>
      <div className="text-bw-1 text-4xl font-bold mt-6">Take Your Test</div>
      <div className="text-gray-1 text-sm font-normal mt-4 mb-7 text-center">
        <span>
          You have
          <span className="text-bw-1 font-semibold"> {count}</span>
        </span>
        <span> entrance tests that haven’t been taken, complete them now</span>
      </div>
    </SappModal>
  )
}
export default PopUpRemindEntrance
