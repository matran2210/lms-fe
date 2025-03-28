import LayoutTeacher from '@components/layout/Teacher'
import { useRouter } from 'next/router'
import ClassCard from '@components/card/ClassCard'
import { ITabs } from 'src/type'
import { ANIMATION, PageLink } from 'src/constants'
import { useQuery } from 'react-query'
import { TeacherAPI } from 'src/pages/api/teacher/index'
import { useEffect, useState } from 'react'
import Overview from '@components/teacher/myClass/class-detail/OverView'
import Students from '@components/teacher/myClass/class-detail/Students'
import StudentsTestResult from '@components/teacher/myClass/class-detail/StudentsTestResult'
import { ICertificateData } from 'src/type/classes'
import TeachingProgress from '@components/teacher/myClass/class-detail/TeachingProgress'

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
  },
  {
    id: 2,
    title: 'Students',
  },
  {
    id: 3,
    title: 'Teaching Progress',
  },
  {
    id: 4,
    title: 'Students Test Result',
  },
]

const ClassDetail = () => {
  const [certificateData, setCertificateData] = useState<ICertificateData[]>([])
  const router = useRouter()
  const classId = router?.query?.id as string
  const [selected, setSelected] = useState<number>(tabs[0].id)

  const { data, isLoading, error } = useQuery({
    queryKey: ['class', classId],
    queryFn: () => TeacherAPI.getClassById(classId),
    enabled: !!classId,
  })

  useEffect(() => {
    if (data) {
      const certificateDataInit: ICertificateData[] = [
        { label: 'Name', value: data?.name },
        { label: 'Code', value: data?.code },
        {
          label: 'Status',
          value: data?.status,
          isTag: true,
          color:
            data?.status === 'COMPLETED'
              ? '#07af17'
              : data?.status === 'IN_PROGRESS'
                ? '#07af17'
                : '',
        },
        { label: 'Facility', value: data?.facility?.name },
        { label: 'Instruction Mode', value: data?.instruction_mode },
        { label: 'Type', value: data?.type },
        { label: 'Capacity', value: data?.capacity ?? '-' },
        {
          label: 'Duration',
          value: data?.flexible_days ?? '-',
        },
        { label: 'Course', value: data?.course?.name },
        {
          label: 'Exam',
          value: data?.examination_subject?.examination.name ?? '-',
        },
        { label: 'Description', value: data?.description },
      ]
      setCertificateData(certificateDataInit)
    }
  }, [data])
  const renderClassDetail = (selected: number) => {
    switch (selected) {
      case 1:
        return <Overview certificateData={certificateData} />
      case 2:
        return <Students />
      case 3:
        return <TeachingProgress />
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
        {renderClassDetail(selected)}
      </div>
    </LayoutTeacher>
  )
}

export default ClassDetail
