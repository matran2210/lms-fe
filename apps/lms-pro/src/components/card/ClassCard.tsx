import ClassProgress from '@components/progress/ClassProgress'
import SappTabs from 'src/components/tabs/SappTabs'
import { ITabsTeacher } from '@lms/core'
import { Typography } from 'antd'
import { GeoLocationIcon, CalendarIcon } from '@assets/icons'
import { formatDateFromUTC } from '@utils/index'
import { IClassCard } from '@lms/core'
import {
  StatusTag,
  statusMap,
} from '@components/teacher/myClass/class-detail/OverView'
const { Title } = Typography
interface IProps {
  dataDetail?: IClassCard | undefined
  tabs?: ITabsTeacher[]
  setSelected: React.Dispatch<React.SetStateAction<number>>
  selected: number
}

const ClassCard = ({
  dataDetail,
  tabs = [],
  setSelected,
  selected,
}: IProps) => {
  const InfoCourse = () => (
    <div className="mb-5 flex justify-between">
      <div className="flex items-center text-sm text-[#6b7280]">
        <div className="mr-6">
          {dataDetail?.status && (
            <StatusTag status={dataDetail?.status as keyof typeof statusMap} />
          )}
        </div>
        {dataDetail?.facility?.address && (
          <>
            <GeoLocationIcon />
            <span className="ml-1 mr-6 text-sm font-medium text-[#a1a1aa]">
              {dataDetail?.facility?.address}
            </span>
          </>
        )}
        {dataDetail?.started_at && dataDetail?.finished_at && (
          <>
            <CalendarIcon />
            <span className="ml-1  text-sm font-medium text-[#a1a1aa]">
              {formatDateFromUTC(dataDetail?.started_at)}&nbsp;-&nbsp;
              {formatDateFromUTC(dataDetail?.finished_at)}
            </span>
          </>
        )}
      </div>
      <div>
        <ClassProgress title="Progress" percent={dataDetail?.progress} />
      </div>
    </div>
  )

  return (
    <div className="h-fit w-full rounded-xl bg-white">
      <div className="flex flex-col">
        <Title level={4} className="text-[#374151]">
          {dataDetail?.course?.name}
        </Title>
        <InfoCourse />
        <SappTabs tabs={tabs} setSelected={setSelected} selected={selected} />
      </div>
    </div>
  )
}

export default ClassCard
