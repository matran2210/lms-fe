import React, { useState } from 'react'
import { useTailwindBreakpoint } from '@lms/hooks'
import FullScreenMobile from '../Modal/FullScreenMobile'
import ChangePassword from '../ChangePassword'
import { PencilFillV2Icon } from '@lms/assets'
import TeacherProfileCard from '@components/common/TeacherProfileCard'

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
    <TeacherProfileCard title="Password">
      <div className="flex items-center justify-between gap-2">
        <div className="text-lg text-[#6C6C6C]">*********************</div>
        <div className=" grow cursor-pointer hover:block hover:text-primary">
          <div
            className="flex items-center justify-end gap-2"
            onClick={handleClickEdit}
          >
            <PencilFillV2Icon className="h-6 w-6 text-txt-secondary" />
            <div className="text-sm font-medium text-gray-800">
              Change Password
            </div>
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
    </TeacherProfileCard>
  )
}

export default MyPasword
