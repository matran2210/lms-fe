import blankAvatar from '@assets/images/blank_avatar.webp'
import { trackGAEvent } from '@utils/google-analytics'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { LOCAL_STORAGE_KEYS, PageLink, TitleSidebar } from 'src/constants'
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

type MenuItemProps = {
  menuItem: MenuItemType
  setOpenResource?: Dispatch<SetStateAction<boolean>>
  closeSideBar: () => void
}

export default function MenuItem({
  menuItem: { name, icon: Icon, url, type, subItems },
  setOpenResource,
  closeSideBar,
}: MenuItemProps) {
  const [notificationUnread, setNotificationUnread] = useState(() => {
    return parseInt(storedCount ?? '0', 10)
  })
  const storedCount = localStorage.getItem(
    LOCAL_STORAGE_KEYS.NOTIFICATION_COUNT,
  )
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

  const handleOpenResultsPage = () => {
    router.push({
      pathname: `/courses/my-course/${router.query.courseId || router.query.id}/results`,
    })
  }

  const handleOpenExaminationInfoPage = () => {
    router.push({
      pathname: `/courses/my-course/${router.query.courseId || router.query.id}/exam-information`,
    })
  }

  const handleActive = () => {
    if (isEmpty(url)) {
      setOpenNotification(true)
      if (isEmpty(notifyLists)) {
        refreshNotification(false)
      }
    }
    if (router?.query?.courseId || router.query.id) {
      name === TitleSidebar.RESOURCES && handleOpenResource()
      name === TitleSidebar.NOTES_LIST && handleOpenNotesList()
      name === TitleSidebar.NEW_NOTE && handleAddNote()
      name === TitleSidebar.CALCULATOR && handleOpenCalculator()
      name === TitleSidebar.RESULTS && handleOpenResultsPage()
      name === TitleSidebar.EXAM_INFORMATION && handleOpenExaminationInfoPage()
    }
  }

  const isActivity = router?.query?.activityId
  const isInCourse =
    router?.query?.courseId ||
    router?.query?.activityId ||
    router?.query?.course_section_id

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

  useEffect(() => {
    window.addEventListener('storage', (e) => {
      const count = localStorage.getItem(LOCAL_STORAGE_KEYS.NOTIFICATION_COUNT)
      setNotificationUnread(parseInt(count ?? '0', 10))
    })

    return () => window.removeEventListener('storage', () => {})
  }, [])

  const renderMenuContent = () => {
    return (
      <div className="flex items-center" onClick={handleActive}>
        {Icon === 'avatar' ? (
          <div className="h-10 w-10 shrink-0">
            {user?.detail?.avatar['40x40'] || user.detail.avatar['ORIGIN'] ? (
              <Image
                src={
                  user.detail.avatar['40x40'] || user.detail.avatar['ORIGIN']
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
                    user.detail.avatar['40x40'] ||
                    user.detail.avatar['ORIGIN'] ||
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
                  selected ? 'text-primary' : 'text-gray-2'
                } group-hover:text-primary 
                `}
              />
            )}
          </>
        )}
        {Icon === 'avatar' ? (
          <div
            className={`label avatar invisible pl-4 text-base font-normal opacity-0 transition-all duration-150 ${
              selected ? 'text-primary' : 'text-gray-2'
            } group-hover:text-primary`}
          >
            <div className="line-clamp-1 text-base font-semibold text-bw-1 group-hover:text-primary">
              {user?.detail?.full_name}
            </div>
            <div className="line-clamp-1 text-medium-sm font-normal capitalize text-gray-1 group-hover:text-primary">
              {user?.type?.toLowerCase()}
            </div>
          </div>
        ) : (
          <>
            {Icon === 'profile-detail' ? (
              <span
                className={`label invisible line-clamp-1 pl-4 text-base font-normal opacity-0 transition-all duration-150 ${
                  selected ? 'text-primary' : 'text-gray-2'
                } group-hover:text-primary`}
              >
                {user?.detail?.full_name}
              </span>
            ) : (
              <span
                className={`label invisible line-clamp-1 pl-4 text-base font-normal opacity-0 transition-all duration-150 ${
                  selected ? 'text-primary' : 'text-gray-2'
                } group-hover:text-primary`}
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
        <div className="mx-auto h-px w-[calc(100%-48px)] bg-gray-2 text-center"></div>
      )}
      <div
        className={`group cursor-pointer hover:bg-secondary ${
          selected &&
          ((type === 'level-1' &&
            Icon !== 'avatar' &&
            Icon !== 'profile-detail') ||
            (type === 'level-2' && Icon === 'result'))
            ? 'border-l-4 border-active pl-6 pr-1'
            : 'pl-7'
        } sidebar-list-items relative mb-4 py-2 last:mb-0 ${
          !isActivity &&
          (name === TitleSidebar.NEW_NOTE || name === TitleSidebar.CALCULATOR)
            ? 'hidden'
            : name === TitleSidebar.NEW_NOTE
              ? 'mt-4'
              : ''
        }
        ${
          !isInCourse &&
          (name === TitleSidebar.COURSE_CONTENT ||
            name === TitleSidebar.NOTES_LIST ||
            name === TitleSidebar.RESOURCES ||
            name === TitleSidebar.RESULTS ||
            name === TitleSidebar.EXAM_INFORMATION ||
            name === TitleSidebar.DASHBOARD ||
            Icon === 'stats-chart-sharp' ||
            Icon === 'profile-detail')
            ? 'hidden'
            : ''
        }
        ${
          isInCourse &&
          (name === TitleSidebar.COURSES ||
            name === TitleSidebar.ENTRANCE_TEST ||
            // hidden when not in course
            name === LANG_SIGNIN.eventTest ||
            checkIsHiddenDashboard(
              JSON.parse(localStorage.getItem('courseInfo') as any),
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
          {url !== '#' && !isEmpty(url) ? (
            <Link
              href={
                url === PageLink.RESULTS
                  ? `/courses/my-course/${router?.query?.courseId || router?.query?.id}/results`
                  : url === PageLink.DASHBOARD
                    ? `/courses/my-course/${router?.query?.courseId || router?.query?.id}/dashboard`
                    : name === TitleSidebar.COURSE_CONTENT
                      ? `${url}/${router?.query?.courseId || router?.query?.id}`
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
        />
      )}
    </>
  )
}
