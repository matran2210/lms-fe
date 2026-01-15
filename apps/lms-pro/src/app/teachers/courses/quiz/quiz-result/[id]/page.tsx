"use client"
import { FullScreenLayout } from '@lms/ui'
import withAuthorization from 'src/HOC/withAuthorization'
import { UserType } from '@lms/contexts'
import { QuizResults } from '@lms/feature-courses'

const QuizResultPage = () => {
  return (
    <FullScreenLayout title="Quiz result">
      <QuizResults isTeacher />
    </FullScreenLayout>
  )
}

export default withAuthorization([UserType.TEACHER])(QuizResultPage)
