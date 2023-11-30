import SappButton from '@components/base/button/SappButton'
import SappModal from '@components/base/modal/SappModal'
import { TimeIcon } from '@components/icons'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'

interface IProps {
  open: boolean
  setOpen: any
  title: string
}
const TestTimeOutModal = ({ open, setOpen, title }: IProps) => {
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
      cancelButtonCaption="Quit"
      okButtonCaption="Submit"
      //   handleCancel={() => {
      //     setOpen(false)
      //   }}
      handleSubmit={onSubmit}
      showHeader={false}
      size="w-max"
      footerButtonClassName="flex flex-col-reverse gap-6"
      childClass="-mr-4 flex flex-col justify-center items-center"
      parentChildClass=""
      position="center"
      fullWidthBtn={true}
    >
      <TimeIcon />
      <div className="text-bw-1 text-4xl font-bold mt-6">Time Out</div>
      <div className="text-gray-1 text-sm font-normal mt-4 mb-16">
        You will have 60 days from the activation date to study this course
      </div>
    </SappModal>
  )
}

export default TestTimeOutModal
