import LayoutTeacher from '@components/layout/Teacher'
import withAuthorization from 'src/HOC/withAuthorization'
import { UserType } from '@lms/contexts'
const PageTeacher = () => {
  return (
    <LayoutTeacher>
      <div />
    </LayoutTeacher>
  )
}

export default withAuthorization([UserType.TEACHER])(PageTeacher)
