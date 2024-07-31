import { CloseIcon } from "@assets/icons";
import SappModalV2 from "@components/base/modal/SappModalV2";

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
        className="text-white flex cursor-pointer justify-end"
        onClick={() => setOpenAnnotaion(false)}
      >
        <CloseIcon className="transition-all stroke-bw-1 ease-in-out duration-300 transform group-hover:stroke-black" />
      </div>
      <div className="flex flex-col w-[462px] mx-auto my-auto">
        <div className="text-bw-1 text-4xl font-semibold mt-4">
          Annotation by Color
        </div>
        <div className="text-gray-1 text-sm mb-4 mt-2">
          The annotation uses colors as labels for the status of the question in
          your test/ quiz.
        </div>
        <div className="flex flex-row justify-between my-4 w-full">
          <div className="content-center">
            <div className="text-state-success w-[360px] h-2 bg-state-success"></div>
          </div>
          <div className="content-center text-state-success">Correct</div>
        </div>
        <div className="flex flex-row justify-between my-4">
          <div className="content-center">
            <div className="text-state-error w-[340px] h-2 bg-state-error"></div>
          </div>
          <div className="content-center text-state-error">Incorrect</div>
        </div>
        <div className="flex flex-row justify-between my-4">
          <div className="content-center">
            <div className="text-pinned-1 w-[320px] h-2 bg-pinned-1"></div>
          </div>
          <div className="content-center text-pinned-1">Compeleted</div>
        </div>
        <div className="flex flex-row justify-between my-4">
          <div className="content-center">
            <div className="text-gray-1 w-[300px] h-2 bg-gray-1"></div>
          </div>
          <div className="content-center text-gray-1">Not Completed</div>
        </div>
      </div>
    </SappModalV2>
  )
}

export default Annotation;