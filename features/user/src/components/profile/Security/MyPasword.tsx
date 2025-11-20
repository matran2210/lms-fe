import ProfileCard from '@components/card/ProfileCard'
import { Icon } from '@lms/assets/icons'
import React, { useState } from 'react'
import { useTailwindBreakpoint } from '@lms/hooks'
import FullScreenMobile from '../Modal/FullScreenMobile'
import ChangePassword from '../ChangePassword'

interface IProps {
  setIsChangePassword: (isChangePassword: boolean) => void
}
const MyPasword = ({ setIsChangePassword }: IProps) => {
  const { isMobileView } = useTailwindBreakpoint()
  const [openChangePassword, setOpenChangePassword] = useState(false)
  const onCloseChangePassword = () => {
    setOpenChangePassword(false)
    setIsChangePassword(false)
  }
  const handleClickEdit = () => {
    setIsChangePassword(true)
    setOpenChangePassword(true)
  }

  return (
    <ProfileCard title="Password">
      <div className="flex items-center justify-between gap-2">
        <div className="text-secondary">*********************</div>
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
      {isMobileView && openChangePassword && (
        <FullScreenMobile
          className="bg-gray-canvas px-4 pb-4"
          title={'Security'}
          open={openChangePassword}
          onClose={onCloseChangePassword}
        >
          <div className="rounded-lg bg-white p-4">
            <div className="text-base font-semibold">Change Password</div>
            <ChangePassword
              handleCancel={() => {
                setIsChangePassword(false)
                onCloseChangePassword()
              }}
            />
          </div>
        </FullScreenMobile>
      )}
    </ProfileCard>
  )
}

export default MyPasword
