import { multiply, round } from 'lodash'
import ClassProgress from '@components/progress/ClassProgress'
import SappTabs from 'src/components/tabs/SappTabs'
import { ITabs } from 'src/type'
import LoadingCard from 'src/common/LoadingCard'
import { Tag, Typography } from 'antd'
import { CalendarOutlined, EnvironmentOutlined } from '@ant-design/icons'
const { Title } = Typography
interface IProps {
  userDetail?: any | undefined
  tabs?: ITabs[]
  loading?: boolean
  progress?: number
}

const ClassCard = ({
  userDetail,
  tabs = [],
  loading,
  progress = 0,
}: IProps) => {
  return (
    <>
      {loading ? (
        <LoadingCard />
      ) : (
        <div className="h-fit w-full rounded-xl bg-white">
          <div className="flex flex-col">
            <Title level={4} className="text-gray-700" style={{ margin: 0 }}>
              Certificate in International Financial Reporting (CertIFR)
            </Title>
            <div className="mb-4 flex justify-between">
              <div className="flex items-center text-sm text-gray-500">
                <Tag className="text-xs mr-6 rounded border border-transparent bg-[#01711f]/5 font-semibold text-[#07af17]">
                  Completed
                </Tag>
                <EnvironmentOutlined className="mr-1" />
                <span className="mr-6 text-sm font-medium text-gray-400">
                  54 Lê Thanh Nghị, Hai Bà Trưng
                </span>
                <CalendarOutlined className="mr-1" />
                <span className="text-sm font-medium text-gray-400">
                  02/12/2024 - 29/05/2025
                </span>
              </div>
              <div>
                <ClassProgress
                  title="Progress"
                  percent={round(multiply(progress, 100), 0)}
                />
              </div>
            </div>

            <SappTabs tabs={tabs} />
          </div>
        </div>
      )}
    </>
  )
}

export default ClassCard
