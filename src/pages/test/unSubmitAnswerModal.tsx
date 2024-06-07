import { AlertTriagle } from '@assets/icons'
import SappButton from '@components/base/button/SappButton'
import SappModalV2 from '@components/base/modal/SappModalV2'

interface IProps {
  open: boolean
  setOpen: any,
  data: any[],
  caseStudy: boolean,
  handleSubmit: any,
  handleCancel: any
}
const UnSubmitAnswerModal = ({
  open,
  setOpen,
  data,
  caseStudy,
  handleSubmit,
  handleCancel
}: IProps) => {
  const onSubmit = () => {
    handleSubmit()
  }
  const onCancel = () => {
    setOpen(false)
  }
  return (
    <SappModalV2
      open={open}
      okButtonClass="!text-base"
      cancelButtonClass="!text-base"
      handleCancel={onCancel}
      onOk={onSubmit}
      title={''}
      showFooter={false}
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
        <div>
          { data.join(', ') }
        </div>
      )}
      </div>
      <div className="md:pt-5 pt-5 relative">
        <div className="flex flex-col-reverse gap-6">
          <SappButton
            title="Close"
            size="medium"
            color="textUnderline"
            className="w-full"
            onClick={onCancel}
          />
          <SappButton
            title={'OK'}
            size="medium"
            className="w-full h-12.5"
            onClick={onSubmit}
          />
        </div>
      </div>     
    </SappModalV2>
  )
}

export default UnSubmitAnswerModal
