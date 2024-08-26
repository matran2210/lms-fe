import Layout from '@components/layout'
import SearchForm from '@components/mycourses/Search'
import BreadcrumbProfile from '@components/profile/BreadCrumbMyprofile'
import Certificate from '@components/profile/Certificate'
import ChangePassword from '@components/profile/ChangePassword'
import Devices from '@components/profile/Devices'
import LoginHistory from '@components/profile/LoginHistory'
import ProfileContent from '@components/profile/ProfileContent'
import ProfileHeader from '@components/profile/ProfileHeader'
import ProfileSideBar from '@components/profile/ProfileSideBar'
import { GetServerSideProps } from 'next'
import Image, { StaticImageData } from 'next/image'
import { useRef, useState } from 'react'
import { ANIMATION } from 'src/constants'
import { ITabs } from 'src/type'
import { IProfilePages } from 'src/type/Profile'

interface IProps {
  page: IProfilePages
}

const NotFound = () => (
  <div className="grid h-full place-items-center p-6">
    <div className="justifycenter flex flex-col items-center">
      <Image
        src={'/assets/images/image_404.jpg'}
        alt="Image_404"
        width="320"
        height="260"
      />
      <h1 className="mt-3 text-2xl font-bold text-bw-1 md:text-4xl">
        PAGE NOT FOUND
      </h1>
      <p className="mt-3 max-w-dl px-4 text-center text-base text-gray-1">
        We are very sorry for the inconvenience. It looks like you’re trying to
        access a page that has been deleted or never even existed.
      </p>
    </div>
  </div>
)

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
  let breadcrumbs: ITabs[] = [
    {
      link: '/',
      title: 'Profile',
    },
    {
      link: '/',
      title: 'Details',
    },
  ]

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
    selectedContent = <Certificate />
  } else if (page === 'devices') {
    selectedContent = <Devices />
  } else if (page === 'login_history') {
    selectedContent = <LoginHistory />
  } else if (page === 'change_password') {
    selectedContent = <ChangePassword />
  } else {
    selectedContent = <NotFound />
  }

  return (
    <Layout title="My Profile">
      <div className="header border-b border-default bg-white px-4 lg:px-20">
        <div className="mx-auto my-0 flex max-w-xxl py-4.5">
          <SearchForm
            placeholder="Enter name of course..."
            formStyle="w-full flex items-center"
          />
        </div>
      </div>
      <div className="mx-auto my-0 w-full max-w-xxl">
        <div className="main sm:mx-4 lg:mx-0 ">
          <BreadcrumbProfile tabs={breadcrumbs} currentPage={'Detail'} />
        </div>
        <div className="relative" data-aos={ANIMATION.DATA_AOS}>
          <ProfileHeader
            reViewImageSrc={reViewImageSrc}
            setReViewImageSrc={setReViewImageSrc}
            setAvatar={handleSetAvatar}
            isEdit={isEdit}
            inputFileRef={inputFileRef}
          />
        </div>
        <div className="mb-6 flex flex-col items-stretch justify-between gap-6 sm:flex-row">
          <ProfileSideBar page={page} />
          <div
            className="flex-1 flex-grow bg-white pb-6 shadow-box"
            style={{
              height: '600px',
              overflowY: 'auto',
            }}
          >
            {selectedContent}
          </div>
        </div>
      </div>
    </Layout>
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
