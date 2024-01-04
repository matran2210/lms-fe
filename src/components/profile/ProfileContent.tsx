import { IProfilePages } from 'src/type/Profile'
import MyProfile from './MyProfile'
import { StaticImageData } from 'next/image'
import { Dispatch, SetStateAction } from 'react'

interface IProps {
  page: IProfilePages
  isEdit: boolean
  setIsEdit: (edit: boolean) => void
  avatar?: File
  handleSetAvatar: (avatar: File | undefined) => void
  setReViewImageSrc: Dispatch<
    SetStateAction<string | StaticImageData | undefined>
  >
}
const ProfileContent = ({
  page,
  isEdit,
  setIsEdit,
  avatar,
  handleSetAvatar,
  setReViewImageSrc,
}: IProps) => {
  return (
    <div className="bg-white p-6 flex-1 shadow-box">
      {page === 'myprofile' && (
        <MyProfile
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          avatar={avatar}
          handleSetAvatar={handleSetAvatar}
          setReViewImageSrc={setReViewImageSrc}
        ></MyProfile>
      )}
    </div>
  )
}

export default ProfileContent
