import ProfileCard from '@components/card/ProfileCard'
import Icon from '@components/icons'
import React from 'react'

interface IProps {
  setIsChangePassword: (isChangePassword: boolean) => void
}
const MyPasword = ({ setIsChangePassword }: IProps) => {
  const handleClickEdit = () => {
    setIsChangePassword(true)
  }
  return (
    <ProfileCard title="Pasword">
      <div className="flex items-center justify-between gap-2">
        <div className="text-gray-14">*********************</div>
        <div className=" grow cursor-pointer hover:block hover:text-primary">
          <div
            className="flex items-center justify-end gap-2"
            onClick={handleClickEdit}
          >
            <div>Change Password</div>
            <Icon type="edit" />
          </div>
        </div>
      </div>
    </ProfileCard>
  )
}

export default MyPasword
