import SappDrawerV3 from '@components/base/drawer/SappDrawerV3'
import { ClassAPI } from '@pages/api/class'
import { ClassKey } from '@pages/api/queryKey'
import { useRouter } from 'next/router'
import { Dispatch, ReactNode, SetStateAction } from 'react'
import { useQuery } from 'react-query'
import { PencilV2Icon } from '@assets/icons'
import Tooltip from 'src/common/Tooltip'
import { COURSE_TYPE } from 'src/constants'
import { CheckCircleTwoTone } from '@ant-design/icons'

type Props = {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

interface InfoItemProps {
  label: string
  value: ReactNode
}

const InfoItem = ({ label, value }: InfoItemProps) => (
  <div className="flex items-center justify-between py-1 text-sm">
    <span className="text-gray-500">{label}</span>
    <span className="flex items-center gap-2 font-medium text-gray-800">
      {value}
    </span>
  </div>
)
const ExamDate = ({ data }: any) => (
  <>
    <p className="font-medium text-[#050505]">
      {data?.exam?.examination?.name ?? '-'}
    </p>
    {data?.is_final_examination_subject === true ? (
      <Tooltip
        showTooltip={true}
        title={'This is your official exam date and can not be changed'}
      >
        <CheckCircleTwoTone twoToneColor={'#52c41a'} />
      </Tooltip>
    ) : (
      data?.remaining_changes > 0 &&
      data?.course.course_type === COURSE_TYPE.NORMAL_COURSE && (
        <Tooltip showTooltip={true} title={'Change Exam Date'}>
          <div
            className="cursor-pointer hover:text-primary"
            // onClick={() => setIsOpen(true)}
          >
            <PencilV2Icon />
          </div>
        </Tooltip>
      )
    )}
  </>
)
const ExaminationInfo = ({ open, setOpen }: Props) => {
  const router = useRouter()
  const { data, isSuccess, isLoading, isError, isFetching } = useQuery({
    queryKey: [ClassKey.ExamInfo],
    queryFn: () =>
      router.query.courseId
        ? ClassAPI.getExamInfo(router.query.courseId as string)
        : Promise.reject('courseId is undefined'),
    refetchOnWindowFocus: false,
    select: (data) => data.data,
    retry: false,
  })

  return (
    <SappDrawerV3
      open={open}
      handleCancel={() => setOpen(false)}
      title="Exam Infomation"
      isShowBtnClose
    >
      <div className="w-full p-4 text-sm">
        <InfoItem label="Program:" value={data?.program?.name ?? '-'} />
        <InfoItem label="Subject:" value={data?.subject?.name ?? '-'} />
        <InfoItem
          label="Class Code:"
          value={data?.exam?.examination?.name ?? '-'}
        />
        {/* <InfoItem label="Duration:" value={data?.exam?.duration ?? '-'} /> */}
        <InfoItem
          label="Scheduled Exam Date:"
          value={<ExamDate data={data} />}
        />
      </div>
    </SappDrawerV3>
  )
}

export default ExaminationInfo
