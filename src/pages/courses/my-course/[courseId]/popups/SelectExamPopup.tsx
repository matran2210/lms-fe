import ButtonPrimary from '@components/base/button/ButtonPrimary'
import ButtonText from '@components/base/button/ButtonText'
import HookFormSelect from '@components/base/select/HookFormSelect'
import { ClassAPI } from '@pages/api/class'
import { Modal } from 'antd'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import useSelectExams from 'src/hooks/useSelectExams'
import { useMutation } from 'react-query'
import withAuthorization from 'src/HOC/withAuthorization'
import { UserType } from 'src/redux/types/User/urser'

interface ISelectExamPopup {
  courseData: any
}

const SelectExamPopup = ({ courseData }: ISelectExamPopup) => {
  const router = useRouter()
  const [selectedExam, setSelectedExam] = useState<null | {
    label: string
    value: string
  }>(null)
  const [examModal, setExamModal] = useState(false)

  const { exams, hasNextPage, fetchNextPage } = useSelectExams(
    router.query.courseId as string,
  )

  const { mutate, isLoading } = useMutation({
    mutationFn: (formData: FormData) =>
      ClassAPI.changeExamDate(router.query.courseId as string, formData),
    onSuccess: (res) => {
      if (res.data.success) {
        setExamModal(false)
        toast.success(res.data.data.message)
      }
    },
  })

  const confirmExamDate = () => {
    const formData = new FormData()
    if (selectedExam) {
      if (selectedExam.value === 'NOT_DECIDED') {
        formData.append('not_decided', 'true')
      } else {
        formData.append('examination_subject_id', selectedExam.value)
        formData.append('not_decided', 'false')
      }
    }
    mutate(formData)
  }

  const options = exams?.data?.map((exam) => ({
    label: exam.examination.name,
    value: exam.id,
  }))

  useEffect(() => {
    setExamModal(
      courseData?.pages[0].courseDetail.remind_choosing_exam &&
        (exams?.metadata?.total_records ?? 0) > 0,
    )
  }, [courseData?.pages, exams?.metadata?.total_records])

  return (
    <Modal
      open={examModal}
      centered
      footer={false}
      onCancel={() => setExamModal(false)}
    >
      <div className="px-5 py-6">
        <h2 className="text-xl font-semibold">Choosing Exam</h2>
        <p className="text-sm text-[#A1A1A1]">
          Please select your scheduled exam date.
        </p>

        <HookFormSelect
          classParent="w-full md:max-w-full"
          placeholder="Exam Date"
          options={[
            ...(options ?? []),
            {
              label: 'Not decided yet',
              value: 'NOT_DECIDED',
            },
          ]}
          onChange={(option: { label: string; value: string }) => {
            option !== null && setSelectedExam(option)
          }}
          onMenuScrollToBottom={hasNextPage && fetchNextPage}
          className="mt-3"
        />

        <div className="mt-12 flex justify-between">
          <ButtonText
            title="Skip"
            className="pl-0 text-base"
            onClick={() => setExamModal(false)}
          />
          <ButtonPrimary
            title="Confirm Exam"
            className="h-12 text-base"
            onClick={confirmExamDate}
            loading={isLoading}
          />
        </div>
      </div>
    </Modal>
  )
}

export default withAuthorization<ISelectExamPopup>([UserType.STUDENT])(
  SelectExamPopup,
)
