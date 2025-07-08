import LayoutTeacher from '@components/layout/Teacher'
import { useRouter } from 'next/router'
import ClassCard from '@components/card/ClassCard'
import { ITabs, NumberToDayOfWeekMap } from 'src/type'
import {
  ANIMATION,
  DATE_FORMAT_HM,
  DATE_FORMAT_YMD,
  PageLink,
} from 'src/constants'
import { useQuery } from 'react-query'
import { TeacherAPI } from 'src/pages/api/teacher/index'
import { useEffect, useState } from 'react'
import Overview from '@components/teacher/myClass/class-detail/OverView'
import Students from '@components/teacher/myClass/class-detail/Students'
import StudentsTestResult from '@components/teacher/myClass/class-detail/StudentsTestResult'
import { ICertificateData, IMyClass } from 'src/type/classes'
import withAuthorization from 'src/HOC/withAuthorization'
import { UserType } from 'src/redux/types/User/urser'
import Progress from '@components/my-class/progress-table/Progress'
import { IProfilePages, ProfilePages } from 'src/type/Profile'
import dayjs from 'dayjs'
import { Space } from 'antd'
import { capitalize } from 'lodash'
import { ClassStandardScheduleItem } from 'src/type/teachers/request-schedule.interface'

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
    urlTitle: ProfilePages.OVERVIEW,
  },
  {
    id: 2,
    title: 'Students',
    urlTitle: ProfilePages.STUDENTS,
  },
  {
    id: 3,
    title: 'Teaching Progress',
    urlTitle: ProfilePages.TEACHING_PROGRESS,
  },
  {
    id: 4,
    title: 'Students Test Result',
    urlTitle: ProfilePages.STUDENTS_TEST_RESULT,
  },
]

const getStandardSchedule = (data: IMyClass) => {
  return (
    <>
      <Space>
        {data?.class_standard_schedules?.map(
          (item: ClassStandardScheduleItem) => (
            <div
              className="rounded-md bg-gray-2 px-2 py-1"
              key={item.day_of_week}
            >
              {item.day_of_week !== null
                ? `${capitalize(NumberToDayOfWeekMap[item.day_of_week])} | `
                : ''}
              {dayjs
                .utc(`${dayjs().format(DATE_FORMAT_YMD)}T${item.start_time}`)
                .local()
                .format(DATE_FORMAT_HM)}{' '}
              -{' '}
              {dayjs
                .utc(`${dayjs().format(DATE_FORMAT_YMD)}T${item.end_time}`)
                .local()
                .format(DATE_FORMAT_HM)}
            </div>
          ),
        )}
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
  const tabId = router.query?.tabId as IProfilePages
  const classProgress = router.query?.classProgress as string
  const [selected, setSelected] = useState<number>(tabs[0].id)

  const { data } = useQuery({
    queryKey: ['class', classId, classProgress],
    queryFn: () => TeacherAPI.getClassById(classId),
    enabled: !!classId,
    retry: false,
  })

  useEffect(() => {
    if (data) {
      setCertificateData(getCertificateData(data))
    }
  }, [data])

  const tabClassDetail = () => {
    switch (tabId) {
      case ProfilePages.OVERVIEW:
        return <Overview certificateData={certificateData} />
      case ProfilePages.STUDENTS:
        return <Students />
      case ProfilePages.TEACHING_PROGRESS:
        return <Progress classDetail={data} />
      case ProfilePages.STUDENTS_TEST_RESULT:
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
        {tabClassDetail()}
      </div>
    </LayoutTeacher>
  )
}

export default withAuthorization([UserType.TEACHER])(ClassDetail)
