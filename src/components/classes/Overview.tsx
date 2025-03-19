import { Tag, Typography } from 'antd'
import Header from '@components/classes/Header'

const { Text } = Typography

export default function Overview() {
  const certificateData = [
    {
      label: 'Name',
      value: 'Certificate in International Financial Reporting (CertIFR)',
    },
    { label: 'Code', value: 'CFA203.0424' },
    { label: 'Status', value: 'Completed', isTag: true, color: 'success' },
    { label: 'Facility', value: 'NEU' },
    { label: 'Construction Mode', value: 'Online' },
    { label: 'Type', value: 'Revision' },
    { label: 'Số học viên tối đa', value: '60' },
    { label: 'Duration', value: '02/12/2024 - 29/05/2025' },
    {
      label: 'Course',
      value: 'Certificate in International Financial Reporting (CertIFR)',
    },
    { label: 'Exam', value: '04/2025' },
    { label: 'Describe', value: '' },
  ]

  return (
    <div className="w-full">
      <div className="mb-6 rounded-xl bg-white p-7">
        <Header title="Overview" />

        <div className="grid grid-cols-1 gap-y-4">
          {certificateData.map((item, index) => (
            <div key={index} className="grid grid-cols-3 items-center">
              <div className="col-span-1">
                <Text className="text-gray-500">{item.label}</Text>
              </div>
              <div className="col-span-2">
                {item.isTag ? (
                  <Tag color={item.color}>{item.value}</Tag>
                ) : (
                  <Text strong>{item.value}</Text>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
