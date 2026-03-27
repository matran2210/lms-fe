'use client'
import { useFeature, UserType } from '@lms/contexts'
import {
  ANIMATION,
  ClassStandardScheduleItem,
  DATE_FORMAT_HM,
  DATE_FORMAT_YMD,
  ICertificateData,
  IClassDetail,
  IMyClass,
  IProfilePages,
  ITabs,
  NumberToDayOfWeekMap,
  ProfilePages,
} from '@lms/core'
import { ClassCard } from '@lms/feature-class'
import { LayoutTeacher } from '@lms/ui'
import { Space } from 'antd'
import dayjs from 'dayjs'
import { capitalize } from 'lodash'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'

import { withAuthorization } from '@lms/hoc'
import Overview from '../../../../components/teacher/myClass/class-detail/OverView'
import Students from '../../../../components/teacher/myClass/class-detail/Students'
import Progress from '../../../../components/teacher/my-class/progress-table/Progress'
import StudentsTestResult from '../../../../components/teacher/myClass/class-detail/StudentsTestResult'
import ClassResourceTeacher from '../../../../components/teacher/myClass/class-detail/ClassResourceTeacher'



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
  {
    id: 5,
    title: 'Class Resource',
    urlTitle: ProfilePages.CLASS_RESOURCE,
  },
]

const getStandardSchedule = (data: IMyClass) => {
  return (
    <>
      <Space>
        {data?.class_standard_schedules?.map(
          (item: ClassStandardScheduleItem) => (
            <div
              className="rounded-md bg-divider px-2 py-1"
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
    value: `${data?.started_at ? dayjs(data.started_at).format('DD/MM/YYYY') : '-'} - ${data?.finished_at ? dayjs(data.finished_at).format('DD/MM/YYYY') : '-'
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
const ClassDetailPage = () => {
  const { pageLink, params, query, teacherApi } = useFeature()
  const breadcrumbs: ITabs[] = [
    {
      link: `${pageLink.TEACHERS}`,
      title: 'LMS',
    },
    {
      link: `${pageLink.TEACHER_MY_CLASS}`,
      title: 'My Class',
    },
    {
      link: '',
      title: 'Class Detail',
    },
  ]
  const [certificateData, setCertificateData] = useState<ICertificateData[]>([])
  const { id } = params
  const classId = id as string
  const tabId = query?.tabId as IProfilePages
  const classProgress = query?.classProgress as string
  const [selected, setSelected] = useState<number>(tabs[0].id)

  const { data } = useQuery({
    queryKey: ['class', classId, classProgress],
    queryFn: () => teacherApi?.getClassById(classId),
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
        return <Progress classDetail={data as IClassDetail} />
      case ProfilePages.STUDENTS_TEST_RESULT:
        return <StudentsTestResult />
      case ProfilePages.CLASS_RESOURCE:
        return <ClassResourceTeacher />
      default:
        return <Overview certificateData={certificateData} />
    }
  }

  return (
    <LayoutTeacher
      title="Class Detail"
      breadcrumbs={breadcrumbs}
      className="bg-[#F2F4F7] p-0"
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

export default withAuthorization([UserType.TEACHER])(ClassDetailPage)
