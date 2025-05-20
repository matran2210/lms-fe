import Icon from '@components/icons'
import Layout from '@components/layout'
import SearchForm from '@components/mycourses/Search'
import BreadcrumbProfile from '@components/profile/BreadCrumbMyprofile'
import Certificate from '@components/profile/Certificate'
import ChangePassword from '@components/profile/ChangePassword'
import Devices from '@components/profile/Devices'
import ExamInfoTab from '@components/profile/ExamInformation/ExamInfoTab'
import LoginHistory from '@components/profile/LoginHistory'
import ProfileContent from '@components/profile/ProfileContent'
import ProfileHeader from '@components/profile/ProfileHeader'
import ProfileSideBar from '@components/profile/ProfileSideBar'
import ProgramDetail from '@components/profile/ProgramDetail'
import Settings from '@components/profile/Settings'
import TabHeaderItem from '@components/tab/TabHeaderItem'
import { Button, Tabs } from 'antd'
import Image, { StaticImageData } from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { ANIMATION } from 'src/constants'
import withAuthorization from 'src/HOC/withAuthorization'
import { UserType } from 'src/redux/types/User/urser'
import { ITabs, NOTIFICATION_STATUS } from 'src/type'
import { IProfilePages, ProfilePages } from 'src/type/Profile'
import { AuthenticationManager } from '@utils/helpers/keycloak'

import { getLocalStorageItem, removeLocalStorageItem } from '@utils/index'

import { useAppDispatch } from 'src/redux/hook'

import { getLogoutUser } from 'src/redux/slice/Login/Login'
import MyProfile from '@components/profile/MyProfile'
import ProfileList from '@components/profile/ProfileInformation/ProfileList'
import SubjectList from '@components/profile/SubjectInformation/SubjectList'

const ProfilePage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const page = router.query.page as IProfilePages
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
          Tab Not Found
        </h1>
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
      link: `/${ProfilePages.OVERVIEW}`,
      title: 'Profile',
    },
    {
      link: `/${ProfilePages.OVERVIEW}`,
      title: 'Details',
    },
  ]
  const items = [
    {
      key: 'my-profile',
      label: (
        <TabHeaderItem icon={<Icon type="my-profile" />} title="My profile" />
      ),
      children: (
        <>
          <MyProfile
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            avatar={avatar}
            handleSetAvatar={handleSetAvatar}
            setReViewImageSrc={setReViewImageSrc}
            onOpenTab={() => {}}
          />
          <SubjectList isEdit={isEdit} />
          <ProfileList isEdit={isEdit} />
        </>
      ),
    },
    {
      key: 'certificates',
      label: (
        <TabHeaderItem
          icon={<Icon type="certificates" />}
          title="Certificates"
        />
      ),
      children: <Certificate />,
    },
    {
      key: 'setting',
      label: <TabHeaderItem icon={<Icon type="setting" />} title="Setting" />,
      children: <Settings onBack={() => setSelectPage(true)} />,
    },
    {
      key: 'sercurity',
      label: (
        <TabHeaderItem icon={<Icon type="sercurity" />} title="Sercurity" />
      ),
      children: (
        <>
          <ChangePassword onOpenTab={() => setSelectPage(true)} />
          <Devices onOpenTab={() => setSelectPage(true)} />
          <LoginHistory onOpenTab={() => setSelectPage(true)} />
        </>
      ),
    },
  ]
  let selectedContent: JSX.Element | null = null

  switch (page) {
    case ProfilePages.Certificates:
      selectedContent = <Certificate />
      break

    case ProfilePages.Devices:
      selectedContent = <Devices onOpenTab={() => setSelectPage(true)} />
      break

    case ProfilePages.LoginHistory:
      selectedContent = <LoginHistory onOpenTab={() => setSelectPage(true)} />
      break

    case ProfilePages.ChangePassword:
      selectedContent = <ChangePassword onOpenTab={() => setSelectPage(true)} />
      break

    case ProfilePages.Settings:
      selectedContent = <Settings onBack={() => setSelectPage(true)} />
      break

    case ProfilePages.OVERVIEW:
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
      break

    case ProfilePages.CFA:
      selectedContent = (
        <ProgramDetail
          typeProgram="CFA"
          onOpenTab={() => setSelectPage(true)}
        />
      )
      break

    case ProfilePages.CMA:
      selectedContent = (
        <ProgramDetail
          typeProgram="CMA"
          onOpenTab={() => setSelectPage(true)}
        />
      )
      break

    case ProfilePages.ACCA:
      selectedContent = (
        <ProgramDetail
          typeProgram="ACCA"
          onOpenTab={() => setSelectPage(true)}
        />
      )
      break

    case ProfilePages.ExamInformation:
      selectedContent = <ExamInfoTab onBack={() => setSelectPage(true)} />
      break

    default:
      selectedContent = <NotFound />
      break
  }
  const handleResize = () => {
    if (window.innerWidth < 1024) {
      setSelectPage(false)
    } else {
      setSelectPage(true)
    }
  }
  const handleLogout = async () => {
    try {
      await dispatch(getLogoutUser()).then(() => {
        const pinnedStatus = getLocalStorageItem('pinnedStatus')
        if (pinnedStatus === NOTIFICATION_STATUS.SHOWING) {
          removeLocalStorageItem('pinnedId')
        }
      })
      const authenticationManager = new AuthenticationManager()
      await authenticationManager.logout(window.location.origin)
    } catch (error) {}
  }
  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setSelectPage(window.innerWidth >= 1024)
  }, [page])

  return (
    <Layout title="My Profile">
      <div className="flex h-full w-full flex-col">
        <div className="border-b border-default bg-white px-4 lg:px-20">
          <div className="mx-auto my-0 flex h-full max-w-xxl py-4.5">
            <SearchForm
              placeholder="Enter name of course..."
              formStyle="w-full flex items-center"
            />
          </div>
        </div>
        <div className="mx-auto my-0 flex w-full max-w-xxl grow flex-col px-5 xl:px-0">
          <div className="main sm:mx-4 lg:mx-0 ">
            <BreadcrumbProfile tabs={breadcrumbs} currentPage={'Detail'} />
          </div>
          <div className="relative" data-aos={ANIMATION.DATA_AOS}>
            <div className="flex flex-col gap-16 bg-white px-10 py-8 shadow-box">
              <ProfileHeader
                reViewImageSrc={reViewImageSrc}
                setReViewImageSrc={setReViewImageSrc}
                setAvatar={handleSetAvatar}
                isEdit={isEdit}
                inputFileRef={inputFileRef}
              />
              <Tabs
                tabBarExtraContent={
                  <div
                    className="hover-transition-font-weight flex cursor-pointer items-center gap-2 font-bold text-danger-6"
                    onClick={handleLogout}
                  >
                    <Icon type="logout" className="font-normal" />
                    <div>Logout</div>
                  </div>
                }
                className="sapp-tabs-profile"
                defaultActiveKey="my-profile"
                items={items}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default withAuthorization([UserType.STUDENT])(ProfilePage)
