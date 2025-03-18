import { multiply, round } from 'lodash'
import Progress from 'src/components/progress/Progress'
import SappTabs from 'src/components/tabs/SappTabs'
import { ITabs } from 'src/type'
import LoadingCard from 'src/common/LoadingCard'
import { Tag } from 'antd'
import { CalendarOutlined, EnvironmentOutlined } from '@ant-design/icons'

interface IProps {
  userDetail: any | undefined
  tabs: ITabs[]
  loading: boolean
  progress: number
}

const Card = ({ userDetail, tabs, loading, progress }: IProps) => {
  return (
    <>
      {!loading ? (
        <LoadingCard />
      ) : (
        <div className="mb-6 rounded-xl bg-white px-7 pt-7">
          <div className="flex flex-col">
            <div className="text-lg font-bold">
              Certificate in International Financial Reporting (CertIFR)
            </div>

            <div className="my-2">
              <div className="mt-1 flex items-center text-sm text-gray-500">
                <Tag color="green" className="mr-6">
                  Completed
                </Tag>
                <EnvironmentOutlined className="mr-1" />
                <span className="mr-6">54 Lê Thanh Nghị, Hai Bà Trưng</span>
                <CalendarOutlined className="mr-1" />
                <span>02/12/2024 - 29/05/2025</span>
              </div>
            </div>

            <Progress
              title="Progress"
              percent={round(multiply(progress, 100), 0)}
            />
            <SappTabs tabs={tabs} />
          </div>
        </div>
      )}
    </>
  )
}

export default Card
