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

type MenuItemProps = {
  menuItem: MenuItemType
  setOpenResource: Dispatch<SetStateAction<boolean>>
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
  const isDetailCourse =
    router.pathname.includes('/my-course') ||
    router.pathname.includes('/section') ||
    router.pathname.includes('/activity')
  const selected =
    router.pathname === url || (Icon === 'stats-chart-sharp' && isDetailCourse)
  const isNested = subItems && subItems?.length > 0

  const onClick = () => {
    toggleExpanded((prev) => !prev)
  }

  const handleOpenResource = () => {
    setOpenResource(true)
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

  const handleActive = () => {
    if (router?.query?.courseId || router.query.id) {
      name === 'Resource' && handleOpenResource()
      name === 'Notes List' && handleOpenNotesList()
      name === 'Create Note' && handleAddNote()
    }
  }

  const isActivity = router?.query?.activityId
  const isInCourse =
    router?.query?.courseId ||
    router?.query?.activityId ||
    router?.query?.course_section_id

  return (
    <>
      {isActivity && name === 'Create Note' && (
        <div className="h-px w-[calc(100%-48px)] bg-gray-2 text-center mx-auto"></div>
      )}
      <div
        className={`cursor-pointer hover:bg-secondary ${
          selected && type === 'level-1'
            ? 'pl-6 border-l-4 pr-1 border-active'
            : 'pl-7'
        } relative sidebar-list-items py-2 mb-4 last:mb-0 ${
          !isActivity && (name === 'Create Note' || name === 'Caculator')
            ? 'hidden'
            : name === 'Create Note'
              ? 'mt-4'
              : ''
        }
        ${
          !isInCourse &&
          (name === 'Notes List' ||
            name === 'Resource' ||
            name === 'Result' ||
            Icon === 'stats-chart-sharp')
            ? 'hidden'
            : ''
        }
        ${
          isInCourse &&
          (name === 'Courses' || name === 'Entrance Test' || Icon === 'grid')
            ? 'hidden'
            : ''
        }
        `}
      >
        <div
          className={`sidebar-item flex items-center group ${
            Icon === 'avatar' ? '-ml-2' : ''
          }`}
          onClick={() => closeSideBar()}
        >
          <Link href={url} passHref>
            <div className="flex items-center" onClick={handleActive}>
              {Icon === 'avatar' ? (
                <div className="w-10 h-10 shrink-0">
                  <Image
                    src={
                      user.detail.avatar['40x40'] ||
                      user.detail.avatar['ORIGIN'] ||
                      blankAvatar
                    }
                    alt="avatar"
                    className="rounded-full"
                    width={40}
                    height={40}
                  />
                </div>
              ) : (
                <ExpandIcon
                  type={Icon}
                  className={`before-icon shrink-0 min-w-6 min-h-6 ${
                    selected ? 'text-primary' : 'text-gray-2'
                  } group-hover:text-primary 
                  `}
                />
              )}

              {Icon === 'avatar' ? (
                <div
                  className={`label hidden text-base font-semibold pl-2 avatar ${
                    selected ? 'text-primary' : 'text-gray-2'
                  } group-hover:text-primary`}
                >
                  <div className="text-base font-semibold text-bw-1 line-clamp-1">
                    {user?.detail?.full_name}
                  </div>
                  <div className="text-medium-sm font-normal line-clamp-1">
                    {user?.type?.toLowerCase()}
                  </div>
                </div>
              ) : (
                <span
                  className={`label hidden text-base font-semibold pl-4 line-clamp-1 ${
                    selected ? 'text-primary' : 'text-gray-2'
                  } group-hover:text-primary`}
                >
                  {name}
                </span>
              )}
            </div>
          </Link>
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
