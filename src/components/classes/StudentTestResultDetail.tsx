import Layout from '@components/layout'
import SappLoadingGlobal from 'src/common/SappLoadingGlobal'
import StudenTestResult from '@components/classes/StudenTestResult'

const StudentTestResultDetail = () => {
  return (
    <SappLoadingGlobal loading={false}>
      <Layout title="My Course">
        <StudenTestResult />
      </Layout>
    </SappLoadingGlobal>
  )
}

export default StudentTestResultDetail
