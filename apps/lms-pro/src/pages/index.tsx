import withAuthorization from 'src/HOC/withAuthorization'
import { UserType } from '@lms/contexts'

const IndexPage = () => {
  return <></>
}

export default withAuthorization([UserType.TEACHER, UserType.STUDENT])(
  IndexPage,
)
