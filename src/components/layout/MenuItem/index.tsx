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
import SappNotificationComponent from 'sapp-notification'
import { useNotification } from 'src/hooks/useNotification'
import { Divider } from 'antd'
import clsx from 'clsx'
import myCourseAnimationIcon from 'public/animations/MyCourse.json'
import addNoteAnimationIcon from 'public/animations/AddNote.json'
import resourceAnimationIcon from 'public/animations/Resource.json'
import calculatorAnimationIcon from 'public/animations/Calculator.json'
import calendarAnimationIcon from 'public/animations/Calendar.json'
import courseContentAnimationIcon from 'public/animations/CourseContent.json'
import dashboardAnimationIcon from 'public/animations/Dashboard.json'
import entranceTestAnimationIcon from 'public/animations/EntranceTest.json'
import examListAnimationIcon from 'public/animations/ExamList.json'
import eventTestAminationIcon from 'public/animations/EventTest.json'
import examInfoAnimationIcon from 'public/animations/ExamInfo.json'
import noteListAnimationIcon from 'public/animations/NoteList.json'
import testQuizListAnimationIcon from 'public/animations/TestQuizList.json'
import Lottie from 'lottie-react'
import { clearNotifications } from 'src/redux/slice/Notification/Notification'

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

  useEffect(() => {
    if (selectedTab) {
      dispatch(clearNotifications())
    }
  }, [selectedTab])

  const [isExpanded, toggleExpanded] = useState(false)
  const dispatch = useAppDispatch()
  const { user } = useAppSelector(userReducer)
  const router = useRouter()
  const isNested = subItems && subItems?.length > 0
  const selected = router.pathname === url

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

  const onClickMenuItem = () => {
    const hasCourseContext = router?.query?.courseId || router?.query?.id

    // Nếu url trống => là menu Notification
    if (isEmpty(url)) {
      setOpenNotification(true)
      if (isEmpty(notifyLists)) {
        refreshNotification(false)
      }
      closeSideBar()
      return
    }

    // Nếu đang ở trong course
    if (hasCourseContext) {
      switch (name) {
        case TitleSidebar.COURSE_CONTENT:
          handleOpenCourseContentPage()
          break
        case TitleSidebar.RESOURCES:
          handleOpenResource()
          break
        case TitleSidebar.NOTES_LIST:
          handleOpenNotesList()
          break
        case TitleSidebar.NEW_NOTE:
          handleAddNote()
          break
        case TitleSidebar.CALCULATOR:
          handleOpenCalculator()
          break
        case TitleSidebar.RESULTS:
          handleOpenResultsPage()
          break
        case TitleSidebar.EXAM:
          handleOpenExaminationInfoPage()
          break
        default:
          // Nếu có url cụ thể
          if (url && url !== '#') {
            const targetUrl =
              url === PageLink.RESULTS
                ? `/courses/my-course/${router.query.courseId || router.query.id}/results`
                : url === PageLink.DASHBOARD
                  ? `/courses/my-course/${router.query.courseId || router.query.id}/dashboard`
                  : name === TitleSidebar.COURSE_CONTENT
                    ? `/courses/my-course/${router.query.courseId || router.query.id}`
                    : url

            router.push({ pathname: targetUrl })
          }
          break
      }
    } else {
      // Nếu không ở trong course thì chỉ điều hướng URL bình thường
      if (url && url !== '#') router.push({ pathname: url })
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
    (router?.query?.activityId && name !== TitleSidebar.EXAM) ||
    (router?.query?.course_section_id && name !== TitleSidebar.EXAM)
  const isInMyProfile = router.asPath === PageLink.MYPROFILE
  const checkIsHiddenDashboard = (info: any) => {
    return name == TitleSidebar.DASHBOARD && !info
  }

  const animationClass = clsx(
    `before-icon w-6 h-6 hidden group-hover/menuItem:block`,
  )
  const renderIcon = () => {
    switch (Icon) {
      case 'course':
      case 'course-content':
      case 'activity':
        return (
          <Lottie
            animationData={myCourseAnimationIcon}
            loop
            autoplay
            className={animationClass}
          />
        )
      case 'notes-list':
        return (
          <Lottie
            animationData={noteListAnimationIcon}
            loop
            autoplay
            className={animationClass}
          />
        )
      case 'create-note':
        return (
          <Lottie
            animationData={addNoteAnimationIcon}
            loop
            autoplay
            className={animationClass}
          />
        )
      case 'learning-resource':
        return (
          <Lottie
            animationData={resourceAnimationIcon}
            loop
            autoplay
            className={animationClass}
          />
        )
      case 'caculator':
        return (
          <Lottie
            animationData={calculatorAnimationIcon}
            loop
            autoplay
            className={animationClass}
          />
        )
      case 'calendar':
        return (
          <Lottie
            animationData={calendarAnimationIcon}
            loop
            autoplay
            className={animationClass}
          />
        )
      case 'grid':
        return (
          <Lottie
            animationData={dashboardAnimationIcon}
            loop
            autoplay
            className={animationClass}
          />
        )
      case 'entrance-test':
        return (
          <Lottie
            animationData={entranceTestAnimationIcon}
            loop
            autoplay
            className={animationClass}
          />
        )
      case 'exam_list':
        return (
          <Lottie
            animationData={examListAnimationIcon}
            loop
            autoplay
            className={animationClass}
          />
        )
      case 'result':
        return (
          <Lottie
            animationData={testQuizListAnimationIcon}
            loop
            autoplay
            className={animationClass}
          />
        )
      case 'bookmark':
        return (
          <Lottie
            animationData={courseContentAnimationIcon}
            loop
            autoplay
            className={animationClass}
          />
        )
      case 'event-test':
        return (
          <Lottie
            animationData={eventTestAminationIcon}
            loop
            autoplay
            className={animationClass}
          />
        )
      case 'exam-information':
        return (
          <Lottie
            animationData={examInfoAnimationIcon}
            loop
            autoplay
            className={animationClass}
          />
        )

      default:
        return (
          <Lottie
            animationData={myCourseAnimationIcon}
            loop
            autoplay
            className={animationClass}
          />
        )
        break
    }
  }

  const isShowHoverIcon = () => {
    return !['notification'].includes(Icon)
  }

  const renderMenuContent = () => {
    return (
      <div className="flex items-center">
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
              <>
                {!selected && isShowHoverIcon() && renderIcon()}
                <ExpandIcon
                  type={Icon}
                  className={clsx(
                    `before-icon min-h-6 min-w-6 shrink-0 ${
                      selected ? 'bg-primary text-white' : 'text-gray-800'
                    }`,
                    {
                      'group-hover:text-gray-800': !selected,
                      'group-hover/menuItem:hidden':
                        !selected && isShowHoverIcon(),
                    },
                  )}
                />
              </>
              // <ExpandIcon
              //   type={Icon}
              //   className={clsx(
              //     `before-icon min-h-6 min-w-6 shrink-0 ${
              //       selected ? 'bg-primary text-white' : 'text-gray-800'
              //     }`,
              //     {
              //       'group-hover:text-gray-800': !selected,
              //     },
              //   )}
              // />
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
                  `label invisible line-clamp-1 pl-4 text-base font-normal opacity-0 transition-all duration-200 ease-in-out ${
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
          `group/menuItem transform cursor-pointer rounded transition-all duration-200 ease-in-out ${
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
        handleMarkAll={() => handleMarkAll(selectedTab)}
        handleMarkById={(ids: string[]) => handleMarkById(ids, selectedTab)}
        handleUnMarkById={(ids: string[]) => handleUnMarkById(ids, selectedTab)}
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
    </>
  )
}
