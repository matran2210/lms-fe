import ClassProgress from '@components/progress/ClassProgress'
import SappTabs from 'src/components/tabs/SappTabs'
import { ITabsTeacher } from 'src/type'
import { Tag, Typography } from 'antd'
import { GeoLocationIcon, CalendarIcon } from '@assets/icons'
import { formatDateFromUTC } from '@utils/index'
import { IClassCard } from 'src/type/classes'
import {
  StatusTag,
  statusMap,
} from '@pages/teachers/my-class/components/OverView'
const { Title } = Typography
interface IProps {
  dataDetail?: IClassCard | undefined
  tabs?: ITabsTeacher[]
  loading?: boolean
  progress?: number
  setSelected: React.Dispatch<React.SetStateAction<number>>
  selected: number
}

const ClassCard = ({
  dataDetail,
  tabs = [],
  loading,
  progress = 0,
  setSelected,
  selected,
}: IProps) => {
  return (
    <div className="h-fit w-full rounded-xl bg-white">
      <div className="flex flex-col">
        <Title level={4} className="text-gray-700" style={{ marginBottom: 4 }}>
          {dataDetail?.course?.name}
        </Title>
        <div className="mb-5 flex justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <div className="mr-6">
              <StatusTag
                status={dataDetail?.status as keyof typeof statusMap}
              />
            </div>
            {dataDetail?.facility?.address && (
              <>
                <GeoLocationIcon />
                <span className="ml-1 mr-6 text-sm font-medium text-gray-400">
                  {dataDetail?.facility?.address}
                </span>
              </>
            )}
            {dataDetail?.started_at && dataDetail?.finished_at && (
              <>
                <CalendarIcon />
                <span className="ml-1  text-sm font-medium text-gray-400">
                  {dataDetail?.started_at && dataDetail?.finished_at && (
                    <>
                      {formatDateFromUTC(dataDetail?.started_at)}&nbsp;-&nbsp;
                      {formatDateFromUTC(dataDetail?.finished_at)}
                    </>
                  )}
                </span>
              </>
            )}
          </div>
          <div>
            <ClassProgress
              title="Progress"
              percent={dataDetail?.progress ?? 0}
            />
          </div>
        </div>

        <SappTabs tabs={tabs} setSelected={setSelected} selected={selected} />
      </div>
    </div>
  )
}

export default ClassCard
