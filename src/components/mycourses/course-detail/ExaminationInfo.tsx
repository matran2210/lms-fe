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
import { formatDateFromUTC } from '@utils/index'
import { Avatar, List, Skeleton } from 'antd'
import NoDataV2 from 'src/common/NodataV2'

type Props = {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

interface InfoItemProps {
  label: string
  value: ReactNode
}

const InfoItem = ({ label, value }: InfoItemProps) => (
  <div className="flex items-center justify-between text-base text-secondary">
    <div>{label}</div>
    <div className="flex items-center gap-2 font-semibold">{value}</div>
  </div>
)

const ExamDate = ({ data }: any) => (
  <>
    <div>{data?.exam?.examination?.name ?? '-'}</div>
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
  const { data, isLoading, isFetching, isError, isSuccess } = useQuery({
    queryKey: [ClassKey.ExamInfo],
    queryFn: () =>
      router.query.courseId
        ? ClassAPI.getExamInfo(router.query.courseId as string)
        : Promise.reject('courseId is undefined'),
    refetchOnWindowFocus: false,
    select: (data) => data.data,
    retry: false,
  })

  const duration = `${formatDateFromUTC(data?.exam?.start_date ?? '')} - ${formatDateFromUTC(
    data?.exam?.end_date ?? '',
  )}`

  const renderContent = () => {
    if (isLoading || isFetching) {
      return (
        <>
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} active avatar>
              <List.Item.Meta avatar={<Avatar />} />
            </Skeleton>
          ))}
        </>
      )
    }
    if (isError || !isSuccess) {
      return (
        <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center">
          <NoDataV2 />
        </div>
      )
    }
    if (isSuccess) {
      return (
        <div className="flex w-full flex-col gap-4 text-base">
          <InfoItem label="Program:" value={data?.program?.name ?? '-'} />
          <InfoItem label="Subject:" value={data?.subject?.name ?? '-'} />
          <InfoItem label="Class Code:" value={data?.exam?.code_exam ?? '-'} />
          <InfoItem label="Duration:" value={duration} />
          <InfoItem
            label="Scheduled Exam Date:"
            value={<ExamDate data={data} />}
          />
        </div>
      )
    }
  }

  return (
    <SappDrawerV3
      open={open}
      handleCancel={() => setOpen(false)}
      title="Exam Infomation"
      isShowBtnClose
    >
      {renderContent()}
    </SappDrawerV3>
  )
}

export default ExaminationInfo
