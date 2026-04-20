'use client'
import { withAuthorization } from '@lms/hoc'
import { UserType } from '@lms/contexts'

const IndexPage = () => {
  return <></>
}

export default withAuthorization([UserType.TEACHER, UserType.STUDENT])(
  IndexPage,
)
