import LayoutTeacher from '@components/layout/Teacher'
import { useRouter } from 'next/router'
import SappLoadingGlobal from 'src/common/SappLoadingGlobal'
import ClassCard from '@components/card/ClassCard'
import { ITabs } from 'src/type'
import { PageLink } from 'src/constants'
import { useQuery } from 'react-query'
import { TeacherAPI } from 'src/pages/api/teacher/index'
import { useEffect, useState } from 'react'
import { formatDateFromUTC } from '@utils/index'
import Overview from 'src/pages/teachers/my-class/components/OverView'
import Students from '../components/Students'
import TeachingProgress from '../components/TeachingProgress'
import StudentsTestResult from '../components/StudentsTestResult'

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
  const [certificateData, setCertificateData] = useState<any>([])
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
      const certificateDataInit: any[] = [
        { label: 'Name', value: data?.name },
        { label: 'Code', value: data?.code },
        { label: 'Status', value: data?.status, isTag: true, color: 'blue' },
        { label: 'Facility', value: data?.facility?.name },
        { label: 'Instruction Mode', value: data?.instruction_mode },
        { label: 'Type', value: data?.type },
        { label: 'Capacity', value: data?.capacity ?? '-' },
        {
          label: 'Duration',
          value: `${formatDateFromUTC(data?.started_at)} - ${formatDateFromUTC(data?.finished_at)}`,
        },
        { label: 'Course', value: data?.course?.name },
        { label: 'Exam', value: data?.examination_subject ?? '-' },
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
    <SappLoadingGlobal loading={false}>
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

        <div className="h-fit w-full rounded-xl bg-white px-8 py-6">
          {renderClassDetail(selected)}
        </div>
      </LayoutTeacher>
    </SappLoadingGlobal>
  )
}

export default ClassDetail
