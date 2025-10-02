import blankAvatar from '@assets/images/blank_avatar.webp'
import { trackGAEvent } from '@utils/google-analytics'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { PageLink, TitleSidebar } from 'src/constants'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import { openCalculator } from 'src/redux/slice/Course/MyCourse/Activity/Activity'
import { activeNotesList, pushNotes } from 'src/redux/slice/Course/NotesList'
import { userReducer } from 'src/redux/slice/User/User'
import { v4 as uuidv4 } from 'uuid'
import { MenuItem as MenuItemType } from '../../../constants/menu-items'
import ExpandIcon from '../ExpandIcon'
import MenuItemsList from '../MenuItemsList'
import { LANG_SIGNIN } from 'src/constants/lang'
import { isEmpty } from 'lodash'
import {
  getCountUnRead,
  loadMoreNotification,
} from 'src/redux/slice/Notification/Notification'
import SappNotificationComponent from 'sapp-notification'
import { useNotification } from 'src/hooks/useNotification'
import { Divider } from 'antd'
import clsx from 'clsx'

type MenuItemProps = {
  menuItem: MenuItemType
  setOpenResource?: Dispatch<SetStateAction<boolean>>
  closeSideBar: () => void
  setOpenExaminationInfo?: Dispatch<SetStateAction<boolean>>
}

