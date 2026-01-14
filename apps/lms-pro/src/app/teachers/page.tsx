'use client'
import { UserType } from '@lms/contexts'
import { LayoutTeacher } from '@lms/ui'
import withAuthorization from 'src/HOC/withAuthorization'
const PageTeacher = () => {
  return (
    <LayoutTeacher>
      <div />
    </LayoutTeacher>
  )
}

export default withAuthorization([UserType.TEACHER])(PageTeacher)
