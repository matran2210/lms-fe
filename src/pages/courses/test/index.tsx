import SappModal from '@components/base/modal/SappModal'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'

interface IProps {
  open: boolean
  setOpen: any
  title: string
}
const TestModal = ({ open, setOpen, title }: IProps) => {
  const dispatch = useAppDispatch()
  // const {} = useAppSelector()
  //to do: call api to get datail
  const getData = useEffect(() => {
    //dispatch(getDetailTest)
  }, [])
  const onSubmit = () => {
    //to do: start test
  }
  return (
    <SappModal
      open={open}
      setOpen={setOpen}
      cancelButtonCaption="Cancel"
      okButtonCaption="Start"
      handleCancel={() => {
        setOpen(false)
      }}
      handleSubmit={onSubmit}
      showHeader={false}
      // size="max-w-1/2"
      footerButtonClassName="justify-between flex"
      childClass=""
      parentChildClass=""
      position="center"
    >
      <div className="text-bw-1 text-4xl font-bold mb-4">{title}</div>
      <div className="flex justify-between py-6 border-b border-slate-100 gap-8">
        <div className="text-gray-1">Name:</div>
        <div className="text-bw-1">Final Test Course F8</div>
      </div>
      <div className="flex justify-between py-6 border-b border-slate-100 gap-8">
        <div className="text-gray-1">Pass Mark:</div>
        <div className="text-bw-1">--</div>
      </div>
      <div className="flex justify-between py-6 border-b border-slate-100 gap-8">
        <div className="text-gray-1">Time Allowed:</div>
        <div className="text-bw-1">00:00:00</div>
      </div>
      <div className="flex justify-between py-6 border-b border-slate-100 gap-8">
        <div className="text-gray-1">No of Attempts:</div>
        <div className="text-bw-1">1/Unlimited</div>
      </div>
      <div className="flex justify-between py-6 gap-8">
        <div className="text-gray-1">Status:</div>
        <div className="text-danger">Unfinish</div>
      </div>
    </SappModal>
  )
}

export default TestModal
