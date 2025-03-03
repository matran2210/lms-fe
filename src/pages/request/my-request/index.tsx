import PageContainer from '@components/common/PageContainer'
import Layout from '@components/layout'
import PersonalScheduleTab from '@components/request/PersonalScheduleTab'
import TimeOffTab from '@components/request/TimeOffTab'
import { RequestProvider } from '@contexts/RequestContext'
import { Tabs } from 'antd'
import { TitleSidebar } from 'src/constants'

const breadcrumbs = [
  {
    title: 'LMS',
    link: '#',
  },
  {
    title: TitleSidebar.MY_REQUEST,
    link: '#',
  },
]

const tabs = [
  {
    key: '1',
    label: 'Personal Schedule Request',
    children: <PersonalScheduleTab />,
  },
  {
    key: '2',
    label: 'Timeoff Request',
    children: <TimeOffTab />,
  },
  {
    key: '3',
    label: 'Schedule Request',
    children: <PersonalScheduleTab />,
  },
]

const RequestPage = () => {
  return (
    <Layout title={TitleSidebar.MY_REQUEST}>
      <PageContainer
        titlePage={TitleSidebar.MY_REQUEST}
        breadcrumbs={breadcrumbs}
      >
        <RequestProvider>
          <Tabs defaultActiveKey="1" items={tabs} />
        </RequestProvider>
      </PageContainer>
    </Layout>
  )
}

export default RequestPage
