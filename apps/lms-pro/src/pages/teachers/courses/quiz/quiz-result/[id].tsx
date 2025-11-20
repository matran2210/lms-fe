import {FullScreenLayout} from '@lms/ui'
import QuizResult from '@components/quiz/quiz-result'
import withAuthorization from 'src/HOC/withAuthorization'
import { UserType } from 'src/redux/types/User/urser'

const QuizResultPage = () => {
  return (
    <FullScreenLayout title="Quiz result">
      <QuizResult isTeacher />
    </FullScreenLayout>
  )
}

export default withAuthorization([UserType.TEACHER])(QuizResultPage)
