import { AlertTriagle } from '@assets/icons'
import { SappModalV2 } from '@lms/ui'
import { Dispatch, SetStateAction } from 'react'

interface IProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  data: string[]
  caseStudy: boolean
  handleSubmit: () => void
}
const UnSubmitAnswerModal = ({
  open,
  setOpen,
  data,
  caseStudy,
  handleSubmit,
}: IProps) => {
  return (
    <SappModalV2
      open={open}
      okButtonClass="!text-base"
      cancelButtonClass="!text-base"
      handleCancel={() => setOpen(false)}
      onOk={() => handleSubmit()}
      showOkButton={true}
      showCancelButton={true}
      showFooter={true}
      okButtonCaption="OK"
      buttonSize="extra"
      cancelButtonCaption="Close"
      title={''}
    >
      <div className="mx-auto flex w-max items-center justify-center rounded-full bg-secondary p-8">
        <AlertTriagle />
      </div>
      <div className="mt-6 flex justify-center text-4xl font-semibold text-[#050505]">
        UnSubmit Answer
      </div>
      <div className="mb-11 mt-4 text-center text-2xl font-normal text-[#A1A1A1]">
        {caseStudy ? (
          <ul>
            {data.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <div>{data.join(', ')}</div>
        )}
      </div>
    </SappModalV2>
  )
}

export default UnSubmitAnswerModal
