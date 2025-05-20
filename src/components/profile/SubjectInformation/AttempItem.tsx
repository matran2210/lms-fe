import HookFormTextField from '@components/base/textfield/HookFormTextField'
import React from 'react'
import { Control, FieldValues } from 'react-hook-form'
import { UserHubspotExaminationSubjectItem } from 'src/redux/types/User/urser'

interface IProps {
  index: number
  courseTabData: UserHubspotExaminationSubjectItem | undefined
  control: Control<FieldValues, any>
}
const AttempItem = ({ index, courseTabData, control }: IProps) => {
  return (
    <div>
      <div className="mb-2 text-base font-semibold">Attemp {index + 1}:</div>
      <div className="mb-5 grid grid-cols-2 rounded-lg bg-gray-4 p-3">
        <div className="flex flex-col gap-4">
          <ItemCard
            title="Exam ID:"
            value={courseTabData?.examination_subject?.examination?.name ?? ''}
          />
          <ItemCard title="Exam Result:" value={courseTabData?.result ?? ''} />
          <ItemCard title="Exam Status:" value="" />
        </div>
      </div>
    </div>
  )
}

const ItemCard = ({
  title,
  value,
}: {
  title: string
  value: React.ReactNode
}) => (
  <div className="flex items-center justify-between">
    <div className="text-gray-14">{title}</div>
    <div className="font-bold text-gray-14">{value}</div>
  </div>
)
export default AttempItem
