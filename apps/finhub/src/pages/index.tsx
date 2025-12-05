import withAuthorization from 'src/HOC/withAuthorization'
import { UserType } from 'src/redux/types/User/urser'

const IndexPage = () => {
  return <></>
}

export default withAuthorization([UserType.TEACHER, UserType.STUDENT])(
  IndexPage,
)
