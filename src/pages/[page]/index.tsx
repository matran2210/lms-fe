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
import { useEffect, useRef, useState } from 'react'
import Image, { StaticImageData } from 'next/image'
import { ANIMATION } from 'src/constants'
import { ITabs } from 'src/type'
import { IProfilePages } from 'src/type/Profile'
import CertificateContent from '@components/profile/CertificateContent'
import SappButton from '@components/base/button/SappButton'

interface IProps {
  page: IProfilePages
}

const ProfilePage = ({ page }: any) => {
  // const router = useRouter()
  // const page = router.query.page as IProfilePages
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [avatar, setAvatar] = useState<File>()
  const inputFileRef = useRef<HTMLInputElement | null>(null)
  const [isSelectPage, setSelectPage] = useState<boolean>(false)
  const [reViewImageSrc, setReViewImageSrc] = useState<
    string | StaticImageData
  >()

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
          We are very sorry for the inconvenience. It looks like you’re trying
          to access a page that has been deleted or never even existed.
        </p>
        <SappButton
          title={'Back'}
          onClick={() => setSelectPage(true)}
          className="mt-3"
        />
      </div>
    </div>
  )

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
        onOpenTab={() => setSelectPage(true)}
      />
    )
  } else if (page === 'certificates') {
    selectedContent = (
      <CertificateContent onOpenTab={() => setSelectPage(true)} />
    )
  } else if (page === 'devices') {
    selectedContent = <Devices onOpenTab={() => setSelectPage(true)} />
  } else if (page === 'login_history') {
    selectedContent = <LoginHistory onOpenTab={() => setSelectPage(true)} />
  } else if (page === 'change_password') {
    selectedContent = <ChangePassword onOpenTab={() => setSelectPage(true)} />
  } else {
    selectedContent = <NotFound />
  }
  const handleResize = () => {
    if (window.innerWidth < 1024) {
      setSelectPage(false)
    } else {
      setSelectPage(true)
    }
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setSelectPage(window.innerWidth > 1024)
  }, [page])

  return (
    <Layout title="My Profile">
      <div className="flex h-full w-full flex-col">
        <div className="header border-b border-default bg-white px-4 lg:px-20">
          <div className="mx-auto my-0 flex h-full max-w-xxl py-4.5">
            <SearchForm
              placeholder="Enter name of course..."
              formStyle="w-full flex items-center"
            />
          </div>
        </div>
        <div className="mx-auto my-0 flex w-full max-w-xxl grow flex-col px-5 lg:px-0">
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
          <div className="mb-6 flex w-full flex-grow flex-col items-stretch justify-between gap-6 sm:flex-row">
            {isSelectPage && (
              <ProfileSideBar page={page}>{selectedContent}</ProfileSideBar>
            )}
            {!isSelectPage && (
              <div className="mb-6 block w-full grow bg-white lg:mb-0 lg:hidden lg:grow-0">
                {selectedContent}
              </div>
            )}
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
