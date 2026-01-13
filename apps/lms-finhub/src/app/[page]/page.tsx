'use client'
import { CollapseArrowIcon, Icon } from '@lms/assets'
import {
  UserType,
  getLoginHistory,
  getLogoutUser,
  useCourseContext,
  userReducer,
} from '@lms/contexts'
import {
  ANIMATION,
  AppType,
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  IDeviceItem,
  NOTIFICATION_STATUS,
} from '@lms/core'
import {
  Certificate,
  ChangePassword,
  DeviceList,
  LoginHistoryList,
  MyPasword,
  MyProfile,
  OverviewItemCard,
  ProfileHeader,
  ProfileList,
  Settings,
} from '@lms/feature-user'
import { useTailwindBreakpoint } from '@lms/hooks'
import {
  Footer,
  FullScreenMobile,
  HeaderMobile,
  SearchWithMenuToggle,
  TabHeaderItem,
} from '@lms/ui'
import {
  convertSlugToTitle,
  getLocalStorageItem,
  removeLocalStorageItem,
} from '@lms/utils'
import { AuthenticationManager } from '@utils/helpers/keycloak'
import { Collapse, CollapseProps, Divider, Tabs } from 'antd'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { StaticImageData } from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { PageLink } from 'src/constants/routes'

import withAuthorization from 'src/HOC/withAuthorization'
import UserApi from 'src/redux/services/User/user'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import Layout from '@components/layout'

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

  // Animation states
  const [activeTab, setActiveTab] = useState('my-profile')
  const [tabAnimating, setTabAnimating] = useState(false)

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
      await dispatch(
        getLogoutUser({ authManager: new AuthenticationManager() }),
      ).then(() => {
        const pinnedStatus = getLocalStorageItem('pinnedStatus')
        if (pinnedStatus === NOTIFICATION_STATUS.SHOWING) {
          removeLocalStorageItem('pinnedId')
        }
      })
    } catch (error) {
      // ignore
    }
  }
  const getListDevices = async () => {
    const res = await UserApi.getListDevices()
    setListDevices(res)
  }

  const handleTabChange = (newTab: string) => {
    if (newTab === activeTab) return

    setTabAnimating(true)
    setActiveTab(newTab)

    setTimeout(() => {
      setTabAnimating(false)
    }, 500)
  }

  useEffect(() => {
    dispatch(
      getLoginHistory({
        api: UserApi,
        page_index: DEFAULT_PAGE_NUMBER,
        page_size: DEFAULT_PAGE_SIZE,
        type: 'login',
      }),
    )
    getListDevices()
  }, [])

  const getTabContent = (key: string) => {
    switch (key) {
      case 'my-profile':
        return (
          <>
            <MyProfile
              isEdit={isEdit}
              setIsEdit={setIsEdit}
              avatar={avatar}
              handleSetAvatar={handleSetAvatar}
              setReViewImageSrc={setReViewImageSrc}
              appType={AppType.LMS_FINHUB}
            />
            <ProfileList isEdit={isEdit} />
          </>
        )
      case 'certificates':
        return <Certificate />
      case 'setting':
        return <Settings />
      case 'security':
        return (
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
        )
      default:
        return null
    }
  }

  const items = [
    {
      key: 'my-profile',
      label: (
        <TabHeaderItem icon={<Icon type="my-profile" />} title="My profile" />
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
    },
    {
      key: 'setting',
      label: <TabHeaderItem icon={<Icon type="setting" />} title="Setting" />,
    },
    {
      key: 'security',
      label: (
        <TabHeaderItem icon={<Icon type="sercurity" />} title="Security" />
      ),
    },
  ]

  const myProfileItems: CollapseProps['items'] = [
    {
      key: 'overview',
      label: <p className="text-base font-semibold text-gray-800">Overview</p>,
      children: (
        <MyProfile
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          avatar={avatar}
          handleSetAvatar={handleSetAvatar}
          setReViewImageSrc={setReViewImageSrc}
          appType={AppType.LMS_FINHUB}
        />
      ),
      className:
        'mb-4 !border-none !rounded-lg bg-white !shadow-small profile-collapse-item',
    },
    {
      key: 'profile',
      label: <p className="text-base font-semibold text-gray-800">Profile</p>,
      children: <ProfileList isEdit={isEdit} />,
      className:
        'mb-4 !border-none !rounded-lg bg-white !shadow-small profile-collapse-item',
    },
  ]
  const mySecurityItems: CollapseProps['items'] = [
    {
      key: 'password',
      label: <p className="text-base font-semibold text-gray-800">Password</p>,
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
      children: <Settings />,
    },
    {
      key: 'security',
      label: <TabHeaderItem icon={<Icon type="security" />} title="Security" />,
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
    <Layout
      title="My Profile"
      size="sm"
      showSidebar={showSidebar || isAlwaysShowSidebar}
      handleToggleSidebar={handleCloseSidebar}
      fullWidth={isMobileView}
    >
      <div className="mt-2 flex h-full w-full flex-col px-4 md:mt-0 md:px-0">
        <SearchWithMenuToggle
          handleOpenSidebar={handleOpenSidebar}
          isShowToggle
          className={'mb-4 hidden md:flex'}
          redirectLink={PageLink.SHORT_COURSE}
          appType={AppType.LMS_FINHUB}
        />
        <div className="mx-auto my-0 flex w-full grow flex-col">
          <div className="main hidden sm:mx-4 md:mb-6 md:block lg:mx-0 lg:mb-4">
            <div className="hidden text-2xl font-medium md:block lg:hidden">
              Student Profile
            </div>
            <h1 className="text-lg font-semibold text-gray-800 lg:mt-4 lg:text-2xl">
              Profile
            </h1>
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
                appType={AppType.LMS_FINHUB}
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
                  activeKey={activeTab}
                  onChange={handleTabChange}
                  items={items}
                  renderTabBar={(props, DefaultTabBar) => (
                    <DefaultTabBar {...props} />
                  )}
                />

                {/* Tab content with animation */}
                <div className="tab-content-container relative hidden md:block">
                  {/* Current tab - sliding in */}
                  <div
                    key={activeTab}
                    className={clsx(
                      'tab-content',
                      tabAnimating && 'tab-content-enter',
                    )}
                  >
                    {getTabContent(activeTab)}
                  </div>
                </div>

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
          className="h-full bg-gray-canvas px-4 pb-4"
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
      <span className="text-base font-normal text-secondary-300">
        ({count})
      </span>
    </p>
    <p className="text-sm">{subtitle}</p>
  </div>
)

export default withAuthorization([UserType.STUDENT])(ProfilePage)
