import { Tag, Typography } from 'antd'
import Header from '@components/classes/Header'
import ClassDetail from 'src/pages/teachers/my-class/components/ClassDetail'
import { TeacherAPI } from 'src/pages/api/teacher/index'
import { useQuery } from 'react-query'
import { useRouter } from 'next/router'

const { Text } = Typography

export default function Overview() {
  const router = useRouter()
  const classId = router?.query?.id as string

  const { data, isLoading, error } = useQuery({
    queryKey: ['class', classId],
    queryFn: () => TeacherAPI.getClassById(classId),
    enabled: !!classId, // Chỉ gọi API nếu classId tồn tại
  })

  const certificateData = [
    { label: 'Name', value: data?.name },
    { label: 'Code', value: data?.code },
    { label: 'Status', value: data?.status, isTag: true, color: 'blue' },
    { label: 'Facility', value: data?.facility?.name },
    { label: 'Instruction Mode', value: data?.instruction_mode },
    { label: 'Type', value: data?.type },
    { label: 'Capacity', value: data?.capacity ?? '-' },
    { label: 'Duration', value: `${data?.started_at} - ${data?.finished_at}` },
    { label: 'Course', value: data?.course?.name },
    { label: 'Exam', value: data?.examination_subject ?? '-' },
    { label: 'Description', value: data?.description },
  ]

  return (
    <ClassDetail>
      <Header title="Overview" />
      <div className="grid grid-cols-1 gap-y-4">
        {certificateData.map((item, index) => (
          <div key={index} className="grid grid-cols-5 items-center">
            <div className="col-span-1">
              <Text className="text-sm font-normal text-gray-400">
                {item.label}
              </Text>
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
    </ClassDetail>
  )
}
