import { Tabs } from 'antd'
import { useRouter } from 'next/router'
import { ITabs } from 'src/type'
const SappTabs = ({ tabs }: { tabs: any }) => {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Tabs
        defaultActiveKey="1"
        items={tabs}
        className="rounded-xl bg-white p-4 shadow-lg"
      />
    </div>
  )
}

export default SappTabs
