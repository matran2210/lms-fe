import { AlertTriagle } from '@assets/icons'
import SappButton from '@components/base/button/SappButton'
import SappModalV2 from '@components/base/modal/SappModalV2'
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
      <div className="p-8 rounded-full bg-secondary flex items-center justify-center w-max mx-auto">
        <AlertTriagle />
      </div>
      <div className="text-bw-1 text-4xl font-semibold mt-6 flex justify-center">
        UnSubmit Answer
      </div>
      <div className="text-gray-1 text-2xl font-normal mt-4 mb-11 text-center">
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
