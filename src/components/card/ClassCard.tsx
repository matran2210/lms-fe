import { multiply, round } from 'lodash'
import ClassProgress from '@components/progress/ClassProgress'
import SappTabs from 'src/components/tabs/SappTabs'
import { ITabsTeacher } from 'src/type'
import LoadingCard from 'src/common/LoadingCard'
import { Tag, Typography } from 'antd'
import { GeoLocationIcon, CalendarIcon } from '@assets/icons'
import { formatDateFromUTC } from '@utils/index'
const { Title } = Typography
interface IProps {
  dataDetail?: any | undefined
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
    <>
      {loading ? (
        <LoadingCard />
      ) : (
        <div className="h-fit w-full rounded-xl bg-white">
          <div className="flex flex-col">
            <Title
              level={4}
              className="text-gray-700"
              style={{ marginBottom: 4 }}
            >
              {dataDetail?.course?.name}
            </Title>
            <div className="mb-5 flex justify-between">
              <div className="flex items-center text-sm text-gray-500">
                <Tag className="text-xs mr-6 rounded border border-transparent bg-[#01711f]/5 font-semibold text-[#07af17]">
                  {dataDetail?.status}
                </Tag>
                <GeoLocationIcon />
                <span className="ml-1 mr-6 text-sm font-medium text-gray-400">
                  54 Lê Thanh Nghị, Hai Bà Trưng
                </span>
                <CalendarIcon />
                <span className="ml-1  text-sm font-medium text-gray-400">
                  {formatDateFromUTC(dataDetail?.started_at)}&nbsp;-&nbsp;
                  {formatDateFromUTC(dataDetail?.finished_at)}
                </span>
              </div>
              <div>
                <ClassProgress
                  title="Progress"
                  percent={round(multiply(progress, 100), 0)}
                />
              </div>
            </div>

            <SappTabs
              tabs={tabs}
              setSelected={setSelected}
              selected={selected}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default ClassCard
