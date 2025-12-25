import { UserType } from '@lms/contexts'
import { QuizResults } from '@lms/feature-courses'
import { FullScreenLayout } from '@lms/ui'
import withAuthorization from 'src/HOC/withAuthorization'

const QuizResultPage = () => {
  return (
    <FullScreenLayout title="Quiz result">
      <QuizResults />
    </FullScreenLayout>
  )
}

export default withAuthorization([UserType.STUDENT])(QuizResultPage)
