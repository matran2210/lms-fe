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
  onOpenTab?: () => void
}
const ProfileContent = ({
  page,
  isEdit,
  setIsEdit,
  avatar,
  handleSetAvatar,
  setReViewImageSrc,
  onOpenTab,
}: IProps) => {
  return (
    page === 'myprofile' && (
      <MyProfile
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        avatar={avatar}
        handleSetAvatar={handleSetAvatar}
        setReViewImageSrc={setReViewImageSrc}
        onOpenTab={onOpenTab}
      />
    )
  )
}

export default ProfileContent
