import ProfileContent from '@components/features/profile/ProfileContent'
import ProfileHeader from '@components/features/profile/ProfileHeader'
import ProfileSideBar from '@components/features/profile/ProfileSideBar'
import { PROFILE_PAGES } from '@utils/constants/Profile'
import { getAccessToken } from '@utils/helpers/authen'
import { GetServerSideProps } from 'next'
import { useEffect } from 'react'
import { useAppDispatch } from 'src/redux/hook'
import { getUser } from 'src/redux/slice/User/User'
import { IProfilePages } from 'src/type/Profile'

interface IProps {
  page: IProfilePages
}

const details = ({ page }: IProps) => {
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
export default details
