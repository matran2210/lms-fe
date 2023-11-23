import ProfileContent from '@components/features/profile/ProfileContent'
import ProfileHeader from '@components/features/profile/ProfileHeader'
import ProfileSideBar from '@components/features/profile/ProfileSideBar'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { useAppDispatch } from 'src/redux/hook'
import { getMe } from 'src/redux/slice/User/User'

const Home: NextPage = () => {
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [avatar, setAvatar] = useState<File>()
  const dispatch = useAppDispatch()
  useEffect(() => {
    try {
      dispatch(getMe())
    } catch (error) {}
  }, [])
  return (
    <div className="container">
      <div className="max-w-[71.5rem] my-0 mx-auto">
        <ProfileHeader setAvatar={setAvatar} isEdit={isEdit}></ProfileHeader>
        <div className="flex sm:flex-row flex-col justify-between gap-6">
          <ProfileSideBar page={'my_profile'}></ProfileSideBar>
          <ProfileContent
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            page={'my_profile'}
            avatar={avatar}
          ></ProfileContent>
        </div>
      </div>
    </div>
  )
}

export default Home
