import SAPPSelectV2 from '@components/base/select/SAPPSelectV2'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ExaminationForm } from 'src/redux/types/Course/MyCourse/ExamInformation'
import { zodMsg } from 'src/constants/form'
import useSelectExams from 'src/hooks/useSelectExams'
import UploadSingleFileV2 from '@components/base/button/UploadSingleFileV2'
import { RcFile } from 'antd/es/upload'
interface Iprops {
  classId: string
  onSuccess?: () => void
  remainingChanges?: number
  currentValue?: string
}

const ChangExamDate = ({ classId, currentValue, remainingChanges }: Iprops) => {
  const { exams, hasNextPage, fetchNextPage, refetch } = useSelectExams(classId)
  const validationSchema = z.object({
    note: z
      .array(z.any(), { message: zodMsg.required })
      .min(1, { message: zodMsg.required }),
    examination_subject_id: z.object(
      {
        label: z
          .string({ required_error: zodMsg.required })
          .min(1, { message: zodMsg.required }),
        value: z
          .string({ required_error: zodMsg.required })
          .min(1, { message: zodMsg.required }),
      },
      { message: zodMsg.required },
    ),
  })

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ExaminationForm>({
    resolver: zodResolver(validationSchema),
  })

  const options = exams?.data
    ?.map((exam) => ({
      label: exam?.examination?.name,
      value: exam?.id,
    }))
    ?.filter((item) => {
      return item.value !== currentValue
    })

  return (
    <div className="flex flex-col justify-start">
      <div className="mb-2 text-base font-semibold leading-normal text-gray-800">
        New Exam Date
      </div>
      <SAPPSelectV2
        name="examination_subject_id"
        control={control}
        options={options ?? []}
        required
        placeholder="Choose one option"
        onMenuScrollToBottom={hasNextPage && fetchNextPage}
      />
      <div className="mt-2 text-sm font-normal italic leading-snug text-gray-600">
        You can only change the exam date up to two times.
      </div>
      <div className="mt-1 text-sm font-bold italic leading-snug text-gray-600">
        {remainingChanges} change remaining
      </div>
      <div className="mt-6 flex items-center gap-6">
        <div className="text-base font-semibold leading-normal text-gray-800">
          Registration evidence:
        </div>
        <div>
          <UploadSingleFileV2
            fileList={watch('note') as RcFile[]}
            beforeUpload={(file) => {
              setValue('note', [file])
              return false
            }}
          />
        </div>
      </div>
    </div>
  )
}
export default ChangExamDate
