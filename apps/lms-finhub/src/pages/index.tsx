import { UserType } from '@lms/contexts'
import withAuthorization from 'src/HOC/withAuthorization'

const IndexPage = () => {
  return <></>
}

export default withAuthorization([UserType.TEACHER, UserType.STUDENT])(
  IndexPage,
)
