import { ClassAPI } from '@pages/api/class'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import useSelectExams from 'src/hooks/useSelectExams'
import { useMutation } from 'react-query'
import withAuthorization from 'src/HOC/withAuthorization'
import { UserType } from 'src/redux/types/User/urser'
import SappModalV3 from '@components/base/modal/SappModalV3'
import SAPPSelectV2 from '@components/base/select/SAPPSelectV2'
import { useForm } from 'react-hook-form'

interface ISelectExamPopup {
  courseData: any
}

const SelectExamPopup = ({ courseData }: ISelectExamPopup) => {
  const router = useRouter()
  const { control, watch } = useForm({
    defaultValues: {
      exam_date: null,
    },
  })
  const selectedExam = watch('exam_date')
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
      if (selectedExam === 'NOT_DECIDED') {
        formData.append('not_decided', 'true')
      } else {
        formData.append('examination_subject_id', selectedExam)
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

  const ContentChoosingExam = () => {
    return (
      <>
        <div className="mb-6 justify-center self-stretch text-center text-base font-normal leading-normal text-gray-800">
          Lorem ipsum dolor sit amet consectetur, et in quis elementum risus
          dolor sit amet consectetur amet consectetur.
        </div>
        <SAPPSelectV2
          placeholder="Exam Date"
          options={[
            ...(options ?? []),
            {
              label: 'Not decided yet',
              value: 'NOT_DECIDED',
            },
          ]}
          control={control}
          name="exam_date"
          onMenuScrollToBottom={hasNextPage && fetchNextPage}
        />
      </>
    )
  }
  return (
    <SappModalV3
      open={examModal}
      handleCancel={() => setExamModal(false)}
      onOk={confirmExamDate}
      header="Choosing Exam"
      content={<ContentChoosingExam />}
      showFooter
      okButtonCaption="Confirm"
      fullWidthBtn
      buttonSize="extra"
      cancelButtonCaption="Skip"
      isUnderLine
    />
  )
}

export default withAuthorization<ISelectExamPopup>([UserType.STUDENT])(
  SelectExamPopup,
)
