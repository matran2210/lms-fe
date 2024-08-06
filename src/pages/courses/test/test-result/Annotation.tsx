import { CloseIcon } from '@assets/icons'
import SappModalV2 from '@components/base/modal/SappModalV2'

interface IAnnotation {
  openAnnotaion: boolean
  setOpenAnnotaion: (value: boolean) => void
}

const Annotation = ({ openAnnotaion, setOpenAnnotaion }: IAnnotation) => {
  return (
    <SappModalV2
      title={undefined}
      open={openAnnotaion}
      handleCancel={() => {}}
      onOk={() => {}}
      showFooter={false}
      classNameModal=""
      width={'614px'}
    >
      <div
        className="flex cursor-pointer justify-end text-white"
        onClick={() => setOpenAnnotaion(false)}
      >
        <CloseIcon className="group-hover:stroke-black transform stroke-bw-1 transition-all duration-300 ease-in-out" />
      </div>
      <div className="mx-auto my-auto flex w-[462px] flex-col">
        <div className="mt-4 text-4xl font-semibold text-bw-1">
          Annotation by Color
        </div>
        <div className="mb-4 mt-2 text-sm text-gray-1">
          The annotation uses colors as labels for the status of the question in
          your test/ quiz.
        </div>
        <div className="my-4 flex w-full flex-row justify-between">
          <div className="content-center">
            <div className="h-2 w-[360px] bg-state-success text-state-success"></div>
          </div>
          <div className="content-center text-state-success">Correct</div>
        </div>
        <div className="my-4 flex flex-row justify-between">
          <div className="content-center">
            <div className="h-2 w-[340px] bg-state-error text-state-error"></div>
          </div>
          <div className="content-center text-state-error">Incorrect</div>
        </div>
        <div className="my-4 flex flex-row justify-between">
          <div className="content-center">
            <div className="h-2 w-[320px] bg-pinned-1 text-pinned-1"></div>
          </div>
          <div className="content-center text-pinned-1">Compeleted</div>
        </div>
        <div className="my-4 flex flex-row justify-between">
          <div className="content-center">
            <div className="h-2 w-[300px] bg-gray-1 text-gray-1"></div>
          </div>
          <div className="content-center text-gray-1">Not Completed</div>
        </div>
      </div>
    </SappModalV2>
  )
}

export default Annotation
