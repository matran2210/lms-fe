import CertificateContent from '@components/profile/CertificateContent'
import Devices from '@components/profile/Devices'
import LoginHistory from '@components/profile/LoginHistory'
import ProfileContent from '@components/profile/ProfileContent'
import ProfileHeader from '@components/profile/ProfileHeader'
import ProfileSideBar from '@components/profile/ProfileSideBar'
import { GetServerSideProps } from 'next'
import { StaticImageData } from 'next/image'
import { useRef, useState } from 'react'
import { IProfilePages } from 'src/type/Profile'

interface IProps {
  page: IProfilePages
}

const ProfilePage = ({ page }: any) => {
  // const router = useRouter()
  // const page = router.query.page as IProfilePages
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [avatar, setAvatar] = useState<File>()
  const inputFileRef = useRef<HTMLInputElement | null>(null)

  const [reViewImageSrc, setReViewImageSrc] = useState<
    string | StaticImageData
  >()
  const handleSetAvatar = (avatar: File | undefined) => {
    setAvatar(avatar)
  }
  const handleSetIsEdit = (isEdit: boolean) => {
    if (!isEdit && inputFileRef.current) {
      inputFileRef.current.value = ''
    }
    setIsEdit(isEdit)
  }
  let selectedContent: JSX.Element | null = null

  if (page === 'myprofile') {
    selectedContent = (
      <ProfileContent
        setReViewImageSrc={setReViewImageSrc}
        isEdit={isEdit}
        setIsEdit={handleSetIsEdit}
        page={page}
        avatar={avatar}
        handleSetAvatar={handleSetAvatar}
      />
    )
  } else if (page === 'certificates') {
    selectedContent = <CertificateContent page={page} />
  } else if (page === 'devices') {
    selectedContent = <Devices />
  } else if (page === 'login_history') {
    selectedContent = <LoginHistory />
  } else {
    selectedContent = <div>Page not found</div>
  }

  return (
    <div className="max-w-xxl my-0 mx-auto w-full">
      <div className="relative">
        <ProfileHeader
          reViewImageSrc={reViewImageSrc}
          setReViewImageSrc={setReViewImageSrc}
          setAvatar={handleSetAvatar}
          isEdit={isEdit}
          inputFileRef={inputFileRef}
        ></ProfileHeader>
      </div>
      <div className="flex sm:flex-row flex-col justify-between gap-6">
        <ProfileSideBar page={page}></ProfileSideBar>
        {selectedContent}
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<IProps> = async (
  context,
) => {
  const params = context.query
  if (
    !params?.page ||
    typeof params?.page !== 'string'
    // ||
    // !PROFILE_PAGES[
    //   (params?.page as string)?.toUpperCase() as keyof typeof PROFILE_PAGES
    // ]
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
