import Icon from '@components/icons'
import Certificate from '@components/v2/profile/Certificate'
import ChangePassword from '@components/v2/profile/ChangePassword'
import LoginHistoryList from '@components/v2/profile/LoginHistory/LoginHistoryList'
import ProfileHeader from '@components/v2/profile/ProfileHeader'
import Settings from '@components/v2/profile/Settings'
import TabHeaderItem from '@components/v2/tab/TabHeaderItem'
import { AuthenticationManager } from '@utils/helpers/keycloak'
import { Collapse, CollapseProps, Divider, Tabs } from 'antd'
import Image, { StaticImageData } from 'next/image'
import { useEffect, useRef, useState } from 'react'
import {
  ANIMATION,
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  PageLink,
} from 'src/constants'
import withAuthorization from 'src/HOC/withAuthorization'
import { UserType } from 'src/redux/types/User/urser'
import { ITabs, NOTIFICATION_STATUS } from 'src/type'
import { ProfilePages } from 'src/type/Profile'
import { IDeviceItem } from 'src/type/v2'

import {
  convertSlugToTitle,
  getLocalStorageItem,
  removeLocalStorageItem,
} from '@utils/index'

import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import DeviceList from '@components/v2/profile/DeviceInformation/DeviceList'
import MyProfile from '@components/v2/profile/MyProfile'
import ProfileList from '@components/v2/profile/ProfileInformation/ProfileList'
import MyPasword from '@components/v2/profile/Security/MyPasword'
import SubjectList from '@components/v2/profile/SubjectInformation/SubjectList'
import { getLogoutUser } from 'src/redux/slice/Login/Login'
import Footer from '@components/v2/layout/Footer'
import clsx from 'clsx'
import { useTailwindBreakpoint } from 'src/hooks/useTailwindBreakpoint'
import HeaderMobile from '@components/v2/layout/Header/HeaderMobile'
import { CollapseArrowIcon } from '@assets/icons'
import OverviewItemCard from '@components/v2/profile/Overview/OverviewItemCard'
import FullScreenMobile from '@components/v2/profile/Modal/FullScreenMobile'
import { getLoginHistory, userReducer } from 'src/redux/slice/User/User'
import UserApi from 'src/redux/services/User/user'
import { useRouter } from 'next/router'
import { useCourseContext } from '@contexts/index'
import SappBreadCrumbs from '@components/v2/base/breadcrumb/SappBreadCrumbs'
import SearchWithMenuToggle from '@components/v2/layout/Header/SearchWithMenuToggle'
import Layout from '@components/v2/layout'
interface IFullScreenMobile {
  open: boolean
  title: string
  children: React.ReactNode
}

