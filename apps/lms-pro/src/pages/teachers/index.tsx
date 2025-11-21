import withAuthorization from 'src/HOC/withAuthorization'
import { UserType } from '@lms/contexts'
import { LayoutTeacher } from '@lms/ui'
import { CoursesAPI } from '@pages/api/courses'
import { AuthenticationManager } from '@utils/helpers/keycloak'
import { PageLink } from 'src/constants/routers'
const PageTeacher = () => {
  return (
    <LayoutTeacher courseApi={CoursesAPI} authManager={new AuthenticationManager} pageLink={PageLink}>
      <div />
    </LayoutTeacher>
  )
}

export default withAuthorization([UserType.TEACHER])(PageTeacher)
