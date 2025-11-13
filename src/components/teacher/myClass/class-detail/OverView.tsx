import HeaderTeacher from '@components/layout/Header/HeaderTeacher'
import { Typography } from 'antd'
import { ICertificateData } from 'src/type/classes'

const { Text } = Typography
export const statusMap = {
  COMPLETED: {
    label: 'Completed',
    color: 'text-[#07af17]',
    bg: 'bg-[#01711f0D]',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    color: 'text-[#025eff]',
    bg: 'bg-[#025eff0D]',
  },
  NOT_STARTED: {
    label: 'Not Started',
    color: 'text-primary-4',
    bg: 'bg-primary-5',
  },
  ended: { label: 'Ended', color: 'text-[#4b5563]', bg: 'bg-gray-100' },
}

export const StatusTag = ({ status }: { status: keyof typeof statusMap }) => {
  const { label, color, bg } = statusMap[status] || statusMap.COMPLETED
  return (
    <span className={`rounded p-2 text-sm font-semibold  ${color} ${bg}`}>
      {label}
    </span>
  )
}
export default function Overview({
  certificateData,
}: {
  certificateData: ICertificateData[]
}) {
  return (
    <>
      <HeaderTeacher title="Overview" />
      <div className="grid grid-cols-1 gap-y-4">
        {certificateData?.map((item: ICertificateData) => (
          <div key={item?.value} className="grid grid-cols-5 items-center">
            <div className="col-span-1">
              <Text className="text-sm font-normal text-[#a1a1aa]">
                {item.label}
              </Text>
            </div>
            <div className="col-span-2">
              {item.isTag ? (
                <StatusTag status={item.value as keyof typeof statusMap} />
              ) : (
                <Text strong>{item.value}</Text>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
