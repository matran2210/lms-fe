import React from 'react'
import { Control, FieldValues } from 'react-hook-form'
import { UserHubspotExaminationSubjectItem } from 'src/type/v2'

interface IProps {
  index: number
  courseTabData: UserHubspotExaminationSubjectItem | undefined
  control: Control<FieldValues, any>
}
const AttempItem = ({ index, courseTabData, control }: IProps) => {
  return (
    <div>
      <div className="mb-2 mt-4 text-sm font-semibold md:text-base">
        Attemp {index + 1}:
      </div>
      <div className="mb-5 rounded-lg bg-[#F9F9F9] p-3">
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
    <div className="text-secondary-v2-DEFAULT">{title}</div>
    <div className="font-bold text-secondary-v2-DEFAULT">{value}</div>
  </div>
)
export default AttempItem
