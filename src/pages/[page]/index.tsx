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
import { Card, Collapse, CollapseProps, Divider, Tabs } from 'antd'
import Image, { StaticImageData } from 'next/image'
import { CSSProperties, useRef, useState } from 'react'
import { ANIMATION } from 'src/constants'
import withAuthorization from 'src/HOC/withAuthorization'
import { UserType } from 'src/redux/types/User/urser'
import { ITabs, NOTIFICATION_STATUS } from 'src/type'
import { ProfilePages } from 'src/type/Profile'

import {
  convertSlugToTitle,
  getLocalStorageItem,
  removeLocalStorageItem,
} from '@utils/index'

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
import HeaderMobile from '@components/layout/Header/HeaderMobile'
import { CollapseArrowIcon } from '@assets/icons'
import OverviewItemCard from '@components/profile/Overview/OverviewItemCard'
import FullScreenMobile from '@components/profile/Modal/FullScreenMobile'

interface IFullScreenMobile {
  open: boolean
  title: string
  children: React.ReactNode
}

const ProfilePage = () => {
  const dispatch = useAppDispatch()
  const { isAlwaysShowSidebar, isMobileView } = useTailwindBreakpoint()
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [isChangePassword, setIsChangePassword] = useState<boolean>(false)
  const [avatar, setAvatar] = useState<File>()
  const inputFileRef = useRef<HTMLInputElement | null>(null)
  const [reViewImageSrc, setReViewImageSrc] = useState<
    string | StaticImageData
  >()
  const [openFullScreenMobile, setOpenFullScreenMobile] =
    useState<IFullScreenMobile>({
      open: false,
      title: '',
      children: <></>,
    })

  const onOpenFullScreenMobile = (title: string, children: React.ReactNode) => {
    setOpenFullScreenMobile({
      open: true,
      title,
      children,
    })
  }
  const onCloseFullScreenMobile = () => {
    setOpenFullScreenMobile({
      open: false,
      title: '',
      children: <></>,
    })
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
      await authenticationManager.logout()
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

  const myProfileItems: CollapseProps['items'] = [
    {
      key: 'overview',
      label: <p className="text-base font-semibold">Overview</p>,
      children: (
        <MyProfile
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          avatar={avatar}
          handleSetAvatar={handleSetAvatar}
          setReViewImageSrc={setReViewImageSrc}
        />
      ),
      className:
        'mb-4 !border-none !rounded-lg bg-white !shadow-small profile-collapse-item',
    },
    {
      key: 'exam-id',
      label: <p className="text-base font-semibold">Exam ID</p>,
      children: <SubjectList isEdit={isEdit} />,
      className:
        'mb-4 !border-none !rounded-lg bg-white !shadow-small profile-collapse-item',
    },
    {
      key: 'profile',
      label: <p className="text-base font-semibold">Profile</p>,
      children: <ProfileList isEdit={isEdit} />,
      className:
        'mb-4 !border-none !rounded-lg bg-white !shadow-small profile-collapse-item',
    },
  ]
  const mySecurityItems: CollapseProps['items'] = [
    {
      key: 'password',
      label: <p className="text-base font-semibold">Password</p>,
      children: <MyPasword setIsChangePassword={setIsChangePassword} />,
      className:
        'mb-4 !border-none !rounded-lg bg-white !shadow-small profile-collapse-item',
    },
    {
      key: 'device-list',
      label: <p className="text-base font-semibold">Browser</p>,
      children: <DeviceList />,
      className:
        'mb-4 !border-none !rounded-lg bg-white !shadow-small profile-collapse-item',
    },
    {
      key: 'login-history',
      label: <p className="text-base font-semibold">Log in History</p>,
      children: <LoginHistoryList />,
      className:
        'mb-4 !border-none !rounded-lg bg-white !shadow-small profile-collapse-item',
    },
  ]

  const mobileOverviewItems = [
    {
      key: 'my-profile',
      label: (
        <TabHeaderItem icon={<Icon type="my-profile" />} title="My profile" />
      ),
      children: (
        <Collapse
          bordered={false}
          expandIconPosition="end"
          defaultActiveKey={['overview', 'exam-id', 'profile']}
          expandIcon={({ isActive }) => (
            <CollapseArrowIcon selected={isActive} />
          )}
          items={myProfileItems}
          className="bg-gray-canvas p-0"
          rootClassName="mobile-collapse"
        />
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
        <Collapse
          bordered={false}
          expandIconPosition="end"
          defaultActiveKey={['password', 'device-list', 'login-history']}
          expandIcon={({ isActive }) => (
            <CollapseArrowIcon selected={isActive} />
          )}
          items={mySecurityItems}
          className="bg-gray-canvas p-0"
          rootClassName="mobile-collapse"
        />
      ),
    },
  ]

  return (
    <Layout
      title="My Profile"
      size="sm"
      showSidebar={isAlwaysShowSidebar}
      fullWidth={isMobileView}
    >
      <div className="mt-2 flex h-full w-full flex-col px-4 md:mt-0 md:px-0">
        <div className="hidden border-b border-[#DCDDDD] bg-white px-4 md:block lg:px-20">
          <div className="mx-auto my-0 flex h-full py-4.5">
            <SearchForm
              placeholder="Enter name of course..."
              formStyle="w-full flex items-center"
            />
          </div>
        </div>
        <div className="mx-auto my-0 flex w-full grow flex-col">
          <div className="main hidden sm:mx-4 md:block lg:mx-0">
            <BreadcrumbProfile tabs={breadcrumbs} currentPage={'Detail'} />
          </div>
          <div className="relative" data-aos={ANIMATION.DATA_AOS}>
            <HeaderMobile title="Student Profile" className="mb-4 md:hidden" />
            <div className="flex flex-col gap-8 bg-transparent md:gap-16 md:bg-white md:px-10 md:py-8 md:shadow-box">
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
                  className="sapp-tabs-profile hidden md:block"
                  defaultActiveKey="my-profile"
                  items={items}
                />

                <div className="flex flex-col gap-3 md:hidden">
                  {mobileOverviewItems.map((item, index) => (
                    <OverviewItemCard
                      key={index}
                      title={item.label}
                      onClick={() =>
                        onOpenFullScreenMobile(
                          convertSlugToTitle(item.key),
                          item.children,
                        )
                      }
                    />
                  ))}
                </div>

                <Divider className="md:hidden" />
                <div
                  className={clsx(
                    'hover-transition-font-weight flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-error-50 p-4 text-base font-medium text-error md:mt-8 lg:hidden',
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
      {isMobileView && openFullScreenMobile.open && (
        <FullScreenMobile
          className="bg-gray-canvas px-4 pb-4"
          title={openFullScreenMobile.title}
          open={openFullScreenMobile.open}
          onClose={onCloseFullScreenMobile}
        >
          {openFullScreenMobile.children}
        </FullScreenMobile>
      )}
    </Layout>
  )
}

export default withAuthorization([UserType.STUDENT])(ProfilePage)
