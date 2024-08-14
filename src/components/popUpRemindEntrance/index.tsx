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
    <SappModal
      open={shouldShowRemind && getEnstranceTest === 'true'}
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
      <div className="mt-6 text-4xl font-bold text-bw-1">Take Your Test</div>
      <div className="mb-7 mt-4 text-center text-sm font-normal text-gray-1">
        <span>
          You have
          <span className="font-semibold text-bw-1"> {count}</span>
        </span>
        <span> entrance tests that haven’t been taken, complete them now</span>
      </div>
    </SappModal>
  )
}
export default PopUpRemindEntrance
