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
        <CloseIcon className="transform stroke-[#050505] transition-all duration-300 ease-in-out group-hover:stroke-black" />
      </div>
      <div className="mx-auto my-auto flex flex-col px-2 md:px-12">
        <div className="mt-4 text-4xl font-semibold text-[#050505]">
          Annotation by Color
        </div>
        <div className="mb-4 mt-2 text-sm text-[#A1A1A1]">
          The annotation uses colors as labels for the status of the question in
          your test/ quiz.
        </div>
        <div className="my-[18px] grid w-full grid-cols-[80%,20%]">
          <div className="content-center">
            <div className="h-2 bg-success-600 text-success-600"></div>
          </div>
          <div className="content-center text-right text-success-600">
            Correct
          </div>
        </div>
        <div className="my-[18px] grid w-full grid-cols-[75%,25%]">
          <div className="content-center">
            <div className="h-2 bg-error text-error"></div>
          </div>
          <div className="content-center text-right text-error">Incorrect</div>
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
              <div className="h-2 bg-[#18355D] text-[#18355D]"></div>
            </div>
            <div className="content-center text-right text-[#18355D]">
              Completed
            </div>
          </div>
        )}
        {gradingStatus !== GRADE_STATUS.FINISHED_GRADING && (
          <div className="my-[18px] grid w-full grid-cols-[65%,35%]">
            <div className="content-center">
              <div className="h-2 bg-[#A1A1A1] text-[#A1A1A1]"></div>
            </div>
            <div className="content-center text-right text-[#A1A1A1]">
              Not Completed
            </div>
          </div>
        )}
      </div>
    </SappModalV2>
  )
}

export default Annotation
