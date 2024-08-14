import blankAvatar from '@assets/images/blank_avatar.webp'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction, useState } from 'react'
import { useAppSelector, useAppDispatch } from 'src/redux/hook'
import { userReducer } from 'src/redux/slice/User/User'
import { MenuItem as MenuItemType } from '../../../constants/menu-items'
import ExpandIcon from '../ExpandIcon'
import MenuItemsList from '../MenuItemsList'
import { activeNotesList, pushNotes } from 'src/redux/slice/Course/NotesList'
import { v4 as uuidv4 } from 'uuid'
import { TitleSidebar } from 'src/constants'
import { openCalculator } from 'src/redux/slice/Course/MyCourse/Activity/Activity'
import { trackGAEvent } from '@utils/google-analytics'

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
  const [isExpanded, toggleExpanded] = useState(false)
  const dispatch = useAppDispatch()
  const { user } = useAppSelector(userReducer)
  const router = useRouter()
  // const isDetailCourse =
  //   router.pathname.includes('/my-course') ||
  //   router.pathname.includes('/section') ||
  //   router.pathname.includes('/activity')

  // const isProfile =
  //   Icon === 'avatar' &&
  //   (router.asPath === '/myprofile' ||
  //     router.asPath === '/certificates' ||
  //     router.asPath === '/settings' ||
  //     router.asPath === '/login_history' ||
  //     router.asPath === '/devices')

  const selected = router.pathname === url

  const isNested = subItems && subItems?.length > 0

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
      pathname: `/courses/my-course/${router.query.courseId}/results`,
    })
  }

  const handleActive = () => {
    if (router?.query?.courseId || router.query.id) {
      name === TitleSidebar.RESOURCES && handleOpenResource()
      name === TitleSidebar.NOTES_LIST && handleOpenNotesList()
      name === TitleSidebar.NEW_NOTE && handleAddNote()
      name === TitleSidebar.CALCULATOR && handleOpenCalculator()
      name === TitleSidebar.RESULTS && handleOpenResultsPage()
    }
  }

  const isActivity = router?.query?.activityId
  const isInCourse =
    router?.query?.courseId ||
    router?.query?.activityId ||
    router?.query?.course_section_id

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
          type === 'level-1' &&
          Icon !== 'avatar' &&
          Icon !== 'profile-detail'
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
          (name === TitleSidebar.NOTES_LIST ||
            name === TitleSidebar.RESOURCES ||
            name === TitleSidebar.RESULTS ||
            Icon === 'stats-chart-sharp' ||
            Icon === 'profile-detail')
            ? 'hidden'
            : ''
        }
        ${
          isInCourse &&
          (name === TitleSidebar.COURSES ||
            name === TitleSidebar.ENTRANCE_TEST ||
            Icon === 'grid' ||
            Icon === 'avatar')
            ? 'hidden'
            : ''
        }
        `}
      >
        <div
          className={`sidebar-item flex items-center ${
            Icon === 'avatar' || Icon === 'profile-detail' ? '-ml-2' : ''
          }`}
          onClick={() => closeSideBar()}
        >
          {url !== '#' ? (
            <Link href={url} passHref>
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
    </>
  )
}
