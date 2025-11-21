import { CloseIcon } from '@lms/assets'
import {FullScreenLayout} from '@lms/ui'
import QuizResult from '@components/quiz/quiz-result'
import withAuthorization from 'src/HOC/withAuthorization'
import { UserType } from '@lms/contexts'

const QuizResultPage = () => {
  return (
    <FullScreenLayout title="Quiz result">
      <QuizResult />
    </FullScreenLayout>
  )
}

export default withAuthorization([UserType.STUDENT])(QuizResultPage)
