import { IProfilePages } from 'src/type/Profile'
import MyProfile from './MyProfile'

interface IProps {
  page: IProfilePages
  isEdit: boolean
  setIsEdit: (edit: boolean) => void
  avatar?: File
  handleSetAvatar: (avatar: File | undefined) => void
}
const ProfileContent = ({
  page,
  isEdit,
  setIsEdit,
  avatar,
  handleSetAvatar,
}: IProps) => {
  return (
    <div className="bg-white p-6 flex-1 shadow-box">
      {page === 'my_profile' && (
        <MyProfile
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          avatar={avatar}
          handleSetAvatar={handleSetAvatar}
        ></MyProfile>
      )}
    </div>
  )
}

export default ProfileContent
