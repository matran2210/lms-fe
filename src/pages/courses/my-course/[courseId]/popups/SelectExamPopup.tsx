import ButtonPrimary from '@components/base/button/ButtonPrimary'
import ButtonText from '@components/base/button/ButtonText'
import HookFormSelect from '@components/base/select/HookFormSelect'
import { Modal } from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import useSelectExams from 'src/hooks/useSelectExams'
import { CLASS_USER_STATUS } from 'src/type'

interface ISelectExamPopup {
  courseData: any
}

const SelectExamPopup = ({ courseData }: ISelectExamPopup) => {
  const router = useRouter()
  const [selectedExam, setSelectedExam] = useState<null | string>(null)
  const [examModal, setExamModal] = useState(false)

  const { exams, hasNextPage, fetchNextPage } = useSelectExams(
    router.query.courseId as string,
  )

  const options = exams?.data?.map((exam) => ({
    label: exam.examination.name,
    value: exam.id,
  }))

  useEffect(() => {
    setExamModal(
      courseData?.pages[0].courseDetail.status ===
        CLASS_USER_STATUS.READY_TO_LEARN &&
        courseData?.pages[0].data.course_type === 'TRIAL_COURSE' &&
        !courseData?.pages[0].courseDetail.exam?.id &&
        [...(options ?? [])].length > 0,
    )
  }, [courseData?.pages])
  return (
    <Modal
      open={examModal}
      centered
      footer={false}
      onCancel={() => setExamModal(false)}
    >
      <div className="px-5 py-6">
        <h2 className="text-xl font-semibold">Choosing Exam</h2>
        <p className="text-sm text-gray-1">
          Please select your scheduled exam date.
        </p>

        <HookFormSelect
          classParent="w-full md:max-w-full"
          placeholder="Exam Date"
          options={[...(options ?? [])]}
          onChange={(option: { label: string; value: string | null }) => {
            option !== null && setSelectedExam(option.value)
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
          <ButtonPrimary title="Confirm Exam" className="h-12 text-base" />
        </div>
      </div>
    </Modal>
  )
}

export default SelectExamPopup
