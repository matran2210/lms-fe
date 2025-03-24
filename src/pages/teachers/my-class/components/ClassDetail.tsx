import LayoutTeacher from '@components/layout/Teacher'
import { useRouter } from 'next/router'
import SappLoadingGlobal from 'src/common/SappLoadingGlobal'
import ClassCard from '@components/card/ClassCard'
import { ITabs } from 'src/type'
import { PageLink } from 'src/constants'
import { useQuery } from 'react-query'
import { TeacherAPI } from 'src/pages/api/teacher/index'
import Overview from 'src/pages/teachers/my-class/[id]/overview/index'
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

const ClassDetail = ({ children }: { children: React.ReactNode }) => {
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
    <SappLoadingGlobal loading={false}>
      <LayoutTeacher
        title="Class Detail"
        breadcrumbs={breadcrumbs}
        className="bg-[#F2F4F7] p-0"
      >
        <div className="mb-6 h-fit w-full rounded-xl bg-white px-8 pt-8">
          <ClassCard
            tabs={[
              {
                title: 'Overview',
                link: `${PageLink.TEACHER_MY_CLASS}/${router?.query?.id}/${PageLink.MYPROFILE}`,
                children: <Overview />,
              },
              {
                title: 'Students',
                link: `${PageLink.TEACHER_MY_CLASS}/${router?.query?.id}/${PageLink.STUDENTS}`,
              },
              {
                title: 'Teaching Progress',
                link: `${PageLink.TEACHER_MY_CLASS}/${router?.query?.id}/${PageLink.TEACHING_PROCESS}`,
              },
              {
                title: 'Students Test Result',
                link: `${PageLink.TEACHER_MY_CLASS}/${router?.query?.id}/${PageLink.STUDENTS_TEST_RESULT}`,
              },
            ]}
          />
        </div>
        <div className="h-fit w-full rounded-xl bg-white px-8 py-6">
          {children}
        </div>
      </LayoutTeacher>
    </SappLoadingGlobal>
  )
}

export default ClassDetail
