import LayoutTeacher from '@components/layout/Teacher'
import { useRouter } from 'next/router'
import ClassCard from '@components/card/ClassCard'
import { ITabs, NumberToDayOfWeekMap } from 'src/type'
import { ANIMATION, PageLink } from 'src/constants'
import { useQuery } from 'react-query'
import { TeacherAPI } from 'src/pages/api/teacher/index'
import { useEffect, useState } from 'react'
import Overview from '@components/teacher/myClass/class-detail/OverView'
import Students from '@components/teacher/myClass/class-detail/Students'
import StudentsTestResult from '@components/teacher/myClass/class-detail/StudentsTestResult'
import { ICertificateData } from 'src/type/classes'
import withAuthorization from 'src/HOC/withAuthorization'
import { UserType } from 'src/redux/types/User/urser'
import Progress from '@components/my-class/progress-table/Progress'
import dayjs from 'dayjs'
import { Space } from 'antd'
import { capitalize } from 'lodash'

const breadcrumbs: ITabs[] = [
  {
    link: `${PageLink.TEACHERS}`,
    title: 'LMS',
  },
  {
    link: `${PageLink.TEACHER_MY_CLASS}`,
    title: 'My Class',
  },
  {
    link: '',
    title: 'Class Detail',
  },
]

const tabs = [
  {
    id: 1,
    title: 'Overview',
    urlTitle: 'overview',
  },
  {
    id: 2,
    title: 'Students',
    urlTitle: 'students',
  },
  {
    id: 3,
    title: 'Teaching Progress',
    urlTitle: 'progress',
  },
  {
    id: 4,
    title: 'Students Test Result',
    urlTitle: 'students-test-result',
  },
]

const getStandardSchedule = (data: any) => {
  return (
    <>
      <Space>
        {data?.class_standard_schedules?.map((item: any) => (
          <div
            className="badge badge-light-dark badge-lg"
            style={{ fontWeight: 500 }}
            key={item.day_of_week}
          >
            {item.day_of_week !== null
              ? `${capitalize(NumberToDayOfWeekMap[item.day_of_week])} | `
              : ''}
            {dayjs
              .utc(`${dayjs().format('YYYY-MM-DD')}T${item.start_time}`)
              .local()
              .format('HH:mm')}{' '}
            -{' '}
            {dayjs
              .utc(`${dayjs().format('YYYY-MM-DD')}T${item.end_time}`)
              .local()
              .format('HH:mm')}
          </div>
        ))}
      </Space>
    </>
  )
}

const getCertificateData = (data: any): ICertificateData[] => [
  { label: 'Name', value: data?.name },
  { label: 'Code', value: data?.code },
  {
    label: 'Status',
    value: data?.status,
    isTag: true,
  },
  { label: 'Facility', value: data?.facility?.name },
  { label: 'Instruction Mode', value: data?.instruction_mode },
  { label: 'Type', value: data?.type },
  { label: 'Capacity', value: data?.capacity ?? '-' },
  {
    label: 'Duration',
    value: `${data?.started_at ? dayjs(data.started_at).format('DD/MM/YYYY') : '-'} - ${
      data?.finished_at ? dayjs(data.finished_at).format('DD/MM/YYYY') : '-'
    }`,
  },
  { label: 'Standard Schedule', value: getStandardSchedule(data) },
  { label: 'Course', value: data?.course?.name },
  {
    label: 'Exam',
    value: data?.examination_subject?.examination?.name ?? '-',
  },
  { label: 'Description', value: data?.description },
]
const ClassDetail = () => {
  const [certificateData, setCertificateData] = useState<ICertificateData[]>([])
  const router = useRouter()
  const classId = router?.query?.id as string
  const [selected, setSelected] = useState<number>(tabs[0].id)

  const { data } = useQuery({
    queryKey: ['class', classId],
    queryFn: () => TeacherAPI.getClassById(classId),
    enabled: !!classId,
    retry: false,
  })

  useEffect(() => {
    if (data) {
      setCertificateData(getCertificateData(data))
    }
  }, [data])

  const tabClassDetail = (selected: number) => {
    switch (selected) {
      case 1:
        return <Overview certificateData={certificateData} />
      case 2:
        return <Students />
      case 3:
        return <Progress classDetail={data} />
      case 4:
        return <StudentsTestResult />
      default:
        return <Overview certificateData={certificateData} />
    }
  }

  return (
    <LayoutTeacher
      title="Class Detail"
      breadcrumbs={breadcrumbs}
      className="bg-gray-10 p-0"
    >
      <div className="mb-6 h-fit w-full rounded-xl bg-white px-8 pt-8">
        <ClassCard
          dataDetail={data}
          tabs={tabs}
          selected={selected}
          setSelected={setSelected}
        />
      </div>

      <div
        data-aos={ANIMATION.DATA_AOS}
        className="h-fit w-full rounded-xl bg-white px-8 py-6"
      >
        {tabClassDetail(selected)}
      </div>
    </LayoutTeacher>
  )
}

export default withAuthorization([UserType.TEACHER])(ClassDetail)
