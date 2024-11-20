import { CloseIcon } from '@assets/icons'
import SappModalV2 from '@components/base/modal/SappModalV2'
import { GRADE_STATUS } from 'src/constants'

interface IAnnotation {
  openAnnotaion: boolean
  setOpenAnnotaion: (value: boolean) => void
  gradingStatus?: string
}

const Annotation = ({
  openAnnotaion,
  setOpenAnnotaion,
  gradingStatus,
}: IAnnotation) => {
  return (
    <SappModalV2
      title={undefined}
      open={openAnnotaion}
      handleCancel={() => setOpenAnnotaion(false)}
      onOk={() => {}}
      showFooter={false}
      classNameModal="max-w-[634px]"
    >
      <div
        className="flex cursor-pointer justify-end text-white"
        onClick={() => setOpenAnnotaion(false)}
      >
        <CloseIcon className="transform stroke-bw-1 transition-all duration-300 ease-in-out group-hover:stroke-black" />
      </div>
      <div className="mx-auto my-auto flex flex-col px-2 md:px-12">
        <div className="mt-4 text-4xl font-semibold text-bw-1">
          Annotation by Color
        </div>
        <div className="mb-4 mt-2 text-sm text-gray-1">
          The annotation uses colors as labels for the status of the question in
          your test/ quiz.
        </div>
        <div className="my-[18px] grid w-full grid-cols-[80%,20%]">
          <div className="content-center">
            <div className="h-2 bg-state-success text-state-success"></div>
          </div>
          <div className="content-center text-right text-state-success">
            Correct
          </div>
        </div>
        <div className="my-[18px] grid w-full grid-cols-[75%,25%]">
          <div className="content-center">
            <div className="h-2 bg-state-error text-state-error"></div>
          </div>
          <div className="content-center text-right text-state-error">
            Incorrect
          </div>
        </div>
        {gradingStatus === GRADE_STATUS.FINISHED_GRADING ? (
          <div className="my-[18px] grid w-full grid-cols-[70%,30%]">
            <div className="content-center">
              <div className="h-2 bg-[#4077E0] text-[#4077E0]"></div>
            </div>
            <div className="content-center text-right text-[#4077E0]">
              Graded
            </div>
          </div>
        ) : (
          <div className="my-[18px] grid w-full grid-cols-[70%,30%]">
            <div className="content-center">
              <div className="h-2 bg-pinned-1 text-pinned-1"></div>
            </div>
            <div className="content-center text-right text-pinned-1">
              Compeleted
            </div>
          </div>
        )}
        {gradingStatus !== GRADE_STATUS.FINISHED_GRADING && (
          <div className="my-[18px] grid w-full grid-cols-[65%,35%]">
            <div className="content-center">
              <div className="h-2 bg-gray-1 text-gray-1"></div>
            </div>
            <div className="content-center text-right text-gray-1">
              Not Completed
            </div>
          </div>
        )}
      </div>
    </SappModalV2>
  )
}

export default Annotation
