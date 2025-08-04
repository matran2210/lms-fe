import ButtonPrimary from '@components/base/button/ButtonPrimary'
import ButtonText from '@components/base/button/ButtonText'
import HookFormSelect from '@components/base/select/HookFormSelect'
import { ClassAPI } from '@pages/api/class'
import { Modal } from 'antd'
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction, useState } from 'react'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import useSelectExams from 'src/hooks/useSelectExams'
import { CourseDetail, RemindChoosingExam } from 'src/type/course'

interface ISelectExamPopup {
  showSelectExam: boolean
  setShowSelectExam: Dispatch<SetStateAction<boolean>>
  courseData: CourseDetail
}

const SelectExamPopup = ({
  showSelectExam,
  setShowSelectExam,
  courseData,
}: ISelectExamPopup) => {
  const router = useRouter()
  const [selectedExam, setSelectedExam] = useState<null | {
    label: string
    value: string
  }>(
    courseData.exam
      ? {
          label: courseData.exam?.examination.name,
          value: courseData.exam?.id,
        }
      : null,
  )

  const { exams, hasNextPage, fetchNextPage } = useSelectExams(
    router.query.courseId as string,
  )

  const { mutate, isLoading } = useMutation({
    mutationFn: (formData: FormData) =>
      ClassAPI.changeExamDate(router.query.courseId as string, formData),
    onSuccess: (res) => {
      if (res.data.success) {
        setShowSelectExam(false)
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

  const remainingChanges = courseData.remind_choosing_exam.remaining_changes
  const showTitle = (remind_choosing_exam: RemindChoosingExam) => {
    if (remind_choosing_exam.remind_by_progress) {
      return 'Please select your scheduled exam date to get timely revision support.'
    } else if (remind_choosing_exam.remind_by_duration) {
      return 'If you changed your exam date, please update your info to get timely revision support.'
    }
    return ''
  }

  return (
    <Modal
      open={showSelectExam}
      centered
      footer={false}
      onCancel={() => setShowSelectExam(false)}
      closeIcon={false}
      width={614}
    >
      <div className="p-2 sm:p-8 lg:p-12">
        <h2 className="mb-2 text-2xl font-semibold md:text-4xl">
          Choosing Exam
        </h2>
        <p className="text-sm text-gray-1">
          {remainingChanges <= 0 && (
            <span>
              If you have changed your exam date, please contact our support at
              hotline 1900 2225 or submit a support ticket{' '}
              <a
                href="https://sapp.edu.vn/dich-vu-cham-soc-hoc-vien-sapp-academy/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-3"
              >
                here
              </a>{' '}
              to update your information and receive timely revision support...
            </span>
          )}
          {remainingChanges > 0 && showTitle(courseData.remind_choosing_exam)}
        </p>
        {remainingChanges > 0 && (
          <HookFormSelect
            classParent="w-full md:max-w-full"
            placeholder="Exam Date"
            defaultValue={selectedExam}
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
            className="mt-9"
          />
        )}

        <div
          className={`mt-5 flex md:mt-15 ${remainingChanges > 0 ? 'justify-between' : 'justify-end'}`}
        >
          <ButtonText
            title={remainingChanges > 0 ? 'Skip' : 'Back'}
            className="pl-0 text-base"
            onClick={() => setShowSelectExam(false)}
          />
          {remainingChanges > 0 && (
            <ButtonPrimary
              title={remainingChanges > 0 ? 'Confirm' : 'Back'}
              className="h-12 text-base"
              onClick={confirmExamDate}
              loading={isLoading}
            />
          )}
        </div>
      </div>
    </Modal>
  )
}

export default SelectExamPopup
