import ProfileContent from '@components/features/profile/ProfileContent'
import ProfileHeader from '@components/features/profile/ProfileHeader'
import ProfileSideBar from '@components/features/profile/ProfileSideBar'
import { PROFILE_PAGES } from '@utils/constants/User'
import { GetServerSideProps } from 'next'
import { useEffect } from 'react'
import { useAppDispatch } from 'src/redux/hook'
import { getMe } from 'src/redux/slice/User/User'
import { IProfilePages } from 'src/type/Profile'

interface IProps {
  page: IProfilePages
}

const ProfilePage = ({ page }: IProps) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getMe())
  }, [])

  return (
    <div className="container">
      <div className="max-w-[69.625rem] my-0 mx-auto">
        <ProfileHeader></ProfileHeader>
        <div className="flex sm:flex-row flex-col justify-between gap-6">
          <ProfileSideBar page={page}></ProfileSideBar>
          <ProfileContent page={page}></ProfileContent>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<IProps> = async (
  context,
) => {
  const params = context.params
  if (
    !params?.page ||
    typeof params?.page !== 'string' ||
    !PROFILE_PAGES[
      (params?.page as string)?.toUpperCase() as keyof typeof PROFILE_PAGES
    ]
  ) {
    return {
      notFound: true,
    }
  }

  return {
    props: { page: params?.page as IProfilePages },
  }
}
export default ProfilePage
