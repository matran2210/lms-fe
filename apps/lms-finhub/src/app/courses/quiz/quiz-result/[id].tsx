'use client'
import { QuizResults } from '@lms/feature-courses'
import { FullScreenLayout } from '@lms/ui'
import withAuthorization from 'src/HOC/withAuthorization'
import { UserType } from 'src/redux/types/User/urser'

const QuizResultPage = () => {
  return (
    <FullScreenLayout title="Quiz result">
      <QuizResults
      />
    </FullScreenLayout>
  )
}

export default withAuthorization([UserType.STUDENT])(QuizResultPage)