const ProfilePage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { loginHistory } = useAppSelector(userReducer)
  const { isAlwaysShowSidebar, isMobileView } = useTailwindBreakpoint()
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [isChangePassword, setIsChangePassword] = useState<boolean>(false)
  const [avatar, setAvatar] = useState<File>()
  const inputFileRef = useRef<HTMLInputElement | null>(null)
  const [listDevices, setListDevices] = useState<IDeviceItem[]>()
  const [reViewImageSrc, setReViewImageSrc] = useState<
    string | StaticImageData
  >()
  const [openFullScreenMobile, setOpenFullScreenMobile] =
    useState<IFullScreenMobile>({
      open: false,
      title: '',
      children: <></>,
    })
  const { setOpenSidebar } = useCourseContext()
  const [showSidebar, setShowSidebar] = useState(false)
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
        <h1 className="mt-3 text-2xl font-bold text-gray-v2-800 md:text-4xl">
          Tab Not Found
        </h1>
      </div>
    </div>
  )
  /**
   * @description handle open and close sidebar
   */
  const handleOpenSidebar = () => {
    setShowSidebar(true)
    setOpenSidebar(true)
  }
  const handleCloseSidebar = () => {
    setShowSidebar(false)
    setOpenSidebar(false)
  }
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
  const getListDevices = async () => {
    const res = await UserApi.getListDevices()
    setListDevices(res.data)
  }

  useEffect(() => {
    dispatch(
      getLoginHistory({
        page_index: DEFAULT_PAGE_NUMBER,
        page_size: DEFAULT_PAGE_SIZE,
        type: 'login',
      }),
    )
    getListDevices()
  }, [])
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
            <div className="flex flex-col">
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
      label: (
        <p className="text-base font-semibold text-gray-v2-800">Overview</p>
      ),
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
      label: (
        <p className="text-base font-semibold text-gray-v2-800">Exam ID</p>
      ),
      children: <SubjectList isEdit={isEdit} />,
      className:
        'mb-4 !border-none !rounded-lg bg-white !shadow-small profile-collapse-item',
    },
    {
      key: 'profile',
      label: (
        <p className="text-base font-semibold text-gray-v2-800">Profile</p>
      ),
      children: <ProfileList isEdit={isEdit} />,
      className:
        'mb-4 !border-none !rounded-lg bg-white !shadow-small profile-collapse-item',
    },
  ]
  const mySecurityItems: CollapseProps['items'] = [
    {
      key: 'password',
      label: (
        <p className="text-base font-semibold text-gray-v2-800">Password</p>
      ),
      children: <MyPasword setIsChangePassword={setIsChangePassword} />,
      showArrow: false,
      collapsible: 'icon',
      className:
        'mb-4 !border-none !rounded-lg bg-white !shadow-small profile-collapse-item',
    },
    {
      key: 'device-list',
      label: (
        <CollapseListLabel
          title="Browser"
          subtitle="These are browsers that you logged on"
          count={listDevices?.length || 0}
        />
      ),
      children: <DeviceList />,
      className:
        'mb-4 !border-none !rounded-lg bg-white !shadow-small profile-collapse-item',
    },
    {
      key: 'login-history',
      label: (
        <CollapseListLabel
          title="Log in History"
          subtitle="These are IP adresses that logged in"
          count={loginHistory?.meta?.total_records || 0}
        />
      ),
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
      children: loginHistory && (
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
    <Layout title="My Profile">
      <div className="mt-2 flex h-full w-full flex-col px-4 md:mt-0 md:px-0">
        <SearchWithMenuToggle
          handleOpenSidebar={handleOpenSidebar}
          isShowToggle
          className={'hidden md:flex'}
        />
        <div className="mx-auto my-0 flex w-full grow flex-col">
          <div className="main hidden sm:mx-4 md:mb-6 md:block lg:mx-0 lg:mb-4">
            <div className="hidden text-2xl font-medium md:block lg:hidden">
              Student Profile
            </div>
            <SappBreadCrumbs isTeacher={false} breadcrumbs={breadcrumbs} />
          </div>
          <div className="relative" data-aos={ANIMATION.DATA_AOS}>
            <HeaderMobile
              title="Student Profile"
              className="mb-4 md:hidden"
              onBack={() => router.push(`${PageLink.COURSES}`)}
            />
            <div className="flex flex-col gap-8 rounded-2xl bg-transparent md:gap-12 md:bg-white md:p-6 md:shadow-card lg:gap-16 lg:px-10 lg:py-8">
              <ProfileHeader
                reViewImageSrc={reViewImageSrc}
                setReViewImageSrc={setReViewImageSrc}
                setAvatar={handleSetAvatar}
                avatar={avatar}
                isEdit={isEdit}
                inputFileRef={inputFileRef}
                setIsEdit={setIsEdit}
              />
              <div>
                <Tabs
                  tabBarExtraContent={
                    <div
                      className="hover-transition-font-weight hidden cursor-pointer items-center gap-2 font-bold text-error-v2-DEFAULT lg:flex"
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
                    'hover-transition-font-weight flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-error-v2-50 p-4 text-base font-medium text-error-v2-DEFAULT md:mt-8 lg:hidden',
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

const CollapseListLabel = ({
  title,
  subtitle,
  count,
}: {
  title: string
  subtitle: string
  count: number
}) => (
  <div>
    <p className="mb-2 text-base font-semibold">
      {title}{' '}
      <span className="text-base font-normal text-secondary-v2-300">
        ({count})
      </span>
    </p>
    <p className="text-sm">{subtitle}</p>
  </div>
)

export default withAuthorization([UserType.STUDENT])(ProfilePage)
