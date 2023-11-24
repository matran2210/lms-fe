import { IProfilePages } from 'src/type/Profile'
import MyProfile from './MyProfile'

interface IProps {
  page: IProfilePages
  isEdit: boolean
  setIsEdit: (edit: boolean) => void
  avatar?: File
}
const ProfileContent = ({ page, isEdit, setIsEdit, avatar }: IProps) => {
  return (
    <div className="bg-white p-6 flex-1 shadow-box">
      {page === 'my_profile' && (
        <MyProfile
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          avatar={avatar}
        ></MyProfile>
      )}
    </div>
  )
}

export default ProfileContent
