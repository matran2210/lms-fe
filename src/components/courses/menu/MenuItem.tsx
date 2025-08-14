import blankAvatar from '@assets/images/blank_avatar.webp'
import { trackGAEvent } from '@utils/google-analytics'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { PageLink, TitleSidebar } from 'src/constants'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import {
  activeNotesList,
  pushNotes,
} from 'src/redux/slice/Course/ShortCourse/NoteList/ShortNoteList'
import { userReducer } from 'src/redux/slice/User/User'
import { v4 as uuidv4 } from 'uuid'
import { LANG_SIGNIN } from 'src/constants/lang'
import ExpandIcon from '@components/layout/ExpandIcon'
import MenuItemsList from './MenuItemsList'
import { MenuItemProps } from 'src/constants/courses3level/sidebar'
import { CourseInfo } from 'src/type/courses-3-level'
import { ROUTES } from 'src/constants/courses3level/courses'
import { useMasterFinanceContext } from '@contexts/MasterFinance'
import { openCalculator } from 'src/redux/slice/Course/ShortCourse/Activity/Activity'
import {
  getCountUnRead,
  loadMoreNotification,
} from 'src/redux/slice/Notification/Notification'
import SappNotificationComponent from 'sapp-notification'
import { useNotification } from 'src/hooks/useNotification'
import { isEmpty } from 'lodash'
export default function MenuItem({
  menuItem: { name, icon: Icon, url, type, subItems },
  setOpenResource,
  closeSideBar,
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
  const { setIsOpenCourseResource } = useMasterFinanceContext()
  const isFetching = useRef(false)
  const pagination = useAppSelector((state) => state.notificationReducer.meta)

  const isNested = subItems && subItems?.length > 0

  const onClick = () => {
    toggleExpanded((prev) => !prev)
  }

  const handleOpenNotesList = () => {
    dispatch(activeNotesList())
    document.body.style.overflow = 'hidden'
  }

  const handleOpenCourseResource = () => {
    setIsOpenCourseResource(true)
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

  const handleViewNotification = (link: string) => {
    router.push({
      pathname: link,
    })
  }

  const handleActive = () => {
    if (url === PageLink.NOTIFICATION) {
      setOpenNotification(true)
      if (isEmpty(notifyLists)) {
        refreshNotification(false)
      }
    }
    if (router?.query?.courseId || router.query.id) {
      name === TitleSidebar.NOTES_LIST && handleOpenNotesList()
      name === TitleSidebar.ADD_NOTE && handleAddNote()
      name === TitleSidebar.CALCULATOR && handleOpenCalculator()
      name === TitleSidebar.COURSE_RESOURCES && handleOpenCourseResource()
    }
  }

  const isActivity = router?.query?.courseId && router?.query?.id
  const selected =
    router.pathname === url
      ? true
      : isActivity
        ? name === TitleSidebar.COURSE_CONTENT
        : name === TitleSidebar.COURSES

  const checkIsHiddenDashboard = (info: CourseInfo) => {
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
          <div className="h-10 w-10 shrink-0">
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
                    user?.detail?.avatar?.['40x40'] ||
                    user?.detail?.avatar?.['ORIGIN'] ||
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
                className={`before-icon min-h-6 min-w-6 shrink-0 ${
                  selected ? 'text-white' : 'text-shade-icon'
                } group-hover:text-white 
                `}
              />
            )}
          </>
        )}
        {Icon === 'avatar' ? (
          <div
            className={`label avatar pl-2 text-base font-normal transition-all duration-150 md:invisible md:opacity-0 ${
              selected ? 'text-white' : 'text-shade-icon'
            } group-hover:text-white`}
          >
            <div className="line-clamp-1 text-base font-semibold text-shade-icon group-hover:text-white">
              {user?.detail?.full_name}
            </div>
            <div className="line-clamp-1 text-ssm font-normal capitalize text-shade-icon group-hover:text-white">
              {user?.type?.toLowerCase()}
            </div>
          </div>
        ) : (
          <>
            {Icon === 'profile-detail' ? (
              <span
                className={`label line-clamp-1 pl-4 text-base font-normal transition-all duration-150 md:invisible md:opacity-0 ${
                  selected ? 'text-white' : 'text-shade-icon'
                } group-hover:text-white`}
              >
                {user?.detail?.full_name}
              </span>
            ) : (
              <span
                className={`label line-clamp-1 pl-4 text-base font-normal transition-all duration-150 md:invisible md:opacity-0 ${
                  selected ? 'text-white' : 'text-shade-icon'
                } group-hover:text-white`}
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

  const profileUrl = router.pathname?.startsWith(PageLink.SHORT_COURSE)
    ? `${PageLink.SHORT_COURSE_PROFILE}`
    : `${PageLink.MYPROFILE}`

  return (
    <>
      {isActivity && name === TitleSidebar.CALCULATOR && (
        <div className="bg-gray-2 mx-auto h-px w-[calc(100%-48px)] text-center"></div>
      )}
      <div
        className={`group mx-0 cursor-pointer rounded px-3 py-2 hover:bg-primary md:mx-3 md:px-4 ${
          selected &&
          ((type === 'level-1' &&
            Icon !== 'avatar' &&
            Icon !== 'profile-detail') ||
            (type === 'level-2' && Icon === 'result'))
            ? 'bg-primary'
            : ''
        }  relative mb-4 py-2 last:mb-0 ${
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
        `}
      >
        <div
          className={`sidebar-item flex max-h-[24px]  items-center ${
            Icon === 'avatar' || Icon === 'profile-detail' ? '-ml-2' : ''
          }`}
          onClick={() => closeSideBar()}
        >
          {url !== '#' && url !== PageLink.NOTIFICATION ? (
            <Link
              href={
                url === PageLink.DASHBOARD
                  ? `${ROUTES.MY_COURSES}${router?.query?.courseId || router?.query?.id}/dashboard`
                  : name === TitleSidebar.COURSE_CONTENT
                    ? `${url}/${router?.query?.courseId || router?.query?.id}`
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
              className={`${
                selected ? 'text-primary' : ''
              } group-hover:text-primary`}
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
              setOpenResource={setOpenResource}
              closeSideBar={closeSideBar}
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
      )}
    </>
  )
}
