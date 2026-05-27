import { BlankAvatarImage, ExpandIcon } from '@lms/assets'
import {
  activeNotesList3Level,
  clearNotifications,
  openCalculator3Level,
  pushNotes3Level,
  userReducer,
} from '@lms/contexts'
import {
  CourseInfo,
  LANG_SIGNIN,
  MenuItemProps,
  ROUTES,
  TitleSidebar,
} from '@lms/core'
import { useNotification } from '@lms/hooks'
import { trackGAEvent } from '@lms/utils'
import { Divider } from 'antd'
import clsx from 'clsx'
import { isEmpty } from 'lodash'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { v4 as uuidv4 } from 'uuid'
import MenuItemsList from './MenuItemsList'

const SappNotificationComponent = dynamic(
  () => import('@sapp-fe/sapp-notification'),
  { ssr: false },
)
import { PageLink } from 'src/constants/routes'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation'
import { NotificationAPI } from 'src/api/notification'
export default function MenuItem({
  menuItem: { name, icon: Icon, url, type, subItems },
  closeSideBar,
  isVisible,
}: MenuItemProps) {
  const {
    isViewDetail,
    openNotification,
    setOpenNotification,
    selectedTab,
    setSelectedTab,
    notifyDetail,
    notifyLists,
    scrollRef,
    handleMarkAll,
    handleMarkById,
    handleUnMarkById,
    handleViewDetail,
    handleBack,
    refreshNotification,
    isDesktopView,
    notificationUnread,
  } = useNotification(NotificationAPI)

  const isLoading = useAppSelector((state) => state.notificationReducer.loading)

  const tabs = [
    {
      id: 1,
      title: 'All Notifications',
    },
    {
      id: 2,
      title: `Unread ${notificationUnread ? `(${notificationUnread})` : ''}`,
    },
  ]

  const pathname = usePathname()

  useEffect(() => {
    if (selectedTab) {
      dispatch(clearNotifications())
    }
  }, [selectedTab])

  const [isExpanded, toggleExpanded] = useState(false)
  const dispatch = useAppDispatch()
  const { user } = useAppSelector(userReducer)
  const router = useRouter()
  const params = useParams()

  const isNested = subItems && subItems?.length > 0

  const onClick = () => {
    toggleExpanded((prev) => !prev)
  }

  const handleOpenNotesList = () => {
    dispatch(activeNotesList3Level())
    document.body.style.overflow = 'hidden'
  }

  const handleAddNote = () => {
    const note = {
      uuid: uuidv4(),
      id: '',
      name: 'Note',
      description: '',
    }
    dispatch(pushNotes3Level(note))
  }

  const handleOpenCalculator = () => {
    dispatch(openCalculator3Level())
  }

  const handleViewNotification = (link: string) => {
    router.push(link)
  }

  const handleActive = () => {
    if (url === PageLink.NOTIFICATION) {
      setOpenNotification(true)
      if (isEmpty(notifyLists)) {
        refreshNotification(false)
      }
    }
    if (params?.courseId || params.id) {
      name === TitleSidebar.NOTES_LIST && handleOpenNotesList()
      name === TitleSidebar.ADD_NOTE && handleAddNote()
      name === TitleSidebar.CALCULATOR && handleOpenCalculator()
      // name === TitleSidebar.COURSE_RESOURCES && handleOpenCourseResource()
    }
  }

  const searchParams = useSearchParams()

  const asPath = pathname + (searchParams.toString() ? `?${searchParams}` : '')

  const isActivity = params?.courseId && params?.id
  const isInMyProfile = asPath === PageLink.SHORT_COURSE_PROFILE

  const selected = pathname === url
  // ? true
  // : isActivity
  //   ? name === TitleSidebar.COURSE_CONTENT
  //   : name === TitleSidebar.COURSES

  const checkIsHiddenDashboard = (info: CourseInfo) => {
    return name == TitleSidebar.DASHBOARD && !info
  }

  const renderMenuContent = () => {
    return (
      <div className="flex items-center" onClick={handleActive}>
        {Icon === 'avatar' ? (
          <div
            className={clsx('h-10 w-10 shrink-0', {
              'rounded-full !border-2 border-primary': isInMyProfile,
            })}
          >
            {user?.detail?.avatar &&
            (user.detail.avatar['40x40'] || user.detail.avatar['ORIGIN']) ? (
              <Image
                src={
                  user?.detail?.avatar['40x40'] ||
                  user?.detail?.avatar['ORIGIN']
                }
                alt="avatar"
                className="h-10 w-10 rounded-full object-cover"
                width={40}
                height={40}
                priority={true}
              />
            ) : (
              <Image
                src={BlankAvatarImage}
                alt="avatar"
                className="rounded-full"
                width={40}
                height={40}
                priority={true}
              />
            )}
          </div>
        ) : (
          <>
            {Icon === 'profile-detail' ? (
              <div className="h-10 w-10 shrink-0">
                <Image
                  src={
                    user?.detail?.avatar?.['40x40'] ||
                    user?.detail?.avatar?.['ORIGIN'] ||
                    BlankAvatarImage
                  }
                  alt="avatar"
                  className="h-10 w-10 rounded-full object-cover"
                  width={40}
                  height={40}
                  priority={true}
                />
              </div>
            ) : (
              <ExpandIcon
                type={Icon}
                className={clsx(
                  `before-icon min-h-6 min-w-6 shrink-0 ${
                    selected ? 'bg-primary text-white' : 'text-gray-800'
                  }`,
                  {
                    'group-hover:text-gray-800': !selected,
                  },
                )}
              />
            )}
          </>
        )}
        {Icon === 'avatar' ? (
          <div
            className={clsx(
              `label avatar invisible pl-4 text-base font-normal opacity-0 transition-all duration-150 ${
                selected ? 'bg-primary text-white' : 'text-gray-800'
              }`,
              {
                'group-hover:text-gray-800': !selected,
                '!visible !opacity-100': isVisible,
              },
            )}
          >
            <div
              className={clsx(
                'line-clamp-1 text-base font-semibold text-[#050505]',
                {
                  'group-hover:text-gray-800': !selected,
                  '!text-primary': isInMyProfile,
                },
              )}
            >
              {user?.detail?.full_name}
            </div>
            <div
              className={clsx(
                'line-clamp-1 text-sm font-normal capitalize text-[#A1A1A1]',
                {
                  'group-hover:text-gray-800': !selected,
                  '!text-primary': isInMyProfile,
                },
              )}
            >
              {/* Removed role text under avatar */}
            </div>
          </div>
        ) : (
          <>
            {Icon === 'profile-detail' ? (
              <span
                className={clsx(
                  `label invisible line-clamp-1 pl-4 text-base font-normal opacity-0 transition-all duration-150 ${
                    selected ? 'bg-primary text-white' : 'text-gray-800'
                  }`,
                  {
                    'group-hover:text-gray-800': !selected,
                    '!visible !opacity-100': isVisible,
                  },
                )}
              >
                {user?.detail?.full_name}
              </span>
            ) : (
              <span
                className={clsx(
                  `label invisible line-clamp-1 pl-4 text-base font-normal opacity-0 transition-all duration-150 ${
                    selected ? 'bg-primary text-white' : 'text-gray-800'
                  }`,
                  {
                    'group-hover:text-gray-800': !selected,
                    '!visible !opacity-100': isVisible,
                  },
                )}
                onClick={() => trackGAEvent(`Click Button ${name} Menu `)}
              >
                {name}
              </span>
            )}
          </>
        )}
      </div>
    )
  }

  const profileUrl = pathname?.startsWith(PageLink.SHORT_COURSE)
    ? `${PageLink.SHORT_COURSE_PROFILE}`
    : `${PageLink.MYPROFILE}`
  return (
    <>
      {isActivity && name === TitleSidebar.CALCULATOR && (
        <div className="mx-auto w-[calc(100%-48px)] text-center">
          <Divider className="my-2 bg-divider" />
        </div>
      )}
      <div
        className={clsx(
          `group cursor-pointer rounded ${
            selected &&
            ((type === 'level-1' &&
              Icon !== 'avatar' &&
              Icon !== 'profile-detail') ||
              (type === 'level-2' && Icon === 'result'))
              ? 'bg-primary text-white'
              : ''
          } sidebar-list-items relative px-4 py-2 last:mb-0 ${
            !isActivity &&
            (name === TitleSidebar.ADD_NOTE || name === TitleSidebar.CALCULATOR)
              ? 'hidden'
              : name === TitleSidebar.CALCULATOR
                ? 'mt-4'
                : ''
          }
        ${
          !isActivity &&
          (name === TitleSidebar.COURSE_CONTENT ||
            name === TitleSidebar.NOTES_LIST ||
            name === TitleSidebar.COURSE_RESOURCES ||
            name === TitleSidebar.ACTIVITY ||
            Icon === 'stats-chart-sharp' ||
            Icon === 'profile-detail')
            ? 'hidden'
            : ''
        }
        ${
          isActivity &&
          (name === TitleSidebar.COURSES ||
            name === TitleSidebar.DASHBOARD ||
            name === LANG_SIGNIN.eventTest ||
            checkIsHiddenDashboard(
              JSON.parse(localStorage.getItem('courseInfo') as string),
            ) ||
            Icon === 'avatar')
            ? 'hidden'
            : ''
        }
       `,
          {
            'hover:bg-gray-100': !selected,
          },
        )}
        onClick={async () => {
          closeSideBar()
          await new Promise((resolve) => setTimeout(resolve, 10))
        }}
      >
        <div
          className={`sidebar-item flex items-center ${
            Icon === 'avatar' || Icon === 'profile-detail' ? '-ml-2' : ''
          }`}
        >
          {url !== '#' && url !== PageLink.NOTIFICATION ? (
            <Link
              href={
                url === PageLink.DASHBOARD
                  ? `${ROUTES.MY_COURSES}${params?.courseId || params?.id}/dashboard`
                  : name === TitleSidebar.COURSE_CONTENT
                    ? `${url}/${params?.courseId || params?.id}`
                    : url === PageLink.MYPROFILE
                      ? profileUrl
                      : url
              }
              passHref
            >
              {renderMenuContent()}
            </Link>
          ) : (
            <>{renderMenuContent()}</>
          )}
          {isNested && type === 'level-2' ? (
            <ExpandIcon
              isExpanded={isExpanded}
              handleClick={onClick}
              type={'ontoggle'}
              className={clsx(`${selected ? 'bg-primary text-white' : ''}`, {
                'group-hover:text-gray-800': !selected,
              })}
            />
          ) : null}
        </div>
        {isNested ? (
          <div
            className={`sidebar-child ${type} ${
              isExpanded && type === 'level-2' ? 'active' : ''
            }`}
          >
            <MenuItemsList
              options={subItems}
              closeSideBar={closeSideBar}
              isVisible={isVisible}
            />
          </div>
        ) : null}
      </div>
      {openNotification && (
        <SappNotificationComponent
          notifyDetail={{
            ...notifyDetail,
            send_time: notifyDetail?.send_time || '', // Ensure send_time is always a string
          }}
          tabs={tabs}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          handleMarkAll={() => handleMarkAll(selectedTab)}
          handleMarkById={(ids: string[]) => handleMarkById(ids, selectedTab)}
          handleUnMarkById={(ids: string[]) =>
            handleUnMarkById(ids, selectedTab)
          }
          handleBack={handleBack}
          isViewDetail={isViewDetail}
          setOpenNotification={setOpenNotification}
          openNotification={openNotification}
          handleViewDetail={handleViewDetail}
          notifyLists={notifyLists}
          notificationUnread={notificationUnread}
          scrollRef={scrollRef}
          handleViewNotification={(link) => handleViewNotification(link)}
          isDesktopView={isDesktopView}
          isLoading={isLoading}
        />
      )}
    </>
  )
}
