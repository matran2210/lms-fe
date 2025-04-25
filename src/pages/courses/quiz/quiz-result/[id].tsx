import { CloseIcon } from '@assets/icons'
import FullScreenLayout from '@components/layout/FullScreenLayout'
import QuizResult from '@components/quiz/quiz-result'
import withAuthorization from 'src/HOC/withAuthorization'
import { UserType } from 'src/redux/types/User/urser'

const QuizResultPage = () => {
  return (
    <FullScreenLayout title="Quiz result">
      <QuizResult />
    </FullScreenLayout>
  )
}

export default withAuthorization([UserType.STUDENT])(QuizResultPage)
