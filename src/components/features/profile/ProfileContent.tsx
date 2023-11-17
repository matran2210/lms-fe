import { IProfilePages } from 'src/type/Profile'
import MyProfile from './MyProfile'

interface IProps {
  page: IProfilePages
}
const ProfileContent = ({ page }: IProps) => {
  return (
    <div className="bg-white p-6 flex-1">
      {page === 'my_profile' && <MyProfile></MyProfile>}
    </div>
  )
}

export default ProfileContent