export default function MenuItem({
  menuItem: { name, icon: Icon, url, type, subItems },
  setOpenResource,
  closeSideBar,
  setOpenExaminationInfo,
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
  } = useNotification()

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

  const [isExpanded, toggleExpanded] = useState(false)
  const dispatch = useAppDispatch()
  const { user } = useAppSelector(userReducer)
  const router = useRouter()
  const isNested = subItems && subItems?.length > 0
  const selected = router.pathname === url
  const isFetching = useRef(false)
  const pagination = useAppSelector((state) => state.notificationReducer.meta)

  const onClick = () => {
    toggleExpanded((prev) => !prev)
  }

  const handleOpenResource = () => {
    setOpenResource && setOpenResource(true)
    document.body.style.overflow = 'hidden'
  }

  const handleOpenNotesList = () => {
    dispatch(activeNotesList())
    document.body.style.overflow = 'hidden'
  }

  const handleAddNote = () => {
    const note = {
      uuid: uuidv4(),
      id: '',
      name: 'Note',
      description: '',
    }
    dispatch(pushNotes(note))
  }

  const handleOpenCalculator = () => {
    dispatch(openCalculator())
  }

  const handleOpenCourseContentPage = () => {
    router.push({
      pathname: `/courses/my-course/${router.query.courseId || router.query.id}`,
    })
  }
  const handleOpenResultsPage = () => {
    router.push({
      pathname: `/courses/my-course/${router.query.courseId || router.query.id}/results`,
    })
  }

  const handleViewNotification = (link: string) => {
    router.push({
      pathname: link,
    })
  }

  const handleOpenExaminationInfoPage = () => {
    setOpenExaminationInfo && setOpenExaminationInfo(true)
  }

  const handleActive = () => {
    if (isEmpty(url)) {
      setOpenNotification(true)
      if (isEmpty(notifyLists)) {
        refreshNotification(false)
      }
    }
    if (router?.query?.courseId || router.query.id) {
      name === TitleSidebar.COURSE_CONTENT && handleOpenCourseContentPage()
      name === TitleSidebar.RESOURCES && handleOpenResource()
      name === TitleSidebar.NOTES_LIST && handleOpenNotesList()
      name === TitleSidebar.NEW_NOTE && handleAddNote()
      name === TitleSidebar.CALCULATOR && handleOpenCalculator()
      name === TitleSidebar.RESULTS && handleOpenResultsPage()
      name === TitleSidebar.EXAM && handleOpenExaminationInfoPage()
    }
  }
  const onClickMenuItem = () => {
    if (url !== '#' && !isEmpty(url)) {
      const targetUrl =
        url === PageLink.RESULTS
          ? `/courses/my-course/${router?.query?.courseId || router?.query?.id}/results`
          : url === PageLink.DASHBOARD
            ? `/courses/my-course/${router?.query?.courseId || router?.query?.id}/dashboard`
            : name === TitleSidebar.COURSE_CONTENT
              ? `/courses/my-course/${router?.query?.courseId || router?.query?.id}`
              : url
      router.push({
        pathname: targetUrl,
      })
    }
    closeSideBar()
  }

  function formatName(fullName?: string): string {
    if (!fullName) return ''

    const words = fullName.trim().split(/\s+/)
    const lastTwo = words.slice(-2)
    return lastTwo.join(' ')
  }

  const isActivity = router?.query?.activityId
  const isInCourse =
    router?.query?.courseId ||
    router?.query?.activityId ||
    router?.query?.course_section_id
  const isInMyProfile = router.asPath === PageLink.MYPROFILE
  const checkIsHiddenDashboard = (info: any) => {
    return name == TitleSidebar.DASHBOARD && !info
  }
  const countNotificationsUnRead = async () => {
    try {
      await dispatch(getCountUnRead())
    } catch (error) {}
  }

  useEffect(() => {
    if (openNotification) refreshNotification(false)
  }, [selectedTab])

  useEffect(() => {
    const handleScroll = async () => {
      const scrollEl = scrollRef.current
      if (scrollEl) {
        const { scrollTop, scrollHeight, clientHeight } = scrollEl
        if (scrollTop + clientHeight + 200 >= scrollHeight) {
          const { page_index, page_size, total_pages } = pagination
          // Kiểm tra đã load hết chưa
          if (page_index >= total_pages || isFetching.current) return
          try {
            isFetching.current = true
            await dispatch(
              loadMoreNotification({
                page_index: page_index + 1,
                page_size,
                ...(selectedTab === 2 && {
                  is_read: false,
                }),
              }),
            )
            await countNotificationsUnRead()
          } catch (err) {
          } finally {
            isFetching.current = false
          }
        }
      }
    }

    const scrollEl = scrollRef.current
    scrollEl?.addEventListener('scroll', handleScroll)

    return () => {
      scrollEl?.removeEventListener('scroll', handleScroll)
    }
  }, [pagination])

  const renderMenuContent = () => {
    return (
      <div className="flex items-center" onClick={handleActive}>
        {Icon === 'avatar' ? (
          <div
            className={clsx('h-10 w-10 shrink-0', {
              'rounded-full !border-2 border-primary': isInMyProfile,
            })}
          >
            {user?.detail?.avatar?.['40x40'] ||
            user.detail.avatar?.['ORIGIN'] ? (
              <Image
                src={
                  user.detail.avatar?.['40x40'] ||
                  user.detail.avatar?.['ORIGIN']
                }
                alt="avatar"
                className="h-10 w-10 rounded-full object-cover"
                width={40}
                height={40}
              />
            ) : (
              <Image
                src={blankAvatar}
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
                    user.detail.avatar?.['40x40'] ||
                    user.detail.avatar?.['ORIGIN'] ||
                    blankAvatar
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
              {formatName(user?.detail?.full_name)}
            </div>
            <div
              className={clsx(
                'line-clamp-1 text-sm font-normal capitalize text-[#A1A1A1]',
                {
                  'group-hover:text-gray-800': !selected,
                  '!text-primary': isInMyProfile,
                },
              )}
            ></div>
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
                  },
                )}
              >
                {formatName(user?.detail?.full_name)}
              </span>
            ) : (
              <span
                className={clsx(
                  `label invisible line-clamp-1 pl-4 text-base font-normal opacity-0 transition-all duration-200 ease-in-out ${
                    selected ? 'bg-primary text-white' : 'text-gray-800'
                  }`,
                  {
                    'group-hover:text-gray-800': !selected,
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

  return (
    <>
      {isActivity && name === TitleSidebar.NEW_NOTE && (
        <div className="mx-auto w-[calc(100%-48px)] text-center">
          <Divider className="my-2 bg-[#DCDDDD]" />
        </div>
      )}
      <div
        className={clsx(
          `group transform cursor-pointer rounded transition-all duration-200 ease-in-out ${
            selected &&
            ((type === 'level-1' &&
              Icon !== 'avatar' &&
              Icon !== 'profile-detail') ||
              (type === 'level-2' &&
                (Icon === 'result' || Icon === 'bookmark')))
              ? 'bg-primary text-white'
              : ''
          } sidebar-list-items relative px-4 py-2 last:mb-0 ${
            !isActivity &&
            (name === TitleSidebar.NEW_NOTE || name === TitleSidebar.CALCULATOR)
              ? 'hidden'
              : ''
          }
        ${
          !isInCourse &&
          (name === TitleSidebar.COURSE_CONTENT ||
            name === TitleSidebar.NOTES_LIST ||
            name === TitleSidebar.RESOURCES ||
            name === TitleSidebar.RESULTS ||
            name === TitleSidebar.EXAM ||
            name === TitleSidebar.DASHBOARD ||
            Icon === 'stats-chart-sharp' ||
            Icon === 'profile-detail')
            ? 'hidden'
            : ''
        }
        ${
          isInCourse &&
          (name === TitleSidebar.COURSES ||
            name === TitleSidebar.EXAM_LIST ||
            name === TitleSidebar.ENTRANCE_TEST ||
            // hidden when in course
            name === TitleSidebar.CALENDAR ||
            // hidden when in course
            name === LANG_SIGNIN.eventTest ||
            checkIsHiddenDashboard(
              JSON.parse(localStorage.getItem('courseInfo') as any),
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
        onClick={() => onClickMenuItem()}
      >
        <div
          className={`sidebar-item flex items-center ${
            Icon === 'avatar' || Icon === 'profile-detail' ? '-ml-2' : ''
          }`}
        >
          {url !== '#' && !isEmpty(url) ? (
            <Link
              href={
                url === PageLink.RESULTS
                  ? `/courses/my-course/${router?.query?.courseId || router?.query?.id}/results`
                  : url === PageLink.DASHBOARD
                    ? `/courses/my-course/${router?.query?.courseId || router?.query?.id}/dashboard`
                    : name === TitleSidebar.COURSE_CONTENT
                      ? `/courses/my-course/${router?.query?.courseId || router?.query?.id}`
                      : url
              }
              // passHref
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
              className={clsx(
                `transition-all duration-200 ease-in-out ${selected ? 'bg-primary text-white' : ''}`,
                {
                  'group-hover:text-gray-800': !selected,
                },
              )}
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
              options={subItems || []}
              setOpenResource={setOpenResource}
              closeSideBar={closeSideBar}
              setOpenExaminationInfo={setOpenExaminationInfo}
            />
          </div>
        ) : null}
      </div>
      <SappNotificationComponent
        notifyDetail={{
          ...notifyDetail,
          send_time: notifyDetail?.send_time || '', // Ensure send_time is always a string
        }}
        tabs={tabs}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        handleMarkAll={handleMarkAll}
        handleMarkById={handleMarkById}
        handleUnMarkById={handleUnMarkById}
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
      />
    </>
  )
}
