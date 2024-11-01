import { useRouter } from 'next/router'
import { PageLink } from 'src/constants'

const AdminPage = () => {
  const router = useRouter()
  router.push(PageLink.COURSES)
}
export default AdminPage
