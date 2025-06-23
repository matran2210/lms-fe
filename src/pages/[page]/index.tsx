import Icon from '@components/icons'
import Layout from '@components/layout'
import SearchForm from '@components/mycourses/Search'
import BreadcrumbProfile from '@components/profile/BreadCrumbMyprofile'
import Certificate from '@components/profile/Certificate'
import ChangePassword from '@components/profile/ChangePassword'
import LoginHistoryList from '@components/profile/LoginHistory/LoginHistoryList'
import ProfileHeader from '@components/profile/ProfileHeader'
import Settings from '@components/profile/Settings'
import TabHeaderItem from '@components/tab/TabHeaderItem'
import { AuthenticationManager } from '@utils/helpers/keycloak'
import { Tabs } from 'antd'
import Image, { StaticImageData } from 'next/image'
import { useRef, useState } from 'react'
import { ANIMATION } from 'src/constants'
import withAuthorization from 'src/HOC/withAuthorization'
import { UserType } from 'src/redux/types/User/urser'
import { ITabs, NOTIFICATION_STATUS } from 'src/type'
import { ProfilePages } from 'src/type/Profile'

import { getLocalStorageItem, removeLocalStorageItem } from '@utils/index'

import { useAppDispatch } from 'src/redux/hook'

import DeviceList from '@components/profile/DeviceInformation/DeviceList'
import MyProfile from '@components/profile/MyProfile'
import ProfileList from '@components/profile/ProfileInformation/ProfileList'
import MyPasword from '@components/profile/Security/MyPasword'
import SubjectList from '@components/profile/SubjectInformation/SubjectList'
import { getLogoutUser } from 'src/redux/slice/Login/Login'
import Footer from '@components/layout/Footer'
import ButtonDanger from '@components/base/button/ButtonDanger'
import clsx from 'clsx'
import { useTailwindBreakpoint } from 'src/hooks/useTailwindBreakpoint'

const ProfilePage = () => {
  const dispatch = useAppDispatch()
  const screens = useTailwindBreakpoint()
  const isAlwaysShowSidebar = ['lg', 'xl', '2xl', '3xl', '4xl'].includes(
    screens,
  )
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [isChangePassword, setIsChangePassword] = useState<boolean>(false)
  const [avatar, setAvatar] = useState<File>()
  const inputFileRef = useRef<HTMLInputElement | null>(null)
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
        <h1 className="mt-3 text-2xl font-bold text-[#050505] md:text-4xl">
          Tab Not Found
        </h1>
      </div>
    </div>
  )

  const handleSetAvatar = (avatar: File | undefined) => {
    setAvatar(avatar)
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
      children: <Settings onBack={() => {}} />,
    },
    {
      key: 'sercurity',
      label: (
        <TabHeaderItem icon={<Icon type="sercurity" />} title="Sercurity" />
      ),
      children: (
        <>
          {isChangePassword ? (
            <ChangePassword handleCancel={() => setIsChangePassword(false)} />
          ) : (
            <div className="flex flex-col gap-0 lg:gap-10">
              <MyPasword setIsChangePassword={setIsChangePassword} />
              <DeviceList />
              <LoginHistoryList />
            </div>
          )}
        </>
      ),
    },
  ]

  return (
    <Layout title="My Profile" size="sm" showSidebar={isAlwaysShowSidebar}>
      <div className="flex h-full w-full flex-col">
        <div className="border-b border-[#DCDDDD] bg-white px-4 lg:px-20">
          <div className="py-4.5 mx-auto my-0 flex h-full">
            <SearchForm
              placeholder="Enter name of course..."
              formStyle="w-full flex items-center"
            />
          </div>
        </div>
        <div className="mx-auto my-0 flex w-full grow flex-col">
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
              <div>
                <Tabs
                  tabBarExtraContent={
                    <div
                      className="hover-transition-font-weight hidden cursor-pointer items-center gap-2 font-bold text-error lg:flex"
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
                <div
                  className={clsx(
                    'hover-transition-font-weight mt-8 flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-error-50 p-4 text-base font-medium text-error md:flex lg:hidden',
                    {
                      '!hidden': isEdit || isChangePassword,
                    },
                  )}
                  onClick={handleLogout}
                >
                  <Icon type="logout" className="font-normal" />
                  <div>Logout</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </Layout>
  )
}

export default withAuthorization([UserType.STUDENT])(ProfilePage)
